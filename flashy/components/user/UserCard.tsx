import { Avatar, Badge, Button, Card, Group, Stack, Text, useMantineTheme } from "@mantine/core";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ConfirmDeleteUser } from "./ConfirmationModal";
import classes from "./UserCard.module.css";

export const DangerZone = ({ user }: Session) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const { colors, spacing } = theme;
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    ConfirmDeleteUser({ user, expires: null }, true, router);
  };
  return (
    <div className={classes.dangerZone}>
      <Text size="lg" style={{ color: colors.red[6] }}>
        Danger Zone
      </Text>
      <Group justify="space-between" style={{ marginTop: spacing.md, alignItems: "center" }}>
        <Text size="sm" style={{ color: colors.gray[6] }}>
          Når du sletter denne kontoen, er det ingen veg tilbake. Vær sikker før denne operasjonen.
        </Text>
        <Button onClick={handleClick} fullWidth color="red" variant="light" size="lg">
          Slett Konto
        </Button>
      </Group>
    </div>
  );
};

export function UserCard({ user }: Session) {
  const theme = useMantineTheme();

  return (
    <Card withBorder padding="xl" miw="300" radius="md" className={classes.card}>
      <Card.Section
        h={140}
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80)",
        }}
      />
      <Stack align="center">
        <Avatar src={user.image} size={80} radius={80} mx="auto" mt={-30} className={classes.avatar} />
        <Text ta="center" fz="lg" fw={500} mt="sm">
          {user.name}
        </Text>
        <Badge style={{ color: theme.colors.dark[5], background: theme.colors.orange[5] }}>Profesjonell</Badge>
        <Button onClick={() => signOut()} fullWidth color="orange" variant="light" size="lg">
          Logg ut
        </Button>
      </Stack>
    </Card>
  );
}
