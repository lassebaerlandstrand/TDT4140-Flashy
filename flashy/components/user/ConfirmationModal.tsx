import { FlashcardSet } from "@/app/types/flashcard";
import { User } from "@/app/types/user";
import { deleteFlashcardSet, deleteUser } from "@/app/utils/firebase";
import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Session } from "next-auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function ConfirmDeleteUser({ user }: Session, ownUser: boolean, router: AppRouterInstance) {
  let text = "";
  ownUser
    ? (text = "Dette vil permanent slette brukeren din. Er du sikker på at du vil fortsette?")
    : (text = "Dette vil permanent slette brukeren. Er du sikker på at du vil fortsette?");

  modals.openConfirmModal({
    title: "Slett konto?",
    children: <Text size="sm">{text}</Text>,
    labels: { confirm: "Bekreft", cancel: "Avbryt" },
    onConfirm: () =>
      deleteUser(user, user.email)
        .then(() => {
          router.back();
          notifications.show({
            title: "Brukeren er slettet",
            message: "",
            color: "green",
          });
        })
        .catch((error) => {
          notifications.show({
            title: "Noe gikk galt",
            message: error.message,
            color: "red",
          });
        }),
  });
}

export function ConfirmDeleteFlashy(user: User, flashcardSet: FlashcardSet, router: AppRouterInstance) {
  modals.openConfirmModal({
    title: "Slett flashcard sett?",
    children: <Text size="sm">Dette vil permanent slette flashcard settet. Er du sikker på at du vil fortsette?</Text>,
    labels: { confirm: "Bekreft", cancel: "Avbryt" },
    onConfirm: () =>
      deleteFlashcardSet(user, flashcardSet)
        .then(() => {
          router.back();
          notifications.show({
            title: "Settet er slettet",
            message: "",
            color: "green",
          });
        })
        .catch((error) => {
          notifications.show({
            title: "Noe gikk galt",
            message: error.message,
            color: "red",
          });
        }),
  });
}
