import { FlashcardComment } from "@/app/types/flashcard";
import { Button, Group, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { Comment } from "./Comment";


type CommentSectionType = {
  comments: FlashcardComment[];
}



export const CommentSection = ({ comments }: CommentSectionType) => {
  const [showCreateNewComment, setShowCreateNewComment] = useState(false);

  return (
    <Stack w={"100%"} px="sm" mt="xl">
      <Group justify="space-between">
        <Text fw="bold" size="xl">Kommentarer</Text>
        <Button size="xs" onClick={() => setShowCreateNewComment((prev) => !prev)}>Ny kommentar</Button>
      </Group>
      <Stack gap="xl">
        {comments.map((comment) => {
          return (
            <Comment
              key={comment.id}
              id={comment.id}
              commentedBy={comment.commentedBy}
              content={comment.content}
              createdAt={comment.createdAt}
            />
          )
        })}
      </Stack>
    </Stack>
  )
}
