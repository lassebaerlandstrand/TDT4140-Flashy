import { getServerSession } from "next-auth";
import ApplicationShell from "@/components/root/ApplicationShell";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/carousel/styles.css";

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
        <MantineProvider>
          <ApplicationShell session={session!}>{children}</ApplicationShell>;
        </MantineProvider>
      </body>
    </html>
  );
}
