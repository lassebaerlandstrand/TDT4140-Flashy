"use client";
import { NextAuthProvider } from "../../lib/auth/providers/SessionProvider";
import { Session } from "next-auth";
import {
  AppShell,
  Burger,
  Group,
  MantineProvider,
  Skeleton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

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
      <MantineProvider>
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
          <AppShell.Navbar p="md">
            <NavbarNested />
          </AppShell.Navbar>
          <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
      </MantineProvider>
    </NextAuthProvider>
  );
}
