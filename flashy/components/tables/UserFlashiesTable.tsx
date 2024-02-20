import { FlashcardSet, Visibility } from "@/app/types/flashcard";
import { User } from "@/app/types/user";
import { setUpdateFlashySetVisibility } from "@/app/utils/firebase";
import classes from "@/components/tables/FlashiesTable.module.css";
import { Badge, Input, ScrollArea, Table, UnstyledButton, useMantineTheme } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import cx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type UserFlashiesTableProps = {
  user: User;
  flashies: FlashcardSet[];
};

export function UserFlashiesTable({ user, flashies }: UserFlashiesTableProps) {
  const [scrolled, setScrolled] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editableTitle, setEditableTitle] = useState("");
  const theme = useMantineTheme();
  const router = useRouter();

  const handleEditFlashyTitle = (title: string) => {
    setEditableTitle(title);
  };

  const saveTitle = (flashy: FlashcardSet, newTitle: string) => {
    console.log(`New title for ${newTitle}: ${editableTitle}`);
    setEditingTitleId(null);
  };

  const handleToggleVisibility = async (flashy: FlashcardSet) => {
    const newVisibility = flashy.visibility === Visibility.Public ? Visibility.Private : Visibility.Public;
    console.log(`New visibility for ${flashy.title}: ${newVisibility}`);
    try {
      // Update the visibility in Firestore
      await setUpdateFlashySetVisibility(user, flashy, newVisibility);
      flashies.find((flashy) => {
        if (flashy.id === flashy.id) {
          flashy.visibility = newVisibility;
        }
      });
      notifications.show({
        title: "Synlighet oppdatert",
        message: `Oppdatert synlighet til ${newVisibility}`,
        color: newVisibility === Visibility.Public ? theme.colors.orange[4] : theme.colors.grape[4],
      });
      router.refresh();
    } catch (error) {
      notifications.show({
        title: "Kunne ikke oppdatere synlighet",
        message: "Prøv igjen senere",
        color: "red",
      });
    }
  };

  const rows = flashies.map((flashy) => (
    <Table.Tr key={flashy.id}>
      <Table.Td>
        {editingTitleId === flashy.id ? (
          <Input
            autoFocus
            value={editableTitle}
            onChange={(e) => setEditableTitle(e.target.value)}
            onBlur={() => saveTitle(flashy, editableTitle)}
            onKeyDown={(e) => e.key === "Enter" && saveTitle(flashy, editableTitle)}
          />
        ) : (
          <UnstyledButton onClick={() => handleEditFlashyTitle(flashy.title)}>{flashy.title}</UnstyledButton>
        )}
      </Table.Td>
      <Table.Td>
        <UnstyledButton onClick={() => handleToggleVisibility(flashy)}>
          <Badge color={flashy.visibility === Visibility.Public ? theme.colors.orange[4] : theme.colors.grape[4]}>
            {flashy.visibility}
          </Badge>
        </UnstyledButton>
      </Table.Td>
      <Table.Td>{flashy.numOfLikes}</Table.Td>
      <Table.Td>{flashy.numViews}</Table.Td>
      <Table.Td>
        <UnstyledButton component={Link} href={`carousel/${flashy.title}`}>
          Gå til ↗️
        </UnstyledButton>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table miw={700}>
        <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <Table.Tr>
            <Table.Th>Tittel</Table.Th>
            <Table.Th>Synlighet</Table.Th>
            <Table.Th>Likerklikk ❤️</Table.Th>
            <Table.Th>Visning 👀</Table.Th>
            <Table.Th>Forhåndsvisning 🔗</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
