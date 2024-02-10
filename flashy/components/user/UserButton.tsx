import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  rem,
  Button,
  Container,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import classes from "./UserButton.module.css";
import { signIn, useSession } from "next-auth/react";

export function UserButton() {
  const { data: session } = useSession();
  const UserAvatar = (name: string) => {
    const getInitials = (name) => {
      const nameParts = name.split(" ").filter(Boolean); // Filter out any empty strings
      if (nameParts.length > 1) {
        // If there are two or more parts in the name, use the first and last part
        return nameParts[0][0] + nameParts[nameParts.length - 1][0];
      } else if (nameParts.length === 1) {
        // If there's only one part, use the first character of this part
        return nameParts[0][0];
      }
      return ""; // Return an empty string if there's no valid name part
    };
    const initials = getInitials(name);
    return <Avatar radius="xl">{initials}</Avatar>;
  };
  return (
    <>
      {session ? (
        <>
          <UnstyledButton className={classes.user}>
            <Group>
              {UserAvatar(session.user?.name ?? "")}
              <Container style={{ flex: 1 }}>
                <Text size="sm" fw={500}>
                  {session.user?.name}
                </Text>
                <Text size="xs" fw={500}>
                  {session.user?.email}
                </Text>
              </Container>
              <IconChevronRight
                style={{ width: rem(14), height: rem(14) }}
                stroke={1.5}
              />
            </Group>
          </UnstyledButton>
        </>
      ) : (
        <>
          <UnstyledButton className={classes.user}>
            <Group>
              <Avatar
                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
                radius="xl"
              />

              <Container style={{ flex: 1 }}>
                <Text size="sm" fw={500}>
                  Sign in to continue
                </Text>
                <Button onClick={() => signIn()}>Login</Button>
              </Container>

              <IconChevronRight
                style={{ width: rem(14), height: rem(14) }}
                stroke={1.5}
              />
            </Group>
          </UnstyledButton>
        </>
      )}
    </>
  );
}
