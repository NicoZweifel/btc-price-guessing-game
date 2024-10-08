# BTC-price-guessing-game

A BTC price guessing game.

- [app](/app)
- [deployment](index.ts)

## Requirements

- [x] The player can at all times see their current score and the latest available BTC price in USD
- [x] The player can choose to enter a guess of either “up” or “down“
- [x] After a guess is entered the player cannot make new guesses until the existing guess is resolved
- [x] The guess is resolved when the price changes and at least 60 seconds have passed since the guess was made
- [x] If the guess is correct (up = price went higher, down = price went lower), the user gets 1 point added to their score. If the guess is incorrect, the user loses 1 point.
- [x] Players can only make one guess at a time
- [x] New players start with a score of 0
- [x] The guesses should be resolved fairly using BTC price data from any available 3rd party API
- [x] The score of each player should be persisted in a backend data store (AWS services preferred)
- [x] Optional: Players should be able to close their browser and return back to see their score and continue to make more guesses

## Solution

Guesses are UTC timestamps that get created on the server and are resolved against OHLC Data.

> [!IMPORTANT]
> **A guess is considered correct if the close of the following minute closed as predicted while also considering the price ranges, i.e. a close lower than the previous one with lower lows but higher highs is considered unchanged. In this case the next interval will be compared.**
>
> **A guess during high volatility could take some time to be resolved. The following intervals could be considered "unchanged" until a new high or low is established.**

This Approach was chosen for the following reasons:

- **Fairness:** It provides a clear and objective method for determining whether the price has moved up or down within a specific interval.
- **Accuracy:** Using OHLC data, especially high and low values, gives a reliable representation of the price range during that period.
- **Consistency:** The approach ensures consistent evaluation of guesses, reducing potential biases or ambiguities.
- **Reduced Latency:** By relying on pre-calculated OHLC data, the system can process guesses more efficiently.
- **Flexibility:** It can be adapted to different timeframes by adjusting the OHLC data accordingly.
- **Extensibility:** Additionally more precise OHLC Data from multiple sources could be considered as well as backend functionality to persist Live Market Order Data from multiple endpoints to create custom OHLC timeframes.

> [!NOTE]
> A drawback of this method is that guesses made towards the end of the interval are statistically "easier" than guesses made at the beginning. 
> This is because the player is betting on the result and range of the next interval, compared to the range of the current one.
> Players that take this into account and consider the current high and low when submitting a guess will make more effective guesses.
>
> **This applies to all players, creating a fair environment and providing consistent provable results.**


## Technical Decisions

- The [app](/app) uses [`Next.js`](https://nextjs.org/) combined with [`Tailwind`](https://tailwindui.com/), as it allowed for fast prototyping.
- [`TradingView`](https://www.tradingview.com/widget/advanced-chart/) is used to display an interactive OHLC Chart that uses Data from the [`Bitstamp` api](https://www.bitstamp.net/api/).
- The live price displayed is using Live Market Order Data that is received over a websocket connection
- Guesses are evaluated against OHLC Data. All Data is from [`Bitstamp`](https://www.bitstamp.net/api/).
- [`redis`](https://redis.io/) was chosen to persist/share/sync data because it is great for real time data or data types like rankings, scores etc.
- [`Pulumi`](https://www.pulumi.com/docs/) is used to deploy to AWS. This project is using Fargate as there is no need to automatically scale. 
- [`Cloudflare`](https://www.cloudflare.com/) is used to manage the DNS record and SSL certificate.
- [`Jest`](https://jestjs.io/) was chosen to run tests. 
- A Service layer is used, so that Application Logic can be easily tested against different test cases.

### Potential improvements

- More Data sources.
- Persisting/Aggregating Live Order Data.
- Custom OHLC Data with smaller timeframes (sub 1 min - limiting/eliminating the drawback of this solution).
- Weighted Averages to account for price distribution within the interval.
- Volatility Adjustment.
- Authentication and real accounts, as well as a relational Database.
- Could be hosted on Lambda by using [`OpenNEXT`](https://open-next.js.org/)(pulumi or terraform) or ECS with ec2 Instances could be used instead of Fargate.
- Workspaces could be used (complicates Docker setup).
- Components/UI could be organized and tested (state unit tests, snapshots, storybook). 

### Development

For Development instructions of the application please go [here](/app/README.md)

#### Format

Formatting can be done with [`prettier`](https://prettier.io/).

```bash
pnpm format
```

### Deployment

The deployment script is using [`Pulumi`](https://www.pulumi.com/docs/) and creates all required cloud resources on AWS, as well as getting a Certificate and creating a DNS Entry on Cloudflare.

> [!IMPORTANT]
> [`Pulumi`](https://www.pulumi.com/docs/), [`Cloudflare`](https://www.cloudflare.com/) and [`AWS`](https://aws.amazon.com/) Accounts are required to Preview or Update Cloud Resources.


#### Install dependencies
```
pnpm i
```

Make sure that you create your own stack with configuration like domain, subdomain and secrets that represent your cloudflare api token and zone ID respectively.

> [!TIP]  
> If you do not want to use Pulumi you can also use the Dockerfile or [`Docker-compose`](https://docs.docker.com/compose/). [Below](#Docker) is more information.

#### Create a Stack


```bash
pulumi stack init
```

Check the [config section](https://www.pulumi.com/docs/concepts/config/) and add your configuration, as well as secrets. 

#### Preview & Deploy

```bash
pulumi up
```

## Docker

A `Dockerfile` is included [here](/app/Dockerfile).


```bash
docker-compose up
```

This will create a Production Image and run it with a local redis instance.
