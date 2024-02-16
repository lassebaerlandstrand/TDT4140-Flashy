"use client";
import { NextAuthProvider } from "@/lib/auth/providers/SessionProvider";
import {
  AppShell
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Session } from "next-auth";

import classes from "@/components/root/ApplicationShell.module.css";
import "@mantine/core/styles.css";
import { NavbarNested } from "../navigation/NavbarNested";

export const metadata = {
  title: "My Mantine app",
  description: "I have followed setup instructions carefully",
};

export default function ApplicationShell({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  const [opened, { toggle }] = useDisclosure();
  return (
    <NextAuthProvider session={session!}>
      <AppShell
        // header={{ height: 60 }}
        navbar={{
          width: 320,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        {/* <AppShell.Header>
            <Group h="100%" px="md">
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
            </Group>
          </AppShell.Header> */}
        <AppShell.Navbar>
          <NavbarNested />
        </AppShell.Navbar>
        <AppShell.Main className={classes.main}>
          {children}
        </AppShell.Main>
      </AppShell>
    </NextAuthProvider>
  );
}
