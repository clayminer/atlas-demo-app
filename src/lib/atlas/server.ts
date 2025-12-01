import { AtlasNextServerClient } from "@runonatlas/next/server";
import { NextRequest } from "next/server";
import { ATLAS_USER_HEADER_KEY } from "./constants";

const apiKey = process.env.ATLAS_API_KEY;
const atlasEnv = process.env.ATLAS_ENV?.toLowerCase();
const atlasHost =
  atlasEnv === "dev"
    ? "https://dev.platform.runonatlas.com"
    : "https://platform.runonatlas.com";

if (!apiKey) {
  throw new Error(
    "Missing ATLAS_API_KEY environment variable required for Atlas SDK.",
  );
}

async function resolveUserId(request: NextRequest) {
  const userId = request.headers.get(ATLAS_USER_HEADER_KEY);
  return userId ? userId.trim() : null;
}

export const atlasServerClient = new AtlasNextServerClient(resolveUserId, {
  baseClientOptions: {
    apiKey,
    // Use ATLAS_ENV=dev in .env.* to point at the dev Atlas host; defaults to prod.
    _atlasHost: atlasHost,
  },
  eventsFlushAt: 1,
  eventsFlushInterval: 10,
});
