import {
  BadgeDollarSign,
  Briefcase,
  Building2,
  Coffee,
  Network,
  ShieldAlert,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { RISK_LABELS } from "@/lib/koss43.thresholds";
import type { DomainId, KossResult, RiskLevel } from "@/lib/koss43.types";

interface DomainScoreTableProps {
  result: KossResult;
}

const domainIcons: Record<DomainId, typeof Building2> = {
  physicalEnvironment: Building2,
  jobDemand: Briefcase,
  jobControlDeficit: SlidersHorizontal,
  interpersonalConflict: Users,
  jobInsecurity: ShieldAlert,
  organizationalSystem: Network,
  lackOfReward: BadgeDollarSign,
  occupationalClimate: Coffee,
};

const riskColorClassName: Record<RiskLevel, string> = {
  A: "text-success",
  B: "text-warning",
  C: "text-risk",
};

const riskBgClassName: Record<RiskLevel, string> = {
  A: "bg-success",
  B: "bg-warning",
  C: "bg-risk",
};

const riskSoftClassName: Record<RiskLevel, string> = {
  A: "bg-successSoft text-success",
  B: "bg-warningSoft text-warning",
  C: "bg-riskSoft text-risk",
};

const riskBorderClassName: Record<RiskLevel, string> = {
  A: "border-success/20",
  B: "border-warning/25",
  C: "border-risk/25",
};

const shortRiskLabel = (riskLevel: RiskLevel) =>
  RISK_LABELS[riskLevel].replace(/^[A-C] \(|\)$/g, "");

export function DomainScoreTable({ result }: DomainScoreTableProps) {
  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-accent">세부 결과</p>
          <h2 className="text-2xl font-bold leading-8 text-ink">
            8개 영역별 점수
          </h2>
        </div>
        <p className="rounded-full bg-surface px-3 py-1.5 text-sm font-semibold text-muted">
          100점 환산
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {result.domains.map((domain) => {
          const Icon = domainIcons[domain.id];

          return (
            <article
              className={`min-w-0 rounded-[18px] border bg-surface p-4 shadow-soft ${riskBorderClassName[domain.riskLevel]}`}
              key={domain.id}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[14px] bg-accentSoft text-accent">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold leading-6 text-ink">
                        {domain.label}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-muted">
                        {domain.itemCount}문항
                      </p>
                    </div>
                    <p
                      className={`flex-none text-[28px] font-bold leading-none ${riskColorClassName[domain.riskLevel]}`}
                    >
                      {domain.score.toFixed(1)}
                    </p>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-accentSoft">
                    <div
                      className={`h-full rounded-full ${riskBgClassName[domain.riskLevel]}`}
                      style={{ width: `${Math.min(100, Math.max(0, domain.score))}%` }}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1.5 text-sm font-bold ${riskSoftClassName[domain.riskLevel]}`}
                    >
                      {shortRiskLabel(domain.riskLevel)}
                    </span>
                    <span className="text-sm font-medium text-muted">
                      점수가 높을수록 주의가 필요합니다
                    </span>
                  </div>

                  <p className="mt-3 text-base font-medium leading-7 text-muted">
                    {domain.meaning}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
