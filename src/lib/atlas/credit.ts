import type {
  CustomerFeature,
  PricingModel,
  User,
} from "@runonatlas/react";

export const AI_INSIGHTS_FEATURE_SLUG = "ai-insights";
export const AI_INSIGHTS_PRICING_UNIT_ID = "ai-credits";

type PricingModelEntitlement = NonNullable<NonNullable<PricingModel["entitlements"]>[number]>;
type PricingModelPlan = NonNullable<NonNullable<PricingModel["plans"]>[number]>;
type PricingModelPlanEntitlement = NonNullable<NonNullable<PricingModelPlan["entitlements"]>[number]>;
type PricingModelPlanEntitlementPrice = PricingModelPlanEntitlement["price"];

function getCrossEnvironmentId(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const candidate = (value as { crossEnvironmentId?: unknown }).crossEnvironmentId;
  return typeof candidate === "string" && candidate.length > 0 ? candidate : undefined;
}

function getInternalId(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const candidate = (value as { internalId?: unknown }).internalId;
  return typeof candidate === "string" && candidate.length > 0 ? candidate : undefined;
}

function extractPriceValue(price?: PricingModelPlanEntitlementPrice | null): number | null {
  if (!price) {
    return null;
  }

  if ("price" in price && typeof price.price === "number") {
    return price.price;
  }

  if ("tiers" in price && Array.isArray(price.tiers) && price.tiers.length > 0) {
    return price.tiers[0]?.price ?? null;
  }

  return null;
}

type FeatureMetadata = {
  entitlementCandidates: Set<string>;
  entitlementFromPricing?: PricingModelEntitlement;
};

function resolveFeatureMetadata(
  featureSlug: string,
  customerFeatures?: CustomerFeature[] | null,
  pricingModel?: PricingModel | null,
): FeatureMetadata {
  const entitlementCandidates = new Set<string>();

  if (!featureSlug || !pricingModel) {
    return {
      entitlementCandidates,
    };
  }

  const slug = featureSlug.trim();
  const entitlementFromPricing = pricingModel.entitlements?.find(
    (entitlement) => entitlement.slug === slug,
  );

  const feature = customerFeatures?.find(
    (candidate) => candidate.id === slug || candidate.internalId === slug,
  );

  if (entitlementFromPricing?.id) {
    entitlementCandidates.add(entitlementFromPricing.id);
  }
  const entitlementCrossEnvId = getCrossEnvironmentId(entitlementFromPricing);
  if (entitlementCrossEnvId) {
    entitlementCandidates.add(entitlementCrossEnvId);
  }
  const featureInternalId = getInternalId(feature);
  if (featureInternalId) {
    entitlementCandidates.add(featureInternalId);
  }
  if (feature?.id) {
    entitlementCandidates.add(feature.id);
  }

  return {
    entitlementCandidates,
    entitlementFromPricing,
  };
}

type FindFeatureCreditArgs = {
  featureSlug: string;
  customerFeatures?: CustomerFeature[] | null;
  pricingModel?: PricingModel | null;
};

export function findFeatureCreditPrice({
  featureSlug,
  customerFeatures,
  pricingModel,
}: FindFeatureCreditArgs): number | null {
  if (!pricingModel) {
    return null;
  }

  const { entitlementCandidates, entitlementFromPricing } = resolveFeatureMetadata(
    featureSlug,
    customerFeatures,
    pricingModel,
  );

  for (const plan of pricingModel.plans ?? []) {
    for (const planEntitlement of plan.entitlements ?? []) {
      if (entitlementCandidates.has(planEntitlement.id)) {
        const price = extractPriceValue(planEntitlement.price);
        if (price !== null) {
          return price;
        }
      }
    }
  }

  return extractPriceValue(entitlementFromPricing?.price);
}

type FindFeatureCreditAllocationArgs = FindFeatureCreditArgs & {
  customerInfo?: User | null;
};

function collectActivePlanIds(customerInfo?: User | null) {
  const activePlanIds = new Set<string>();
  const subscriptions = customerInfo?.activeSubscriptions ?? [];
  for (const subscription of subscriptions) {
    const plan = subscription.plan;
    if (!plan) continue;
    if (plan.id) {
      activePlanIds.add(plan.id);
    }
    const crossEnvId = getCrossEnvironmentId(plan);
    if (crossEnvId) {
      activePlanIds.add(crossEnvId);
    }
  }
  return activePlanIds;
}

function findMatchingAllocation(
  plan: PricingModelPlan,
  entitlementIds: Set<string>,
): { amount: number | null } | null {
  let customPricingUnitId: string | undefined;
  const hasEntitlement = plan.entitlements?.some((entitlement: PricingModelPlanEntitlement) => {
    if (entitlementIds.has(entitlement.id)) {
      if (
        "customPricingUnitId" in entitlement &&
        typeof (entitlement as { customPricingUnitId?: unknown }).customPricingUnitId === "string"
      ) {
        customPricingUnitId = (entitlement as { customPricingUnitId: string }).customPricingUnitId;
      }
      return true;
    }
    return false;
  });

  if (!hasEntitlement) {
    return null;
  }

  const allocations = plan.allocations ?? [];
  if (!allocations.length) {
    return null;
  }

  if (customPricingUnitId) {
    const allocation = allocations.find(
      (entry) => entry.customPricingUnitId === customPricingUnitId,
    );
    if (allocation) {
      return { amount: allocation.amount ?? null };
    }
  }

  return { amount: allocations[0]?.amount ?? null };
}

export function findFeatureCreditAllocation({
  featureSlug,
  customerFeatures,
  pricingModel,
  customerInfo,
}: FindFeatureCreditAllocationArgs): number | null {
  if (!pricingModel) {
    return null;
  }

  const { entitlementCandidates } = resolveFeatureMetadata(
    featureSlug,
    customerFeatures,
    pricingModel,
  );

  if (!entitlementCandidates.size) {
    return null;
  }

  const activePlanIds = collectActivePlanIds(customerInfo);

  if (!activePlanIds.size) {
    return null;
  }

  for (const plan of pricingModel.plans ?? []) {
    const planIdentifier = plan.id || getCrossEnvironmentId(plan);
    if (!planIdentifier || !activePlanIds.has(planIdentifier)) {
      continue;
    }

    const allocation = findMatchingAllocation(plan, entitlementCandidates);
    if (allocation?.amount != null) {
      return allocation.amount;
    }
  }

  return null;
}
