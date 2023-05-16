import { SubscriptionInfo } from "@/types";
import configStore from "../config/slice";
import { formatTime } from "@/utils";

async function proxyUsage() {
  const host = configStore.getState().config.api;
  const key = configStore.getState().config.api_key;
  const subscriptionRes = await fetch(
    "/api/proxy/dashboard/billing/subscription",
    {
      headers: {
        "x-proxy-host": host ? host : "",
        "x-proxy-key": key ? key : "",
      },
    }
  );

  if (subscriptionRes.status !== 200) {
    return 0;
  }

  const subscriptionData = await subscriptionRes.json();
  let remaining = subscriptionData?.hard_limit_usd || 0;
  const now = new Date();
  const usageUrl = `/api/proxy/dashboard/billing/usage`;
  let startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const subDate = new Date(now);
  subDate.setDate(1);

  if (remaining > 20) {
    startDate = subDate;
  }

  if (subscriptionData?.has_payment_method) {
    const day = now.getDate(); // 本月过去的天数
    startDate = new Date(now.getTime() - (day - 1) * 24 * 60 * 60 * 1000); // 本月第一天
  }

  const usageres = await fetch(
    `${usageUrl}?start_date=${formatTime(
      "yyyy-MM-dd",
      new Date(startDate)
    )}&end_date=${formatTime("yyyy-MM-dd", new Date(endDate))}`,
    {
      headers: {
        "x-proxy-host": host ? host : "",
        "x-proxy-key": key ? key : "",
      },
    }
  );

  if (usageres.status === 200) {
    const usageresData = await usageres.json();
    remaining -= usageresData?.total_usage / 100;
  }

  return remaining.toFixed(2);
}

export default {
  proxyUsage,
};
