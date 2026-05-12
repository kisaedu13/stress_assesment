import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KOSS 기본형 직무스트레스 참고 평가",
  description:
    "KOSHA GUIDE E-G-2-2025 부록 1 KOSS 기본형 43문항 기준의 클라이언트 전용 참고 평가 웹앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
