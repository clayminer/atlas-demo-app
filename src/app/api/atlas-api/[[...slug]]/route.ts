import { NextRequest } from "next/server";
import { atlasServerClient } from "@/lib/atlas/server";

type Params = {
  params: Promise<{ slug?: string[] }>;
};

async function handle(
  request: NextRequest,
  context: Params,
): Promise<Response> {
  const { slug = [] } = await context.params;
  return atlasServerClient.handleRequest(request, slug ?? []);
}

export async function GET(request: NextRequest, context: Params) {
  return handle(request, context);
}

export async function POST(request: NextRequest, context: Params) {
  return handle(request, context);
}

export async function PUT(request: NextRequest, context: Params) {
  return handle(request, context);
}

export async function PATCH(request: NextRequest, context: Params) {
  return handle(request, context);
}

export async function DELETE(request: NextRequest, context: Params) {
  return handle(request, context);
}
