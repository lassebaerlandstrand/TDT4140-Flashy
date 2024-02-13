import { getServerSession } from "next-auth";
import ApplicationShell from "@/components/root/ApplicationShell";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import "@mantine/carousel/styles.css";

const theme = createTheme({
  fontFamily: "Open Sans, sans-serif",
});

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
        <MantineProvider theme={theme}>
          <ApplicationShell session={session!}>{children}</ApplicationShell>;
        </MantineProvider>
      </body>
    </html>
  );
}
