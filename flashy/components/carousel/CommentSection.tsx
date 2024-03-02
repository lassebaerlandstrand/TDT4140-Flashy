import { FlashcardComment, FlashcardSet } from "@/app/types/flashcard";
import { User } from "@/app/types/user";
import { Divider, Group, Stack, Text } from "@mantine/core";
import { Comment } from "./Comment";
import { NewComment } from "./NewComment";


type CommentSectionType = {
  flashcard: FlashcardSet;
  actionUser: User;
  comments: FlashcardComment[];
}



export const CommentSection = ({ flashcard, actionUser, comments }: CommentSectionType) => {

  return (
    <Stack w={"100%"} px="sm" mt="xl">
      <Group justify="space-between">
        <Text fw="bold" size="xl">Kommentarer</Text>
      </Group>
      <NewComment flashcard={flashcard} actionUser={actionUser} />
      <Divider my="xl" />
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
