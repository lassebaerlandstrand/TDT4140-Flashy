import { deleteUser } from "@/app/utils/firebase";
import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { Session } from "next-auth";

export function confirmationModal({ user }: Session, ownUser: boolean) {
  let text = "";
  ownUser
    ? (text = "Dette vil permanent slette brukeren din. Er du sikker på at du vil fortsette?")
    : (text = "Dette vil permanent slette brukeren. Er du sikker på at du vil fortsette?");
  modals.openConfirmModal({
    title: "Slett konto?",
    children: <Text size="sm">{text}</Text>,
    labels: { confirm: "Bekreft", cancel: "Avbryt" },
    onConfirm: () => deleteUser(user, user.email),
  });
}
