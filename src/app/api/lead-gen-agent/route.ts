import { NextRequest, NextResponse } from "next/server";
import { atlasServerClient } from "@/lib/atlas/server";
import { ATLAS_USER_HEADER_KEY } from "@/lib/atlas/constants";

const FEATURE_SLUG = "lead-gen-agent2";

export async function POST(request: NextRequest) {
  const customerId = request.headers.get(ATLAS_USER_HEADER_KEY);

  if (!customerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ok, features } = await atlasServerClient.areFeaturesAllowed(
      customerId,
      [FEATURE_SLUG],
    );

    if (!ok || !features[FEATURE_SLUG]) {
      return NextResponse.json(
        {
          error: "Lead generation agent is not available for this account.",
          code: "FEATURE_NOT_ALLOWED",
        },
        { status: 403 },
      );
    }

    await atlasServerClient.enqueueFeatureEvents({
      featureIds: [FEATURE_SLUG],
      customerId,
      quantity: 1,
    });

    await atlasServerClient.flushEvents();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to enqueue lead-gen-agent usage", error);
    return NextResponse.json(
      { error: "Unable to start lead generation agent right now." },
      { status: 500 },
    );
  }
}
