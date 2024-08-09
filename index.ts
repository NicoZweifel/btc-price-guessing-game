import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as dockerBuild from "@pulumi/docker-build";
import * as pulumi from "@pulumi/pulumi";
import * as cloudflare from "@pulumi/cloudflare";
import * as tls from "@pulumi/tls";

const config = new pulumi.Config();

const domain = config.require("domain");
const subdomain = config.require("subdomain");
const hostname = `${subdomain}.${domain}`;

const default_vpc = new aws.ec2.DefaultVpc("default", {
  tags: {
    Name: "Default VPC",
  },
});

const vpc = awsx.classic.ec2.Vpc.fromExistingIds("classic_vpc", {
  vpcId: default_vpc.id,
});

const cluster = new awsx.classic.ecs.Cluster("cluster", { vpc: vpc });

const private_key = new tls.PrivateKey("private-key", {
  algorithm: "RSA",
  rsaBits: 2048,
});

const cert_request = new tls.CertRequest("cert-request", {
  privateKeyPem: private_key.privateKeyPem,
  subject: {
    commonName: hostname,
    organization: domain,
  },
});

const origin_ca_certificate = new cloudflare.OriginCaCertificate("origin-ca", {
  csr: cert_request.certRequestPem,
  hostnames: [hostname],
  requestType: "origin-rsa",
  requestedValidity: 90,
});

const key = private_key.privateKeyPem;
const cert = origin_ca_certificate.certificate;
const lb_cert = new aws.iam.ServerCertificate("cert", {
  certificateBody: cert,
  privateKey: key,
});

const tg = new aws.lb.TargetGroup("tg", {
  vpcId: vpc.id,
  port: 3000,
  targetType: "ip",
  protocol: "HTTP",
  healthCheck: {
    path: "/api/health",
    
  },
});

const subnets = default_vpc.id.apply((x) =>
  aws.ec2.getSubnets({ filters: [{ name: "vpc-id", values: [x] }] }),
);

const cache_subnet_group = new aws.elasticache.SubnetGroup(
  "redis-subnet-group",
  {
    subnetIds: subnets.ids,
  },
);

const redis_sg = new awsx.classic.ec2.SecurityGroup("redis-sg", {
  vpc,
});

const redis = new aws.elasticache.Cluster("redis-cluster", {
  engine: "redis",
  securityGroupIds: [redis_sg.id],
  nodeType: "cache.t3.small",
  numCacheNodes: 1,
  port: 6379,
  subnetGroupName: cache_subnet_group.name,
});

const loadbalancer = new awsx.classic.lb.ApplicationLoadBalancer(
  "loadbalancer",
  {
    vpc,
    subnets: subnets.ids,
  },
);

const lb_tg = loadbalancer.createTargetGroup("lb_tg", {
  targetGroup: tg,
});

const listener = loadbalancer.createListener("listener", {
  port: 443,
  certificateArn: lb_cert.arn,
  protocol: "HTTPS",
  targetGroup: lb_tg,
});

loadbalancer.createListener("listener-80", {
  port: 80,
  protocol: "HTTP",
  defaultAction: {
    type: "redirect",
    redirect: {
      protocol: "HTTPS",
      port: "443",
      statusCode: "HTTP_301",
    },
  },
});

loadbalancer.createListener("listener-https", {
  port: 3000,
  protocol: "HTTP",
  defaultAction: {
    type: "redirect",
    redirect: {
      protocol: "HTTPS",
      port: "443",
      statusCode: "HTTP_301",
    },
  },
});

const url = listener.endpoint.hostname;

new cloudflare.Record("dns_record", {
  zoneId: config.requireSecret("zone"),
  name: subdomain,
  content: url,
  type: "CNAME",
  ttl: 1,
  proxied: true,
});

const ecr = new awsx.ecr.Repository("repo", {
  forceDelete: true,
});

const auth = aws.ecr.getAuthorizationTokenOutput({
  registryId: ecr.repository.registryId,
});

const image = new dockerBuild.Image("image", {
  cacheFrom: [
    {
      registry: {
        ref: pulumi.interpolate`${ecr.repository.repositoryUrl}:cache`,
      },
    },
  ],
  cacheTo: [
    {
      registry: {
        imageManifest: true,
        ociMediaTypes: true,
        ref: pulumi.interpolate`${ecr.repository.repositoryUrl}:cache`,
      },
    },
  ],
  platforms: [dockerBuild.Platform.Linux_amd64],
  push: true,
  registries: [
    {
      address: ecr.repository.repositoryUrl,
      password: auth.password,
      username: auth.userName,
    },
  ],
  tags: [pulumi.interpolate`${ecr.repository.repositoryUrl}:latest`],
  context: {
    location: "app",
  },
});

const service = new awsx.ecs.FargateService("service", {
  cluster: cluster.cluster.arn,
  assignPublicIp: true,
  desiredCount: 2,
  taskDefinitionArgs: {
    container: {
      name: "service-container",
      image: image.ref,
      cpu: 1024,
      memory: 2048,
      essential: true,
      environment: [
        {
          name: "REDIS",
          value: pulumi.interpolate`redis://${redis.cacheNodes[0].address}:${redis.cacheNodes[0].port}`,
        },
      ],
      portMappings: [
        {
          containerPort: 3000,
          targetGroup: tg,
        },
      ],
    },
  },
});

awsx.classic.ec2.SecurityGroupRule.ingress(
  "redis-inbound",
  redis_sg,
  {
    sourceSecurityGroupId: service.service.networkConfiguration.apply(
      (x) => x?.securityGroups?.[0]!,
    ),
  },
  {
    fromPort: 6379,
    protocol: "-1",
  },
  "ecs service sg ingress ",
);

export const lb_url = pulumi.interpolate`http://${url}`
export const address = `https://${hostname}`
