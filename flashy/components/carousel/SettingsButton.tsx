import { FlashcardSet } from "@/app/types/flashcard";
import { User } from "@/app/types/user";
import { deleteFlashcard } from "@/app/utils/firebase";
import { Button, Menu } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPencil, IconSettings, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SettingsButtonType = {
  user: User;
  flashcard: FlashcardSet;
}

export function SettingsButton({ user, flashcard }: SettingsButtonType) {
  const router = useRouter();

  const deleteFlashcardFunction = (user: User, flashcard: FlashcardSet) => {
    deleteFlashcard(user, flashcard).then(() => {
      router.push("/");
      notifications.show({
        title: "Settet er slettet",
        message: "",
        color: "green",
      });
    }).catch((error) => {
      notifications.show({
        title: 'Noe gikk galt',
        message: error.message,
        color: 'red',
      });
    });
  }

  return (
    <Menu shadow="md">
      <Menu.Target>
        <Button color="gray" leftSection={<IconSettings width={18} />}>Innstillinger</Button>
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