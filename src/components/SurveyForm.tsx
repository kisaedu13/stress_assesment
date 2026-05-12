"use client";

import { useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import {
  ANSWER_LABELS,
  DOMAIN_DEFINITIONS,
  KOSS43_QUESTIONS,
} from "@/lib/koss43.questions";
import type { AnswerMap, AnswerValue } from "@/lib/koss43.types";

interface SurveyFormProps {
  answers: AnswerMap;
  completedQuestionCount: number;
  currentIndex: number;
  missingIds: number[];
  onAnswerChange: (questionId: number, value: AnswerValue) => void;
  onBack: () => void;
  onNext: () => void;
  onReset: () => void;
}

export function SurveyForm({
  answers,
  completedQuestionCount,
  currentIndex,
  missingIds,
  onAnswerChange,
  onBack,
  onNext,
  onReset,
}: SurveyFormProps) {
  const safeIndex = Math.min(
    Math.max(currentIndex, 0),
    KOSS43_QUESTIONS.length - 1,
  );
  const question = KOSS43_QUESTIONS[safeIndex];
  const domain = DOMAIN_DEFINITIONS.find((item) => item.id === question.domainId);
  const completedCount = Math.min(
    Math.max(completedQuestionCount, 0),
    KOSS43_QUESTIONS.length,
  );
  const progress = Math.round((completedCount / KOSS43_QUESTIONS.length) * 100);
  const isMissing = missingIds.includes(question.id);
  const isLast = safeIndex === KOSS43_QUESTIONS.length - 1;
  const adjacentDomains = DOMAIN_DEFINITIONS.slice(
    Math.max(0, DOMAIN_DEFINITIONS.findIndex((item) => item.id === question.domainId) - 1),
    Math.min(
      DOMAIN_DEFINITIONS.length,
      DOMAIN_DEFINITIONS.findIndex((item) => item.id === question.domainId) + 2,
    ),
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [safeIndex]);

  return (
    <form
      className="flex flex-col bg-screen"
      onSubmit={(event) => {
        event.preventDefault();
        onNext();
      }}
    >
      <header className="flex min-h-16 items-center justify-between border-b border-line bg-surface px-4 sm:px-5">
        <button
          aria-label="처음으로 돌아가기"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface text-ink transition hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          onClick={onReset}
          type="button"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="text-center">
          <p className="text-xs font-bold text-accent">KOSS 기본형</p>
          <p className="text-base font-bold text-ink">직무스트레스 자가진단</p>
        </div>
        <span className="rounded-full bg-accentSoft px-3 py-1.5 text-xs font-bold text-accent">
          저장 없음
        </span>
      </header>

      <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-7 lg:p-8">
        <aside className="grid min-w-0 gap-4 lg:sticky lg:top-6">
          <section className="rounded-[14px] border border-line bg-surface p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-base font-bold text-ink">
                  {domain?.label ?? "설문"}
                </p>
                <p className="mt-1 text-sm font-medium text-muted">
                  완료 {completedCount} / {KOSS43_QUESTIONS.length} 문항
                </p>
              </div>
              <span className="text-base font-bold text-accent">{progress}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-accentSoft">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </section>

          <nav aria-label="현재 영역" className="flex gap-2 overflow-x-auto pb-1">
            {adjacentDomains.map((item) => (
              <span
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                  item.id === question.domainId
                    ? "bg-accentSoft font-bold text-accent"
                    : "border border-line bg-surface text-muted"
                }`}
                key={item.id}
              >
                {item.shortLabel}
              </span>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 rounded-[14px] border border-line bg-surface p-5 shadow-soft sm:p-6 lg:p-8">
          <p className="text-base font-bold text-accent">{domain?.label}</p>
          <h1 className="mt-3 text-2xl font-bold leading-9 text-ink lg:text-[34px] lg:leading-[1.34]">
            <span className="mr-1 text-accent">{question.id}.</span>
            {question.text}
          </h1>
          <p className="mt-4 text-base font-medium leading-7 text-muted lg:text-lg lg:leading-8">
            최근 한 달 동안의 느낌과 경험을 기준으로 선택하세요.
          </p>

        <section className="mt-7 grid gap-3 sm:grid-cols-2" aria-label="응답 선택">
          {ANSWER_LABELS.map((option) => {
            const inputId = `q-${question.id}-${option.value}`;
            const checked = answers[question.id] === option.value;

            return (
              <label
                className={`flex min-h-[66px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-base transition sm:text-lg ${
                  checked
                    ? "border-2 border-accent bg-accentSoft font-bold text-ink"
                    : "border-line bg-surface font-semibold text-ink hover:border-accent"
                }`}
                htmlFor={inputId}
                key={option.value}
              >
                <span
                  className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border-2 ${
                    checked ? "border-accent bg-accent text-white" : "border-disabled"
                  }`}
                >
                  {checked ? (
                    <CheckCircle2 className="h-[18px] w-[18px]" aria-hidden="true" />
                  ) : null}
                </span>
                <input
                  checked={checked}
                  className="sr-only"
                  id={inputId}
                  name={`question-${question.id}`}
                  onChange={() => onAnswerChange(question.id, option.value)}
                  type="radio"
                  value={option.value}
                />
                <span>{option.label}</span>
              </label>
            );
          })}
        </section>

        {isMissing ? (
          <p className="mt-4 rounded-xl border border-risk/30 bg-riskSoft px-4 py-3 text-base font-bold text-risk">
            이 문항에 응답해 주세요.
          </p>
        ) : null}

        <div className="mt-8 grid grid-cols-2 gap-3 pt-2">
          <button
            className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 text-lg font-bold text-ink transition hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
            disabled={safeIndex === 0}
            onClick={onBack}
            type="button"
          >
            이전
          </button>
          <button
            className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-xl bg-accent px-4 text-lg font-bold text-white transition hover:bg-accentStrong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            type="submit"
          >
            {isLast ? "결과 보기" : "다음"}
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <section className="mt-6 rounded-[14px] border border-line bg-surfaceSoft p-4">
          <p className="text-base font-bold text-ink">안내</p>
          <p className="mt-1 text-sm font-medium leading-6 text-muted">
            응답은 현재 브라우저 메모리에서만 계산되며 저장되지 않습니다.
          </p>
        </section>
        </section>
      </div>
    </form>
  );
}
