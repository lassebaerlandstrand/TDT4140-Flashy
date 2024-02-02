import { getServerSession } from "next-auth";
import ApplicationShell from "@/components/root/ApplicationShell";

export default async function RootStyleRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="nb">
      <head></head>
      <body>
        <ApplicationShell session={session!}>{children}</ApplicationShell>
      </body>
    </html>
  );
}