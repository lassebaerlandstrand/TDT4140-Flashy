"use client";
import { NextAuthProvider } from "../../lib/auth/providers/SessionProvider";
import styles from "./ApplicationShell.module.css";
import { Session } from "next-auth";
import HeaderMenu from "../navigation/Header";
import { MantineProvider, Stack } from "@mantine/core";

export default function ApplicationShell({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  return (
    <NextAuthProvider session={session!}>
      <MantineProvider>
        <HeaderMenu />
        <main className={styles.main}>
          <>{children}</>
        </main>
      </MantineProvider>
    </NextAuthProvider>
  );
}
