import RootStyleRegistry from "./emotion";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootStyleRegistry>{children}</RootStyleRegistry>;
}