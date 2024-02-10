import { getServerSession } from "next-auth";
import ApplicationShell from "@/components/root/ApplicationShell";
import { ColorSchemeScript } from "@mantine/core";

export default async function RootStyleRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <ApplicationShell session={session!}>{children}</ApplicationShell>;
      </body>
    </html>
  );
}
