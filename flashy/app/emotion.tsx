import { getServerSession } from "next-auth";
import ApplicationShell from "@/components/root/ApplicationShell";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";

export default async function RootStyleRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body>
        <ColorSchemeScript />
        <MantineProvider>
          <ApplicationShell session={session!}>{children}</ApplicationShell>;
        </MantineProvider>
      </body>
    </html>
  );
}
