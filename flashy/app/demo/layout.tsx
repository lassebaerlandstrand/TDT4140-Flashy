import { Title } from "@mantine/core";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Title>My Mantine app</Title>
      {children}
    </>
  );
}
