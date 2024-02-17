import { deleteUser } from "@/app/utils/firebase";
import { Button, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { Session } from "next-auth";

export function ConfirmationModal({ user }: Session) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    openModal({ user, expires: null }, true);
  };

  return (
    <Button onClick={handleClick} fullWidth color="red" radius="md" mt="xl" size="md" variant="default">
      Slett Konto
    </Button>
  );
}

export function openModal({ user }: Session, ownUser: boolean) {
  let text = "";
  ownUser
    ? (text = "Dette vil permanent slette brukeren din. Er du sikker på at du vil fortsette?")
    : (text = "Dette vil permanent slette brukeren. Er du sikker på at du vil fortsette?");
  modals.openConfirmModal({
    title: "Slett konto?",
    children: <Text size="sm">{text}</Text>,
    labels: { confirm: "Confirm", cancel: "Cancel" },
    onConfirm: () => deleteUser(user, user.email),
  });
}
