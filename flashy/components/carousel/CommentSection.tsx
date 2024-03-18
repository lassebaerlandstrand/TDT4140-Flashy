import { FlashcardComment, FlashcardSet } from "@/app/types/flashcard";
import { User } from "@/app/types/user";
import { Divider, Group, Stack, Text } from "@mantine/core";
import { Comment } from "./Comment";
import { NewComment } from "./NewComment";


type CommentSectionType = {
  flashcard: FlashcardSet;
  actionUser: User;
  comments: FlashcardComment[];
  w: number;
}



export const CommentSection = ({ flashcard, actionUser, comments, w }: CommentSectionType) => {

  return (
    <Stack w={w} mt={80}>
      <Group justify="space-between">
        <Text fw="bold" size="xl">Kommentarer</Text>
      </Group>
      <NewComment flashcard={flashcard} actionUser={actionUser} />
      {comments.length > 0 && <Divider my="xl" label="Publiserte kommentarer under" labelPosition="center" size="sm"/>}
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
    </Stack >
  )
}
