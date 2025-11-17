import { NextRequest } from "next/server";
import { atlasServerClient } from "@/lib/atlas/server";

async function main() {
  const request = new NextRequest("http://localhost/api/atlas-api/status");
  const response = await atlasServerClient.handleRequest(request, ["status"]);
  console.log("status", response.status);
  console.log(await response.text());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
