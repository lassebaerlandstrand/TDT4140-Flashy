"use client";
import { NextAuthProvider } from "@/lib/auth/providers/SessionProvider";
import { Session } from "next-auth";
import {
  ActionIcon,
  AppShell,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMoon, IconSun } from "@tabler/icons-react";
import cx from "clsx";

import "@mantine/core/styles.css";
import { NavbarNested } from "../navigation/NavbarNested";
import classes from "@/components/root/ApplicationShell.module.css";

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
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
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
          <ActionIcon
            onClick={() =>
              setColorScheme(computedColorScheme === "light" ? "dark" : "light")
            }
            variant="default"
            size="md"
            aria-label="Toggle color scheme"
            style={{ position: "absolute", top: 15, right: 15 }}
          >
            {colorScheme === "dark" ? (
              <IconSun
                className={cx(classes.icon, classes.light)}
                stroke={1.5}
              />
            ) : (
              <IconMoon
                className={cx(classes.icon, classes.dark)}
                stroke={1.5}
              />
            )}
          </ActionIcon>
          {children}
        </AppShell.Main>
      </AppShell>
    </NextAuthProvider>
  );
}
