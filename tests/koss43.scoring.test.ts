import { describe, expect, it } from "vitest";
import {
  DOMAIN_DEFINITIONS,
  KOSS43_QUESTIONS,
} from "@/lib/koss43.questions";
import {
  DOMAIN_THRESHOLDS,
  TOTAL_THRESHOLDS,
} from "@/lib/koss43.thresholds";
import {
  calculateKossResult,
  classifyScore,
  getItemScore,
  validateAnswers,
  validateSurveyInput,
} from "@/lib/koss43.scoring";
import type { AnswerMap } from "@/lib/koss43.types";

function question(id: number) {
  const item = KOSS43_QUESTIONS.find((candidate) => candidate.id === id);
  if (!item) {
    throw new Error(`Question ${id} not found`);
  }
  return item;
}

function makeAnswers(mode: "min" | "max"): AnswerMap {
  return Object.fromEntries(
    KOSS43_QUESTIONS.map((item) => {
      if (mode === "min") {
        return [item.id, item.reverse ? 4 : 1];
      }
      return [item.id, item.reverse ? 1 : 4];
    }),
  );
}

describe("KOSS43 scoring", () => {
  it("scores reverse-coded items as 5 - raw", () => {
    for (const id of [1, 9, 12]) {
      expect(getItemScore(question(id), 1)).toBe(4);
      expect(getItemScore(question(id), 4)).toBe(1);
    }
  });

  it("scores regular items as raw", () => {
    for (const id of [2, 4, 40]) {
      expect(getItemScore(question(id), 1)).toBe(1);
      expect(getItemScore(question(id), 4)).toBe(4);
    }
  });

  it("keeps the official domain item counts", () => {
    expect(DOMAIN_DEFINITIONS.map((domain) => domain.itemIds.length)).toEqual([
      3, 8, 5, 4, 6, 7, 6, 4,
    ]);
  });

  it("returns 0.0 for every domain when all official scores are minimum", () => {
    const result = calculateKossResult(makeAnswers("min"), "male");
    expect(result.domains.map((domain) => domain.score)).toEqual([
      0, 0, 0, 0, 0, 0, 0, 0,
    ]);
    expect(result.totalScore).toBe(0);
  });

  it("returns 100.0 for every domain when all official scores are maximum", () => {
    const result = calculateKossResult(makeAnswers("max"), "female");
    expect(result.domains.map((domain) => domain.score)).toEqual([
      100, 100, 100, 100, 100, 100, 100, 100,
    ]);
    expect(result.totalScore).toBe(100);
  });

  it("classifies male and female total score thresholds", () => {
    expect(classifyScore(50.7, TOTAL_THRESHOLDS.male)).toBe("A");
    expect(classifyScore(50.8, TOTAL_THRESHOLDS.male)).toBe("B");
    expect(classifyScore(56.5, TOTAL_THRESHOLDS.male)).toBe("B");
    expect(classifyScore(56.6, TOTAL_THRESHOLDS.male)).toBe("C");

    expect(classifyScore(51.1, TOTAL_THRESHOLDS.female)).toBe("A");
    expect(classifyScore(51.2, TOTAL_THRESHOLDS.female)).toBe("B");
    expect(classifyScore(56.6, TOTAL_THRESHOLDS.female)).toBe("B");
    expect(classifyScore(56.7, TOTAL_THRESHOLDS.female)).toBe("C");
  });

  it("handles the interpersonal conflict dash range as A up to 33.3", () => {
    const male = DOMAIN_THRESHOLDS.male.interpersonalConflict;
    const female = DOMAIN_THRESHOLDS.female.interpersonalConflict;

    expect(classifyScore(33.3, male)).toBe("A");
    expect(classifyScore(33.4, male)).toBe("B");
    expect(classifyScore(50.0, male)).toBe("B");
    expect(classifyScore(50.1, male)).toBe("C");

    expect(classifyScore(33.3, female)).toBe("A");
    expect(classifyScore(33.4, female)).toBe("B");
    expect(classifyScore(41.6, female)).toBe("B");
    expect(classifyScore(41.7, female)).toBe("C");
  });

  it("blocks calculation when answers or gender basis are missing", () => {
    expect(validateAnswers({})).toHaveLength(43);
    expect(validateSurveyInput(makeAnswers("min"), null)).toEqual({
      canCalculate: false,
      genderMissing: true,
      missingIds: [],
    });
    expect(validateSurveyInput({}, "male")).toMatchObject({
      canCalculate: false,
      genderMissing: false,
    });
    expect(() => calculateKossResult({}, "male")).toThrow(/Missing answers/);
  });
});
