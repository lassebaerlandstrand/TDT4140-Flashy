import { CreateNewCommentType, FlashcardSet } from "@/app/types/flashcard";
import { User } from "@/app/types/user";
import { commentOnSet } from "@/app/utils/firebase";
import { Avatar, Button, Divider, Group, Paper, Stack, Text, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";


type NewCommentType = {
  flashcard: FlashcardSet;
  actionUser: User;
};


export const NewComment = ({ flashcard, actionUser }: NewCommentType) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<CreateNewCommentType>({
    initialValues: {
      content: "",
      commentedBy: actionUser,
    },

    validate: {
      content: (value) => {
        if (value.length < 1) return "Kommentaren kan ikke være tom";
      },
    }
  });

  const onSubmit = (values: typeof form.values) => {
    setLoading(true);
    commentOnSet(flashcard, values).then(() => {
      notifications.show({
        title: "Kommentar publisert",
        message: "Det kan ta opptil 30 sekunder før kommentaren vises for alle",
        color: "green",
      });
      form.reset();
    }).catch(() => {
      notifications.show({
        title: "Noe gikk galt",
        message: "Kommentaren kunne ikke bli publisert",
        color: "red",
      })
    }).finally(() => { setLoading(false) });
  }

  return (
    <Paper shadow="sm" p="lg">
      <Stack gap={12}>
        <Group gap={8}>
          <Avatar src={actionUser?.image} size={30} mr={8} />
          <Text size="sm" fw={500}>{actionUser?.name ?? "Slettet Bruker"}</Text>
        </Group>
        <Divider />
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
          <Textarea
            variant="unstyled"
            placeholder="Skriv kommentaren din her..."
            autosize
            {...form.getInputProps("content")}
          />
          <Group justify="flex-end" mt="xs">
            <Button type="submit" size="xs" loading={loading}>Publiser kommentar</Button>
          </Group>
        </form>
      </Stack>
    </Paper>
  );
}