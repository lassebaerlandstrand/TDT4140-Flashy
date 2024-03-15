import classes from "@/components/navigation/NavbarNested.module.css";
import { UserButton } from "@/components/user/UserButton";
import { Code, Container, Flex, Group, Space, Stack, Text, UnstyledButton } from "@mantine/core";
import { IconCards, IconCardsFilled, IconCircleKey, IconCircleKeyFilled, IconRectangleVertical, IconRectangleVerticalFilled, IconUser, IconUserFilled } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const data = [
  { link: "/profile", label: "Profil", icon: IconUser, filledIcon: IconUserFilled, requiresAdmin: false },
  { link: "/my-flashies", label: "Mine Flashies", icon: IconRectangleVertical, filledIcon: IconRectangleVerticalFilled, requiresAdmin: false },
  { link: "/", label: "Alle flashies", icon: IconCards, filledIcon: IconCardsFilled, requiresAdmin: false },
  { link: "/admin", label: "Administrasjon", icon: IconCircleKey, filledIcon: IconCircleKeyFilled, requiresAdmin: true },
];

export function NavbarNested() {
  const session = useSession();
  const pathname = usePathname();
  console.log(pathname);
  const links = data
    .filter((item) => session.data?.user?.role == "admin" || !item.requiresAdmin)
    .map((item) => (
      <UnstyledButton component={Link} className={classes.link} href={item.link} key={item.label}>
        {pathname == item.link ? <item.filledIcon className={classes.linkIcon} stroke={1.5} /> : <item.icon className={classes.linkIcon} stroke={1.5} />}
        <Text px="10">{item.label}</Text>
      </UnstyledButton>
    ));

  return (
    <nav className={classes.navbar}>
      <Flex direction="column" justify="space-between" style={{ height: "100%", width: "100%" }}>
        <Container className={classes.header}>
          <Group justify="space-around">
            <UnstyledButton component={Link} href="/" style={{ display: "flex", alignItems: "center" }}>
              <Image src="/logo/FlashyLogoHorizontal.png" alt="Flashy logo" width={128} height={30} priority={true} />
            </UnstyledButton>
            <Code fw={700}>v0.1.0</Code>
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
