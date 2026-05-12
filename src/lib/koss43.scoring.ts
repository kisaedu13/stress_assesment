import {
  DOMAIN_DEFINITIONS,
  KOSS43_QUESTIONS,
} from "./koss43.questions";
import {
  DOMAIN_THRESHOLDS,
  TOTAL_THRESHOLDS,
} from "./koss43.thresholds";
import type {
  AnswerMap,
  AnswerValue,
  DomainResult,
  Gender,
  KossResult,
  Question,
  RiskLevel,
  RiskThreshold,
} from "./koss43.types";

const VALID_ANSWERS = new Set<AnswerValue>([1, 2, 3, 4]);

export function round1(value: number): number {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}

export function isAnswerValue(value: unknown): value is AnswerValue {
  return VALID_ANSWERS.has(value as AnswerValue);
}

export function getItemScore(question: Question, raw: AnswerValue): number {
  return question.reverse ? 5 - raw : raw;
}

export function validateAnswers(answers: AnswerMap): number[] {
  return KOSS43_QUESTIONS.filter((question) => !isAnswerValue(answers[question.id]))
    .map((question) => question.id);
}

export function validateSurveyInput(
  answers: AnswerMap,
  gender: Gender | null,
): { canCalculate: boolean; genderMissing: boolean; missingIds: number[] } {
  const missingIds = validateAnswers(answers);
  const genderMissing = gender === null;

  return {
    canCalculate: missingIds.length === 0 && !genderMissing,
    genderMissing,
    missingIds,
  };
}

export function classifyScore(score: number, threshold: RiskThreshold): RiskLevel {
  const roundedScore = round1(score);

  if (roundedScore <= threshold.maxA) {
    return "A";
  }

  if (roundedScore <= threshold.maxB) {
    return "B";
  }

  return "C";
}

export function calculateDomainScore(
  questions: Question[],
  answers: AnswerMap,
): Pick<DomainResult, "itemCount" | "rawSum" | "score"> {
  const itemCount = questions.length;
  const rawSum = questions.reduce((sum, question) => {
    const answer = answers[question.id];

    if (!isAnswerValue(answer)) {
      throw new Error(`Missing answer for question ${question.id}`);
    }

    return sum + getItemScore(question, answer);
  }, 0);

  return {
    itemCount,
    rawSum,
    score: round1(((rawSum - itemCount) * 100) / (itemCount * 3)),
  };
}

export function calculateKossResult(
  answers: AnswerMap,
  gender: Gender,
): KossResult {
  const missing = validateAnswers(answers);

  if (missing.length > 0) {
    throw new Error(`Missing answers: ${missing.join(", ")}`);
  }

  const domains = DOMAIN_DEFINITIONS.map<DomainResult>((domain) => {
    const questions = KOSS43_QUESTIONS.filter(
      (question) => question.domainId === domain.id,
    );
    const score = calculateDomainScore(questions, answers);

    return {
      ...score,
      id: domain.id,
      label: domain.label,
      shortLabel: domain.shortLabel,
      meaning: domain.meaning,
      riskLevel: classifyScore(score.score, DOMAIN_THRESHOLDS[gender][domain.id]),
    };
  });

  const totalScore = round1(
    domains.reduce((sum, domain) => sum + domain.score, 0) / domains.length,
  );

  return {
    gender,
    totalScore,
    totalRiskLevel: classifyScore(totalScore, TOTAL_THRESHOLDS[gender]),
    domains,
    priorityDomains: selectPriorityDomains(domains),
  };
}

export function selectPriorityDomains(domains: DomainResult[]): DomainResult[] {
  const byScoreDesc = [...domains].sort((a, b) => b.score - a.score);
  const highRisk = byScoreDesc.filter((domain) => domain.riskLevel === "C");

  if (highRisk.length > 0) {
    return highRisk;
  }

  const borderline = byScoreDesc.filter((domain) => domain.riskLevel === "B");

  if (borderline.length > 0) {
    return borderline;
  }

  return byScoreDesc.slice(0, 2);
}
