import { describe, expect, it } from "vitest";
import {
  DOMAIN_DEFINITIONS,
  KOSS43_QUESTIONS,
} from "@/lib/koss43.questions";
import {
  DOMAIN_THRESHOLDS,
  TOTAL_THRESHOLDS,
} from "@/lib/koss43.thresholds";

describe("KOSS43 official KOSHA Guide data", () => {
  it("keeps the official 43-item structure and domain ranges", () => {
    expect(KOSS43_QUESTIONS).toHaveLength(43);
    expect(KOSS43_QUESTIONS.map((question) => question.id)).toEqual(
      Array.from({ length: 43 }, (_, index) => index + 1),
    );

    expect(DOMAIN_DEFINITIONS.map((domain) => domain.itemIds)).toEqual([
      [1, 2, 3],
      [4, 5, 6, 7, 8, 9, 10, 11],
      [12, 13, 14, 15, 16],
      [17, 18, 19, 20],
      [21, 22, 23, 24, 25, 26],
      [27, 28, 29, 30, 31, 32, 33],
      [34, 35, 36, 37, 38, 39],
      [40, 41, 42, 43],
    ]);
  });

  it("keeps the official reverse-scored item list from the 4-3-2-1 columns", () => {
    const reverseIds = KOSS43_QUESTIONS.filter((question) => question.reverse)
      .map((question) => question.id);

    expect(reverseIds).toEqual([
      1, 9, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 27, 28, 29, 30,
      31, 32, 33, 35, 36, 37, 38, 39,
    ]);
  });

  it("keeps the official basic-form question text", () => {
    expect(KOSS43_QUESTIONS.map((question) => question.text)).toEqual([
      "근무 장소가 깨끗하고 쾌적하다.",
      "내 일은 위험하여 사고를 당할 가능성이 있다.",
      "나는 불편한 자세로 오랫동안 일을 해야 한다.",
      "나는 일이 많아 항상 시간에 쫓기며 일한다.",
      "현재 하던 일을 끝내기 전에 다른 일을 하도록 지시받는다",
      "업무량이 현저하게 증가하였다.",
      "나는 동료나 부하직원을 돌보고 책임져야 할 부담을 안고 있다.",
      "내 업무는 장시간 동안 집중력이 요구된다.",
      "업무 수행 중에 충분한 휴식(짬)이 주어진다.",
      "일이 많아서 직장과 가정에 다 잘하기가 힘들다.",
      "여러 가지 일을 동시에 해야 한다.",
      "내 업무는 창의력을 필요로 한다.",
      "업무 관련 사항(업무의 일정, 업무량, 회의 시간 등)이 예고 없이 갑작스럽게 정해지거나 바뀐다.",
      "내 업무를 수행하기 위해서는 높은 수준의 기술이나 지식이 필요하다.",
      "작업시간, 업무 수행 과정에서 내가 스스로 결정할 권한이 주어진다.",
      "나의 업무량과 작업 스케줄을 스스로 조절할 수 있다.",
      "나의 상사는 업무를 수행하는 데 도움을 준다.",
      "나의 동료는 업무를 수행하는 데 도움을 준다.",
      "직장에서 내가 힘들 때 내가 힘들다는 것을 알아주고 이해해 주는 사람이 있다.",
      "직장생활의 고충을 함께 나눌 동료가 있다.",
      "지금의 직장을 옮겨도 나에게 적합한 새로운 일을 쉽게 찾을 수 있다.",
      "현재의 직장을 그만두어도 현재 수준만큼의 직업(직장)을 쉽게 구할 수 있다.",
      "직장 사정이 불안하여 미래가 불확실하다.",
      "나의 직업은 실직하거나 해고당할 염려가 없다.",
      "앞으로 2년 동안 현재의 내 직업을 잃을 가능성이 있다.",
      "나의 근무조건이나 상황에 바람직하지 못한 변화(예, 구조 조정)가 있었거나 있을 것으로 예상된다.",
      "우리 직장은 근무 평가, 인사제도(예, 승진, 부서 배치) 등의 정책 결정 과정이 공정하고 합리적이다.",
      "업무 수행에 필요한 인원, 공간, 시설, 장비, 훈련 등의 지원이 잘 이루어지고 있다.",
      "우리 부서와 타 부서 간에는 마찰이 없고 업무 협조가 잘 이루어진다.",
      "근로자, 간부, 경영주 모두가 직장을 위해 한마음으로 일을 한다.",
      "업무 수행 과정에 나의 생각을 반영할 수 있는 기회와 통로가 있다.",
      "나의 경력 개발과 승진은 무난히 잘 될 것으로 예상한다.",
      "나의 현재 직위는 나의 교육 및 경력에 비추어 볼 때 적절하다.",
      "나의 직업은 내가 평소 기대했던 것에 미치지 못한다.",
      "나의 모든 노력과 업적을 고려할 때 내 봉급/수입은 적절하다.",
      "내가 쏟는 노력과 업적을 고려할 때, 나는 직장에서 제대로 존중과 신임을 받고 있다.",
      "나는 지금 하는 일에 흥미를 느낀다.",
      "내 사정이 앞으로 더 좋아질 것을 생각하면 힘든 줄 모르고 일하게 된다.",
      "나의 능력을 개발하고 발휘할 수 있는 기회가 주어진다.",
      "회식 자리가 불편하다.",
      "나는 기준이나 일관성이 없는 상태로 업무지시를 받는다.",
      "직장의 분위기가 권위적이고 수직적이다.",
      "남성, 여성이라는 성적인 차이 때문에 불이익을 받는다.",
    ]);
  });

  it("keeps the official male and female basic-form reference thresholds", () => {
    expect(DOMAIN_THRESHOLDS).toEqual({
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
    });

    expect(TOTAL_THRESHOLDS).toEqual({
      male: { maxA: 50.7, maxB: 56.5 },
      female: { maxA: 51.1, maxB: 56.6 },
    });
  });
});
