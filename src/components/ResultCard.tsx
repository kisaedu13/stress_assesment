"use client";

import { AlertCircle, Gauge, Info, TrendingUp } from "lucide-react";
import { KOSS_SOURCE } from "@/lib/koss43.questions";
import {
  GENDER_LABELS,
  RISK_DESCRIPTIONS,
  RISK_LABELS,
} from "@/lib/koss43.thresholds";
import type { KossResult, RiskLevel } from "@/lib/koss43.types";

interface ResultCardProps {
  result: KossResult;
}

const riskBadgeClassName: Record<RiskLevel, string> = {
  A: "bg-successSoft text-success",
  B: "bg-warningSoft text-warning",
  C: "bg-riskSoft text-risk",
};

const riskToneClassName: Record<RiskLevel, string> = {
  A: "text-success",
  B: "text-warning",
  C: "text-risk",
};

export function ResultCard({ result }: ResultCardProps) {
  const topDomains = result.priorityDomains.slice(0, 3);

  return (
    <section className="grid gap-5 lg:sticky lg:top-6 lg:self-start">
      <div className="grid gap-1.5">
        <p className="text-sm font-bold text-accent">KOSS 기준 요약</p>
        <h1 className="text-[30px] font-bold leading-9 text-ink sm:text-[34px] lg:text-[38px] lg:leading-[1.15]">
          직무스트레스 자가진단 결과
        </h1>
        <p className="text-base font-medium leading-7 text-muted lg:text-lg lg:leading-8">
          총점과 우선 개선 영역을 먼저 확인하세요.
        </p>
      </div>

      <section className="overflow-hidden rounded-[18px] border border-line bg-surface shadow-soft">
        <div className="grid gap-5 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <p className="text-base font-bold text-muted">
                {GENDER_LABELS[result.gender]} 기준 총점
              </p>
              <div className="mt-2 flex items-end gap-1.5 whitespace-nowrap sm:gap-2">
                <span className="text-[56px] font-bold leading-none text-accent sm:text-[76px] lg:text-[84px]">
                  {result.totalScore.toFixed(1)}
                </span>
                <span className="pb-1.5 text-base font-semibold text-muted sm:pb-2 sm:text-lg">
                  / 100
                </span>
              </div>
            </div>
            <div className="flex h-14 w-14 flex-none items-center justify-center rounded-[18px] bg-accentSoft text-accent sm:h-20 sm:w-20 sm:rounded-[22px]">
              <Gauge className="h-8 w-8 sm:h-10 sm:w-10" aria-hidden="true" />
            </div>
          </div>

          <div className="grid gap-3 rounded-[14px] bg-surfaceSoft p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1.5 text-base font-bold ${riskBadgeClassName[result.totalRiskLevel]}`}
              >
                {RISK_LABELS[result.totalRiskLevel]}
              </span>
              <span className="text-sm font-semibold text-muted">
                공식 참고치 기준
              </span>
            </div>
            <p className="text-base font-medium leading-7 text-ink">
              {RISK_DESCRIPTIONS[result.totalRiskLevel]}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 border-t border-line">
          <span className="bg-successSoft px-3 py-3 text-center text-sm font-bold text-success">
            정상
          </span>
          <span className="bg-warningSoft px-3 py-3 text-center text-sm font-bold text-warning">
            경계
          </span>
          <span className="bg-riskSoft px-3 py-3 text-center text-sm font-bold text-risk">
            고위험
          </span>
        </div>
      </section>

      <section className="rounded-[18px] border border-line bg-surface p-5 shadow-soft sm:p-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-accent" aria-hidden="true" />
          <h2 className="text-xl font-bold text-ink">우선 개선 영역 TOP 3</h2>
        </div>
        <div className="mt-4 grid gap-3">
          {topDomains.map((domain, index) => (
            <article
              className="grid gap-2 rounded-[14px] border border-line bg-surfaceSoft p-4"
              key={domain.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`flex h-9 w-9 flex-none items-center justify-center rounded-xl text-base font-bold ${riskBadgeClassName[domain.riskLevel]}`}
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-lg font-bold leading-6 text-ink">
                      {domain.label}
                    </p>
                    <p className="text-sm font-medium text-muted">
                      {domain.itemCount}문항
                    </p>
                  </div>
                </div>
                <p className={`flex-none text-2xl font-bold ${riskToneClassName[domain.riskLevel]}`}>
                  {domain.score.toFixed(1)}
                </p>
              </div>
              <p className="text-base font-medium leading-7 text-muted">
                {domain.meaning}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="flex gap-3 rounded-[16px] border border-[#E8CF9A] bg-warningSoft p-4">
        <AlertCircle className="mt-0.5 h-6 w-6 flex-none text-warning" />
        <p className="text-base font-medium leading-7 text-ink">
          본 결과는 KOSHA GUIDE 기준의 참고 평가이며, 의학적 진단이
          아닙니다.
        </p>
      </section>

      <section className="flex gap-3 rounded-[16px] border border-line bg-surfaceSoft p-4">
        <Info className="mt-0.5 h-5 w-5 flex-none text-accent" />
        <p className="text-xs leading-5 text-muted sm:text-sm sm:leading-6">
          출처: {KOSS_SOURCE}
        </p>
      </section>
    </section>
  );
}
