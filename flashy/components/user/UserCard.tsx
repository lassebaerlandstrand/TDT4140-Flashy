import { Avatar, Badge, Button, Card, Group, Stack, Text, useMantineTheme } from "@mantine/core";
import { Session } from "next-auth";
import { confirmationModal } from "./ConfirmationModal";
import classes from "./UserCard.module.css";

const stats = [
  { value: "64", label: "Likerklikk" },
  { value: "287", label: "Kommentarer" },
  { value: "20", label: "Flashies" },
];

export function UserCard({ user }: Session) {
  const theme = useMantineTheme();
  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text ta="center" fz="lg" fw={500}>
        {stat.value}
      </Text>
      <Text ta="center" fz="sm" c="dimmed" lh={1}>
        {stat.label}
      </Text>
    </div>
  ));

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    confirmationModal({ user, expires: null }, true);
  };

  return (
    <Card withBorder padding="xl" radius="md" className={classes.card}>
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
        <Group mt="md" justify="center" gap={30}>
          {items}
        </Group>
        <Button onClick={handleClick} fullWidth color="red" radius="md" mt="xl" size="md" variant="default">
          Slett Konto
        </Button>
      </Stack>
    </Card>
  );
}
