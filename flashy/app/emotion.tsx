import ApplicationShell from "@/components/root/ApplicationShell";
import { authOptions } from "@/lib/auth/auth";
import "@mantine/carousel/styles.css";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import '@mantine/notifications/styles.css';
import { getServerSession } from "next-auth";

const theme = createTheme({
  fontFamily: "Open Sans, sans-serif",
});

export default async function RootStyleRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Notifications />
          <ApplicationShell session={session!}>{children}</ApplicationShell>;
        </MantineProvider>
      </body>
    </html>
  );
}
