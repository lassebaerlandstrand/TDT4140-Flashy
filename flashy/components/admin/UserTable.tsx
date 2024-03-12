import { ActionIcon, Anchor, Avatar, Badge, ComboboxItem, Group, Loader, Select, Table, Text, rem } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";

import { User } from "@/app/types/user";
import { setUpdateUserRoles } from "@/app/utils/firebase";
import { notifications } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDeleteUser } from "../user/ConfirmationModal";

const jobColors: Record<string, string> = {
  admin: "cyan",
  user: "green",
};

type UserTableProps = {
  users: User[];
};

const norwegianRoleNames: Record<string, string> = {
  admin: "Admin",
  user: "Bruker",
};

const deleteUserFromCollection = async (actionUser: User | undefined, deleteUser: User, router: AppRouterInstance) => {
  ConfirmDeleteUser({ user: deleteUser, expires: null }, actionUser == deleteUser, router);
};

export function UsersTable({ users }: UserTableProps) {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<Record<string, ComboboxItem>>(() => {
    const roles: Record<string, ComboboxItem> = {};
    users.forEach((user) => {
      roles[user.id] = { value: user.role, label: norwegianRoleNames[user.role] };
    });
    return roles;
  });

  const roleOptions = [
    { value: "user", label: "Bruker" },
    { value: "admin", label: "Admin" },
  ];

  if (!session) {
    return <Loader color="blue" size={48} />;
  }

  const actionUser = session.user;

  const handleRoleChange = (user: User, newRole: ComboboxItem | null) => {
    if (!newRole) return;

    setUpdateUserRoles(actionUser, user.id, newRole)
      .then(() => {
        setUserRoles((prevRoles) => ({ ...prevRoles, [user.id]: newRole }));
        setEditingUserId(null);

        notifications.show({
          title: "Rolle endret",
          message: `Rollen til ${user.name} er nå ${norwegianRoleNames[newRole.label]}`,
          color: "green",
        });

        if (session.user.id === user.id && newRole.value !== "admin") {
          update({
            ...session,
            user: { ...session.user, role: newRole.value },
          });
          router.push("/");
        }
      })
      .catch((error) => {
        notifications.show({
          title: "Noe gikk galt",
          message: error.message,
          color: "red",
        });
      });
  };

  const rows = users.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={30} src={user.image} radius={30} />
          <Text fz="sm" fw={500}>
            {user.name}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td w={200}>
        {editingUserId === user.email ? (
          <Select data={roleOptions} value={userRoles[user.id].value} onChange={(value) => handleRoleChange(user, value ? { value, label: value } : null)} />
        ) : (
          <Badge color={jobColors[userRoles[user.id]?.value || user.role]} variant="light">
            {userRoles[user.id]?.label || user.role}
          </Badge>
        )}
      </Table.Td>
      <Table.Td>
        <Anchor component="button" size="sm">
          {user.email}
        </Anchor>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon variant="subtle" color="gray">
            <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} onClick={() => setEditingUserId(user.email)} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red">
            <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} onClick={() => deleteUserFromCollection(actionUser, user, router)} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth="100%">
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Navn</Table.Th>
            <Table.Th>Rolle</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
