import { FlashcardSet } from "@/app/types/flashcard";
import { User } from "@/app/types/user";
import { Button, Menu } from "@mantine/core";
import { IconPencil, IconSettings, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ConfirmDeleteFlashy } from "../user/ConfirmationModal";

type SettingsButtonType = {
  user: User;
  flashcard: FlashcardSet;
};

export function SettingsButton({ user, flashcard }: SettingsButtonType) {
  const router = useRouter();

  const deleteFlashcardFunction = (user: User, flashcard: FlashcardSet) => {
    ConfirmDeleteFlashy(user, flashcard, router);
  };

  return (
    <Menu shadow="md">
      <Menu.Target>
        <Button color="gray" leftSection={<IconSettings width={18} />}>
          Innstillinger
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<IconPencil width={18} />} component={Link} href={`/editFlashcard/${flashcard.title}`}>
          Rediger flashy
        </Menu.Item>
        <Menu.Item leftSection={<IconTrash width={18} />} color="red" onClick={() => deleteFlashcardFunction(user, flashcard)}>
          Slett flashy
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
