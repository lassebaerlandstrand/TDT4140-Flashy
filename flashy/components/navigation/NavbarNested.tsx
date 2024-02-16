import classes from "@/components/navigation/NavbarNested.module.css";
import { UserButton } from "@/components/user/UserButton";
import { Code, Container, Flex, Group, Space, Stack, Text, UnstyledButton } from "@mantine/core";
import { IconCards, IconFingerprint, IconUser } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

const data = [
  { link: "/profile", label: "Profile", icon: IconUser },
  { link: "/flashies", label: "My flashies", icon: IconCards },
  { link: "/admin", label: "Administration", icon: IconFingerprint },
];

export function NavbarNested() {
  const links = data.map((item) => (
    <UnstyledButton component={Link} className={classes.link} href={item.link} key={item.label}>
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <Text>{item.label}</Text>
    </UnstyledButton>
  ));

  return (
    <nav className={classes.navbar}>
      <Flex direction="column" justify="space-between" style={{ height: "100%", width: "100%" }}>
        <Container className={classes.header}>
          <Group justify="space-between">
            <UnstyledButton component={Link} href="/">
              <Group justify="flex-start">
                <Image src="/logo/FlashyLogoSymbol.png" alt="Flashy logo" width={40} height={40} />
                <Image src="/logo/FlashyLogoText.png" alt="Flashy logo" width={80} height={40} />
              </Group>
            </UnstyledButton>
            <Code fw={700}>V.0.1.0</Code>
          </Group>
          <Space h="md" />
          <Stack>{links}</Stack>
        </Container>

        <Container className={classes.footer}>
          <UserButton />
        </Container>
      </Flex>
    </nav>
  );
}
