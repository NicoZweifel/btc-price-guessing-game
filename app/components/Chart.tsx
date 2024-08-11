"use client";

import { cn } from "@/utils";
import React, { useEffect, useRef, memo, ComponentProps } from "react";

function Chart({ className, ...props }: Omit<ComponentProps<"div">, "ref">) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "autosize": true,
          "symbol": "BITSTAMP:BTCUSD",
          "interval": "1",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "timezone": "Europe/Berlin",
          "style": "1",
          "locale": "en",
          "allow_symbol_change": true,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;
    container.current?.children.length == 2 &&
      container.current.appendChild(script);
  }, []);

  return (
    <div
      className={cn("tradingview-widget-container", className)}
      ref={container}
      {...props}
    >
      <div className="tradingview-widget-container__widget grow"></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="text-xs text-neutral-200/40">
            Track all markets on TradingView
          </span>
        </a>
      </div>
    </div>
  );
}

export default memo(Chart);
