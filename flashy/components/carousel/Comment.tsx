import { FlashcardComment } from "@/app/types/flashcard";
import { Avatar, Divider, Group, Paper, Stack, Text } from "@mantine/core";
import { formatDistance } from "date-fns";
import { nb } from "date-fns/locale";



export const Comment = ({ commentedBy, content, createdAt }: FlashcardComment) => {
  return (
    <Paper shadow="sm" p="lg">
      <Stack gap={12}>
        <Group gap={8}>
          <Avatar src={commentedBy?.image} size={30} mr={8} />
          <Text size="sm" fw={500}>{commentedBy?.name ?? "Slettet Bruker"}</Text>
          <Text size="sm">•</Text>
          <Text size="sm">{formatDistance(createdAt, new Date(), { addSuffix: true, locale: nb })}</Text>
        </Group>
        <Divider />
        <Text size="sm">{content}</Text>
      </Stack>
    </Paper>
  );
}