"use client";

import { AlertCircle, ArrowUpRight, Gauge } from "lucide-react";
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
  return (
    <section className="grid gap-4">
      <div className="grid gap-1">
        <p className="text-sm font-bold text-accent">KOSS 기준 요약</p>
        <h1 className="text-[26px] font-bold leading-8 text-ink lg:text-[30px] lg:leading-9">
          직무스트레스 자가진단 결과
        </h1>
        <p className="text-sm leading-6 text-muted lg:text-base">
          우선 관리가 필요한 영역부터 확인하세요.
        </p>
      </div>

      <section className="rounded-[14px] border border-line bg-surface p-4 shadow-soft lg:p-6">
        <div className="flex items-start gap-4">
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="text-base font-bold text-muted">
              {GENDER_LABELS[result.gender]} 기준 총점
            </p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-[52px] font-bold leading-none text-accent lg:text-[64px]">
                {result.totalScore.toFixed(1)}
              </span>
              <span className="pb-1 text-base font-semibold text-muted">
                / 100
              </span>
            </div>
            <span
              className={`mt-3 w-fit rounded-full px-3 py-1.5 text-sm font-bold ${riskBadgeClassName[result.totalRiskLevel]}`}
            >
              {RISK_LABELS[result.totalRiskLevel]}
            </span>
            <p className="mt-3 text-sm font-medium leading-6 text-muted lg:text-base lg:leading-7">
              {RISK_DESCRIPTIONS[result.totalRiskLevel]}
            </p>
          </div>
          <div className="flex h-16 w-16 flex-none items-center justify-center rounded-[18px] bg-accentSoft text-accent lg:h-20 lg:w-20">
            <Gauge className="h-8 w-8 lg:h-10 lg:w-10" aria-hidden="true" />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-2">
        <span className="rounded-xl bg-successSoft px-3 py-2.5 text-center text-sm font-bold text-success">
          정상
        </span>
        <span className="rounded-xl bg-warningSoft px-3 py-2.5 text-center text-sm font-bold text-warning">
          경계
        </span>
        <span className="rounded-xl bg-riskSoft px-3 py-2.5 text-center text-sm font-bold text-risk">
          고위험
        </span>
      </div>

      <section className="rounded-[14px] border border-line bg-surface p-[14px] shadow-soft lg:p-5">
        <div className="flex items-center gap-2">
          <ArrowUpRight className="h-5 w-5 text-accent" aria-hidden="true" />
          <h2 className="text-base font-bold text-ink">우선 개선 영역 TOP 3</h2>
        </div>
        <div className="mt-3 grid gap-3">
          {result.priorityDomains.slice(0, 3).map((domain, index) => (
            <div className="flex items-center gap-3" key={domain.id}>
              <span
                className={`flex h-8 w-8 flex-none items-center justify-center rounded-lg text-sm font-bold ${riskBadgeClassName[domain.riskLevel]}`}
              >
                {index + 1}
              </span>
              <p className="min-w-0 flex-1 text-sm leading-6 text-ink lg:text-base lg:leading-7">
                <span className="font-bold">{domain.label}</span>
                <span className={`ml-1 font-bold ${riskToneClassName[domain.riskLevel]}`}>
                  {domain.score.toFixed(1)}
                </span>
                <span className="ml-1 text-muted">{domain.meaning}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex gap-3 rounded-[14px] border border-[#E8CF9A] bg-warningSoft p-3">
        <AlertCircle className="mt-0.5 h-6 w-6 flex-none text-warning" />
        <p className="text-sm font-medium leading-6 text-ink lg:text-base">
          본 결과는 KOSHA GUIDE 기준의 참고 평가이며, 의학적 진단이
          아닙니다.
        </p>
      </section>

      <p className="text-[10px] leading-5 text-muted lg:text-xs lg:leading-6">
        출처: {KOSS_SOURCE}
      </p>
    </section>
  );
}
