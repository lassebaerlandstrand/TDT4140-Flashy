import { FlashcardSet } from "@/app/types/flashcard";
import { Button, Menu } from "@mantine/core";
import { IconEdit, IconSettings } from "@tabler/icons-react";
import Link from "next/link";

type SettingsButtonType = {
  flashcard: FlashcardSet;
}

export function SettingsButton({ flashcard }: SettingsButtonType) {

  return (
    <Menu shadow="md">
      <Menu.Target>
        <Button color="gray" leftSection={<IconSettings width={18} />}>Innstillinger</Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<IconEdit width={18} />} component={Link} href={`/editFlashcard/${flashcard.title}`}>
          Rediger flashy
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}