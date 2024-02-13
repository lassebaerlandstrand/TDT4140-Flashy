import {
  Group,
  Code,
  Container,
  Flex,
  Stack,
  UnstyledButton,
  Text,
  Space,
} from "@mantine/core";
import classes from "@/components/navigation/NavbarNested.module.css";
import { UserButton } from "@/components/user/UserButton";
import Image from "next/image";
import { IconFingerprint, IconUser, IconCards } from "@tabler/icons-react";
import Link from "next/link";

const data = [
  { link: "/profile", label: "Profile", icon: IconUser },
  { link: "/flashies", label: "My flashies", icon: IconCards },
  { link: "/admin", label: "Administration", icon: IconFingerprint },
];

export function NavbarNested() {
  const links = data.map((item) => (
    <UnstyledButton
      component={Link}
      className={classes.link}
      href={item.link}
      key={item.label}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <Text>{item.label}</Text>
    </UnstyledButton>
  ));

  return (
    <nav className={classes.navbar}>
      <Flex
        direction="column"
        justify="space-between"
        style={{ height: "100%", width: "100%" }}
      >
        <Container className={classes.header}>
          <Group justify="space-between">
            <Group justify="flex-start">
              <Image
                src="/logo/FlashyLogoSymbol.png"
                alt="Flashy logo"
                width={40}
                height={40}
              />
              <Image
                src="/logo/FlashyLogoText.png"
                alt="Flashy logo"
                width={80}
                height={40}
              />
            </Group>
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
