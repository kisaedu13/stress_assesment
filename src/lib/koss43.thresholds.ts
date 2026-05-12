import type { DomainId, Gender, RiskLevel, RiskThreshold } from "./koss43.types";

export const GENDER_LABELS: Record<Gender, string> = {
  male: "남성",
  female: "여성",
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  A: "A (정상)",
  B: "B (경계)",
  C: "C (고위험)",
};

export const RISK_DESCRIPTIONS: Record<RiskLevel, string> = {
  A: "공식 참고치에서 상대적으로 낮거나 보통인 구간입니다.",
  B: "공식 참고치에서 상대적으로 높은 구간입니다.",
  C: "공식 참고치에서 상대적으로 매우 높은 구간입니다.",
};

export const DOMAIN_THRESHOLDS: Record<
  Gender,
  Record<DomainId, RiskThreshold>
> = {
  male: {
    physicalEnvironment: { maxA: 44.4, maxB: 66.6 },
    jobDemand: { maxA: 50.0, maxB: 58.3 },
    jobControlDeficit: { maxA: 53.3, maxB: 60.0 },
    interpersonalConflict: { maxA: 33.3, maxB: 50.0 },
    jobInsecurity: { maxA: 50.0, maxB: 61.1 },
    organizationalSystem: { maxA: 52.3, maxB: 61.9 },
    lackOfReward: { maxA: 66.6, maxB: 77.7 },
    occupationalClimate: { maxA: 41.6, maxB: 50.0 },
  },
  female: {
    physicalEnvironment: { maxA: 44.4, maxB: 55.5 },
    jobDemand: { maxA: 54.1, maxB: 62.5 },
    jobControlDeficit: { maxA: 60.0, maxB: 66.6 },
    interpersonalConflict: { maxA: 33.3, maxB: 41.6 },
    jobInsecurity: { maxA: 50.0, maxB: 55.5 },
    organizationalSystem: { maxA: 52.3, maxB: 61.9 },
    lackOfReward: { maxA: 66.6, maxB: 77.7 },
    occupationalClimate: { maxA: 41.6, maxB: 50.0 },
  },
};

export const TOTAL_THRESHOLDS: Record<Gender, RiskThreshold> = {
  male: { maxA: 50.7, maxB: 56.5 },
  female: { maxA: 51.1, maxB: 56.6 },
};
