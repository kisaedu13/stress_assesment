export type Gender = "male" | "female";

export type DomainId =
  | "physicalEnvironment"
  | "jobDemand"
  | "jobControlDeficit"
  | "interpersonalConflict"
  | "jobInsecurity"
  | "organizationalSystem"
  | "lackOfReward"
  | "occupationalClimate";

export type RiskLevel = "A" | "B" | "C";

export type AnswerValue = 1 | 2 | 3 | 4;

export type AnswerMap = Partial<Record<number, AnswerValue>>;

export interface DomainDefinition {
  id: DomainId;
  label: string;
  shortLabel: string;
  itemIds: number[];
  meaning: string;
}

export interface Question {
  id: number;
  domainId: DomainId;
  text: string;
  reverse: boolean;
}

export interface RiskThreshold {
  maxA: number;
  maxB: number;
}

export interface DomainResult {
  id: DomainId;
  label: string;
  shortLabel: string;
  itemCount: number;
  rawSum: number;
  score: number;
  riskLevel: RiskLevel;
  meaning: string;
}

export interface KossResult {
  gender: Gender;
  totalScore: number;
  totalRiskLevel: RiskLevel;
  domains: DomainResult[];
  priorityDomains: DomainResult[];
}
