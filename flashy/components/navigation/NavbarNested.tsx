import classes from "@/components/navigation/NavbarNested.module.css";
import { UserButton } from "@/components/user/UserButton";
import { Code, Container, Flex, Group, Space, Stack, Text, UnstyledButton } from "@mantine/core";
import { IconCards, IconUser } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const data = [
  { link: "/profile", label: "Profile", icon: IconUser, requiresAdmin: false },
  { link: "/flashies", label: "My flashies", icon: IconCards, requiresAdmin: false },
  { link: "/admin", label: "Administration", icon: IconUser, requiresAdmin: true },
];

export function NavbarNested() {
  const session = useSession();
  const links = data
    .filter((item) => session.data?.user?.role == "admin" || !item.requiresAdmin)
    .map((item) => (
      <UnstyledButton component={Link} className={classes.link} href={item.link} key={item.label}>
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <Text>{item.label}</Text>
      </UnstyledButton>
    ));

  return (
    <nav className={classes.navbar}>
      <Flex direction="column" justify="space-between" style={{ height: "100%", width: "100%" }}>
        <Container className={classes.header}>
          <Group justify="space-around">
            <UnstyledButton component={Link} href="/">
              <Image src="/logo/FlashyLogoHorizontal.png" alt="Flashy logo" width={127} height={40} />
            </UnstyledButton>
            <Code fw={700}>V 0.1.0</Code>
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
