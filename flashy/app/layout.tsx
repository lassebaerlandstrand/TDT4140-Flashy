import RootStyleRegistry from "./emotion";
import "./globals.css";
import "@mantine/carousel/styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootStyleRegistry>{children}</RootStyleRegistry>;
}
