import { ActionIcon, Anchor, Avatar, Badge, ComboboxItem, Group, Select, Table, Text, rem } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";

import { User } from "@/app/types/user";
import { setUpdateUserRoles } from "@/app/utils/firebase";
import { useState } from "react";
import { confirmationModal } from "../user/ConfirmationModal";

const jobColors: Record<string, string> = {
  admin: "cyan",
  user: "green",
};

type UserTableProps = {
  actionUser: User | undefined;
  users: User[];
};

const deleteUserFromCollection = async (actionUser: User | undefined, deleteUser: User) => {
  confirmationModal({ user: deleteUser, expires: null }, actionUser == deleteUser);
};

export function UsersTable({ actionUser, users }: UserTableProps) {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<Record<string, ComboboxItem | null>>(() => {
    const roles: Record<string, ComboboxItem | null> = {};
    users.forEach((user) => {
      roles[user.email] = { value: user.role, label: user.role };
    });
    return roles;
  });

  const roleOptions = [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
  ];

  const handleRoleChange = (email: string, newRole: ComboboxItem | null) => {
    setUpdateUserRoles(actionUser, email, newRole);
    setUserRoles((prevRoles) => ({ ...prevRoles, [email]: newRole }));
    setEditingUserId(null);
  };
  const rows = users.map((user) => (
    <Table.Tr key={user.name}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={30} src={user.image} radius={30} />
          <Text fz="sm" fw={500}>
            {user.name}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        {editingUserId === user.email ? (
          <Select
            data={roleOptions}
            value={userRoles[user.email]?.value || null}
            onChange={(value) => handleRoleChange(user.email, value ? { value, label: value } : null)}
          />
        ) : (
          <Badge color={jobColors[userRoles[user.email]?.value || user.role]} variant="light">
            {userRoles[user.email]?.label || user.role}
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
            <IconPencil
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
              onClick={() => setEditingUserId(user.email)}
            />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red">
            <IconTrash
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
              onClick={() => deleteUserFromCollection(actionUser, user)}
            />
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
