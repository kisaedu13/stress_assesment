"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  CircleCheckBig,
  ClipboardList,
  LockKeyhole,
  Mars,
  RotateCcw,
  ShieldCheck,
  UserRound,
  Venus,
} from "lucide-react";
import { DomainScoreTable } from "@/components/DomainScoreTable";
import { ResultCard } from "@/components/ResultCard";
import { SurveyForm } from "@/components/SurveyForm";
import { KOSS43_QUESTIONS } from "@/lib/koss43.questions";
import {
  calculateKossResult,
  validateSurveyInput,
} from "@/lib/koss43.scoring";
import { GENDER_LABELS } from "@/lib/koss43.thresholds";
import type { AnswerMap, AnswerValue, Gender, KossResult } from "@/lib/koss43.types";

type AppStep = "intro" | "privacy" | "gender" | "survey" | "result";

export default function Home() {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [gender, setGender] = useState<Gender | null>(null);
  const [missingIds, setMissingIds] = useState<number[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<KossResult | null>(null);
  const [step, setStep] = useState<AppStep>("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completedQuestionCount, setCompletedQuestionCount] = useState(0);

  const answeredCount = useMemo(
    () =>
      KOSS43_QUESTIONS.filter((question) => answers[question.id] !== undefined)
        .length,
    [answers],
  );

  function handleAnswerChange(questionId: number, value: AnswerValue) {
    setAnswers((current) => ({
      ...current,
      [questionId]: value,
    }));
    setMissingIds((current) => current.filter((id) => id !== questionId));
  }

  function handleSurveyNext() {
    const question = KOSS43_QUESTIONS[currentQuestionIndex];

    if (answers[question.id] === undefined) {
      setMissingIds([question.id]);
      return;
    }

    if (currentQuestionIndex < KOSS43_QUESTIONS.length - 1) {
      setCompletedQuestionCount((current) =>
        Math.max(current, currentQuestionIndex + 1),
      );
      setCurrentQuestionIndex((current) => current + 1);
      setMissingIds([]);
      return;
    }

    setCompletedQuestionCount(KOSS43_QUESTIONS.length);
    handleSubmit();
  }

  function handleSubmit() {
    const validation = validateSurveyInput(answers, gender);
    setMissingIds(validation.missingIds);

    if (validation.genderMissing || !gender) {
      setFormError("공식 참고치 적용을 위해 성별 기준을 선택해 주세요.");
      setStep("gender");
      setResult(null);
      return;
    }

    if (validation.missingIds.length > 0) {
      const firstMissingIndex = KOSS43_QUESTIONS.findIndex(
        (question) => question.id === validation.missingIds[0],
      );
      setFormError(
        `아직 응답하지 않은 문항이 ${validation.missingIds.length}개 있습니다.`,
      );
      setCurrentQuestionIndex(Math.max(0, firstMissingIndex));
      setStep("survey");
      setResult(null);
      return;
    }

    setFormError(null);
    setResult(calculateKossResult(answers, gender));
    setStep("result");
  }

  function handleReset() {
    setAnswers({});
    setGender(null);
    setMissingIds([]);
    setFormError(null);
    setResult(null);
    setCurrentQuestionIndex(0);
    setCompletedQuestionCount(0);
    setStep("intro");
  }

  return (
    <main className="min-h-dvh bg-screen px-4 py-4 text-ink sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-[1120px] rounded-[26px] border border-line bg-screen shadow-soft">
        {step === "intro" ? (
          <IntroScreen onStart={() => setStep("privacy")} />
        ) : null}

        {step === "privacy" ? (
          <PrivacyScreen
            onBack={() => setStep("intro")}
            onNext={() => setStep("gender")}
          />
        ) : null}

        {step === "gender" ? (
          <GenderScreen
            gender={gender}
            onBack={() => setStep("privacy")}
            onGenderChange={(nextGender) => {
              setGender(nextGender);
              setFormError(null);
            }}
            onNext={() => {
              if (!gender) {
                setFormError("성별 기준을 선택해 주세요.");
                return;
              }
              setFormError(null);
              setStep("survey");
            }}
            error={formError}
          />
        ) : null}

        {step === "survey" ? (
          <SurveyForm
            answers={answers}
            completedQuestionCount={completedQuestionCount}
            currentIndex={currentQuestionIndex}
            missingIds={missingIds}
            onAnswerChange={handleAnswerChange}
            onBack={() => {
              if (currentQuestionIndex === 0) {
                setStep("gender");
                return;
              }
              setCurrentQuestionIndex((current) => current - 1);
              setMissingIds([]);
            }}
            onNext={handleSurveyNext}
            onReset={handleReset}
          />
        ) : null}

        {step === "result" && result ? (
          <ResultScreen
            answeredCount={answeredCount}
            onReset={handleReset}
            result={result}
          />
        ) : null}
      </div>
    </main>
  );
}

interface IntroScreenProps {
  onStart: () => void;
}

function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <section className="flex flex-col gap-5 bg-screen p-5 sm:gap-6 sm:p-8 lg:p-10">
      <div className="grid gap-4">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accentSoft px-4 py-2 text-sm font-semibold text-accentStrong">
          <span className="h-2 w-2 rounded-full bg-accent" />
          KOSHA GUIDE
        </span>
        <div>
          <h1 className="text-3xl font-bold leading-10 text-ink sm:text-4xl sm:leading-[1.2] lg:text-5xl lg:leading-[1.18]">
            직무스트레스
            <br />
            자가진단
          </h1>
          <p className="mt-3 max-w-xl text-base font-medium leading-7 text-muted lg:text-lg lg:leading-8">
            KOSHA GUIDE 기준의 43문항 직무스트레스 요인 평가
          </p>
        </div>
      </div>

      <section className="rounded-[14px] border border-line bg-surface p-5 shadow-soft sm:p-6 lg:p-7">
        <h2 className="text-lg font-bold text-ink">시작 전 확인</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            "약 5~7분 소요",
            "로그인 없이 이용 가능",
            "응답 결과는 저장되지 않음",
            "브라우저에서만 계산됨",
          ].map((item) => (
            <div className="flex items-center gap-3" key={item}>
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-accentSoft text-accent">
                <Check className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 text-base font-medium leading-7 text-ink">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex gap-3 rounded-[14px] border border-line bg-surfaceSoft p-4">
        <ClipboardList className="mt-0.5 h-6 w-6 flex-none text-accent" />
        <p className="text-base font-medium leading-7 text-muted">
          본 도구는 스스로 현재 직무스트레스 수준을 확인하기 위한 참고용
          자가진단입니다.
        </p>
      </section>

      <div className="grid gap-3">
        <button
          className="inline-flex min-h-[60px] items-center justify-center gap-2 rounded-xl bg-accent px-6 text-xl font-bold text-white transition hover:bg-accentStrong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          onClick={onStart}
          type="button"
        >
          진단 시작하기
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

interface PrivacyScreenProps {
  onBack: () => void;
  onNext: () => void;
}

function PrivacyScreen({ onBack, onNext }: PrivacyScreenProps) {
  return (
    <section className="flex flex-col gap-5 bg-screen p-5 sm:gap-6 sm:p-8 lg:p-10">
      <button
        className="h-11 w-fit rounded-xl border border-line bg-surface px-5 text-base font-bold text-ink"
        onClick={onBack}
        type="button"
      >
        이전
      </button>
      <div className="grid gap-4">
        <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-accentSoft text-accent">
          <LockKeyhole className="h-7 w-7" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-[34px] font-bold leading-[1.18] text-ink sm:text-[38px] lg:text-[44px]">
            개인정보 저장 없이 진행됩니다
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-muted lg:text-xl lg:leading-9">
            응답 내용은 서버로 전송되지 않고 현재 브라우저 화면에서만 계산됩니다.
          </p>
        </div>
      </div>

      <section className="rounded-[14px] border border-line bg-surface p-5 shadow-soft sm:p-6 lg:p-7">
        <h2 className="text-lg font-bold text-ink">필수 확인 사항</h2>
        <div className="mt-4 grid gap-3">
          {[
            "이름, 연락처, 주민등록번호 등 개인식별정보를 입력하지 않습니다.",
            "문항 응답과 결과는 기기에 저장되지 않으며 새로고침 시 사라집니다.",
            "공유 기기에서는 결과 화면을 닫은 뒤 브라우저 기록을 확인해 주세요.",
          ].map((item, index) => (
            <div className="flex gap-3" key={item}>
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-lg bg-accentSoft text-xs font-bold text-accent">
                {index + 1}
              </span>
              <p className="min-w-0 text-base font-medium leading-7 text-ink">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[14px] border border-[#E8CF9A] bg-warningSoft p-[18px]">
        <h2 className="text-lg font-bold text-warning">안내</h2>
        <p className="mt-2 text-base font-medium leading-7 text-ink">
          본 자가진단은 의학적 진단이나 상담을 대체하지 않습니다. 높은
          스트레스가 의심되면 보건관리자, 전문의 또는 상담기관과 상의해 주세요.
        </p>
      </section>

      <button
        className="inline-flex min-h-[60px] items-center justify-center gap-2 rounded-xl bg-accent px-6 text-xl font-bold text-white transition hover:bg-accentStrong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        onClick={onNext}
        type="button"
      >
        동의하고 시작하기
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </button>
    </section>
  );
}

interface GenderScreenProps {
  error: string | null;
  gender: Gender | null;
  onBack: () => void;
  onGenderChange: (gender: Gender) => void;
  onNext: () => void;
}

function GenderScreen({
  error,
  gender,
  onBack,
  onGenderChange,
  onNext,
}: GenderScreenProps) {
  return (
    <section className="flex flex-col gap-6 bg-screen p-5 sm:gap-7 sm:p-8 lg:p-10">
      <button
        className="h-11 w-fit rounded-xl border border-line bg-surface px-5 text-base font-bold text-ink transition hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        onClick={onBack}
        type="button"
      >
        이전
      </button>
      <div className="grid gap-4">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accentSoft px-4 py-2 text-sm font-bold text-accentStrong">
          <UserRound className="h-[18px] w-[18px]" aria-hidden="true" />
          평가 기준
        </span>
        <div>
          <h1 className="text-[34px] font-bold leading-[1.18] text-ink sm:text-[38px] lg:text-[44px]">
            평가 기준 선택
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-muted lg:text-xl lg:leading-9">
            KOSHA 참고치는 남성/여성 기준으로 제공됩니다.
          </p>
        </div>
      </div>

      <section
        aria-labelledby="gender-criteria-title"
        className="rounded-[16px] border border-line bg-surface p-5 shadow-soft sm:p-6 lg:p-8"
      >
        <h2 className="text-xl font-bold text-ink lg:text-2xl" id="gender-criteria-title">
          성별 기준을 선택해 주세요
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {(["male", "female"] as const).map((value) => {
            const selected = gender === value;
            const GenderIcon = value === "male" ? Mars : Venus;
            const iconClassName =
              value === "male"
                ? "bg-accentSoft text-accent"
                : "bg-riskSoft text-risk";

            return (
              <label
                className={`flex min-h-[88px] cursor-pointer items-center gap-4 rounded-[14px] border px-4 py-4 transition sm:px-5 ${
                  selected
                    ? "border-2 border-accent bg-accentSoft shadow-[0_12px_28px_rgba(61,126,138,0.16)]"
                    : "border-line bg-surface hover:border-accent hover:bg-surfaceSoft"
                }`}
                key={value}
              >
                <span
                  className={`flex h-14 w-14 flex-none items-center justify-center rounded-2xl ${iconClassName}`}
                >
                  <GenderIcon className="h-7 w-7" strokeWidth={2.4} aria-hidden="true" />
                </span>
                <span className="grid min-w-0 flex-1 gap-0.5">
                  <span className="text-xl font-bold leading-7 text-ink">
                    {GENDER_LABELS[value]}
                  </span>
                  <span className="text-[15px] font-medium leading-6 text-muted">
                    {GENDER_LABELS[value]} 근로자 참고치 적용
                  </span>
                </span>
                <input
                  checked={selected}
                  className="sr-only"
                  name="gender"
                  onChange={() => onGenderChange(value)}
                  type="radio"
                />
                {selected ? (
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-accent text-white shadow-[0_8px_18px_rgba(61,126,138,0.28)]">
                    <CircleCheckBig className="h-5 w-5" strokeWidth={2.8} aria-hidden="true" />
                  </span>
                ) : (
                  <span className="h-8 w-8 flex-none rounded-full border-2 border-disabled bg-surface" />
                )}
              </label>
            );
          })}
        </div>
      </section>

      {error ? (
        <p className="rounded-xl border border-risk/30 bg-riskSoft px-4 py-3 text-base font-bold text-risk">
          {error}
        </p>
      ) : null}

      <section className="flex gap-3 rounded-[14px] border border-line bg-surfaceSoft p-5">
        <ShieldCheck className="mt-0.5 h-7 w-7 flex-none text-accent" />
        <p className="text-base font-medium leading-7 text-muted">
          선택한 기준은 결과 해석에만 사용되며 별도로 저장되지 않습니다.
        </p>
      </section>

      <button
        className="inline-flex min-h-[60px] items-center justify-center gap-2 rounded-xl bg-accent px-6 text-xl font-bold text-white transition hover:bg-accentStrong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        onClick={onNext}
        type="button"
      >
        다음
        <ArrowRight className="h-6 w-6" aria-hidden="true" />
      </button>
    </section>
  );
}

interface ResultScreenProps {
  answeredCount: number;
  onReset: () => void;
  result: KossResult;
}

function ResultScreen({
  answeredCount,
  onReset,
  result,
}: ResultScreenProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <section className="bg-screen">
      <header className="flex min-h-[76px] items-center justify-between gap-4 border-b border-line bg-surface px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="text-sm font-bold text-accent">
            {answeredCount}개 문항 완료
          </p>
          <p className="text-xl font-bold leading-7 text-ink sm:text-2xl">
            결과 대시보드
          </p>
        </div>
        <button
          className="inline-flex min-h-[50px] flex-none items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2 text-base font-bold text-white shadow-[0_12px_26px_rgba(61,126,138,0.22)] transition hover:bg-accentStrong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 sm:px-5 sm:text-lg"
          onClick={onReset}
          type="button"
        >
          <RotateCcw className="h-5 w-5" aria-hidden="true" />
          다시하기
        </button>
      </header>

      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-6 lg:p-8">
        <ResultCard result={result} />
        <DomainScoreTable result={result} />
      </div>
    </section>
  );
}
