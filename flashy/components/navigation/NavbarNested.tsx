import {
  Group,
  Code,
  ScrollArea,
  rem,
  Skeleton,
  Container,
  Flex,
  Stack,
  UnstyledButton,
  Divider,
  Text,
  Space,
} from "@mantine/core";
import { Logo } from "./Logo";
import classes from "./NavbarNested.module.css";
import { UserButton } from "../user/UserButton";
import Image from "next/image";
import {
  Icon2fa,
  IconBellRinging,
  IconBulb,
  IconCheckbox,
  IconDatabaseImport,
  IconFingerprint,
  IconKey,
  IconReceipt2,
  IconSettings,
  IconUser,
  IconCards,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const links = [
  { icon: IconBulb, label: "Activity", notifications: 3 },
  { icon: IconCheckbox, label: "Tasks", notifications: 4 },
  { icon: IconUser, label: "Contacts" },
];

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
