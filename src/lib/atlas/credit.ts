import type {
  CustomerFeature,
  PricingModel,
  PricingModelEntitlement,
  PricingModelPlan,
  PricingModelPlanEntitlement,
  PricingModelPlanEntitlementPrice,
  User,
} from "@runonatlas/react";

export const AI_INSIGHTS_FEATURE_SLUG = "ai-insights";
export const AI_INSIGHTS_PRICING_UNIT_ID = "ai-credits";

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
  if (entitlementFromPricing?.crossEnvironmentId) {
    entitlementCandidates.add(entitlementFromPricing.crossEnvironmentId);
  }
  if (feature?.internalId) {
    entitlementCandidates.add(feature.internalId);
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
    if (plan.crossEnvironmentId) {
      activePlanIds.add(plan.crossEnvironmentId);
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
      if (entitlement.customPricingUnitId) {
        customPricingUnitId = entitlement.customPricingUnitId;
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
    const planIdentifier = plan.id || plan.crossEnvironmentId;
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
