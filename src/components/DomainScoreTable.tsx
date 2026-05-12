import { RISK_LABELS } from "@/lib/koss43.thresholds";
import type { KossResult, RiskLevel } from "@/lib/koss43.types";

interface DomainScoreTableProps {
  result: KossResult;
}

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

const shortRiskLabel = (riskLevel: RiskLevel) =>
  RISK_LABELS[riskLevel].replace(/^[A-C] \(|\)$/g, "");

export function DomainScoreTable({ result }: DomainScoreTableProps) {
  return (
    <section className="grid gap-3">
      <div className="flex items-end justify-between">
        <h2 className="text-lg font-bold text-ink">영역별 점수</h2>
        <p className="text-sm text-muted">100점 환산</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {result.domains.map((domain) => (
          <article
            className="min-w-0 rounded-[14px] border border-line bg-surface p-3 shadow-soft lg:p-4"
            key={domain.id}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="min-h-8 min-w-0 text-sm font-bold leading-5 text-ink lg:text-[15px] lg:leading-6">
                {domain.shortLabel}
              </p>
              <p className={`flex-none text-lg font-bold lg:text-xl ${riskColorClassName[domain.riskLevel]}`}>
                {domain.score.toFixed(1)}
              </p>
            </div>
            <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-accentSoft">
              <div
                className={`h-full rounded-full ${riskBgClassName[domain.riskLevel]}`}
                style={{ width: `${Math.min(100, Math.max(0, domain.score))}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${riskSoftClassName[domain.riskLevel]}`}
              >
                {shortRiskLabel(domain.riskLevel)}
              </span>
              <span className="text-xs text-muted">
                {domain.itemCount}문항
              </span>
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-[14px] border border-line bg-surface p-[14px]">
        <h2 className="text-base font-bold text-ink">영역별 해석</h2>
        <div className="mt-3 grid gap-2 lg:grid-cols-2">
          {result.domains.map((domain) => (
            <p className="min-w-0 text-sm leading-6 text-muted lg:text-[15px] lg:leading-7" key={domain.id}>
              <span className="font-bold text-ink">{domain.label}</span>
              <span className="mx-1">·</span>
              {domain.meaning}
            </p>
          ))}
        </div>
      </section>
    </section>
  );
}
