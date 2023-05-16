import { getConfig } from "@/config";
import { getAiKey } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const hostValue = req.headers.get("x-proxy-host") ?? "";
  const keyValue = req.headers.get("x-proxy-key") ?? "";
  const removeSearchPath = (search: string) => {
    const searchObj = new URLSearchParams(search);
    searchObj.delete("path");
    const data = searchObj.toString();
    return data ? `?${searchObj.toString()}` : "";
  };
  const pathValue = `${req.nextUrl.pathname}${removeSearchPath(
    req.nextUrl.search
  )}`.replaceAll("/api/proxy", "");

  let url = hostValue + pathValue;
  let key = keyValue;
  if (!hostValue || !keyValue) {
    url = getConfig("baseUrl") + pathValue;
    key = getAiKey(getConfig("keys"));
  }

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    cache: "no-store",
    method: req.method,
    body: req.body,
  });

  return response;
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
