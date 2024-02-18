import ApplicationShell from "@/components/root/ApplicationShell";
import "@mantine/carousel/styles.css";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { getServerSession } from "next-auth";

const theme = createTheme({
  fontFamily: "Open Sans, sans-serif",
});

export default async function RootStyleRegistry({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <ModalsProvider>
            <ApplicationShell session={session!}>{children}</ApplicationShell>;
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
