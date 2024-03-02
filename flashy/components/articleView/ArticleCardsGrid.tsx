import { FlashcardSet } from "@/app/types/flashcard";
import { SimpleGrid, Stack } from "@mantine/core";
import { Session } from "next-auth";
import { ArticleCard } from "./ArticleCard";

type ArticleCardsProps = {
  flashcards: FlashcardSet[];
  user: Session["user"];
};

export function ArticleCardsGrid({ flashcards, user }: ArticleCardsProps) {
  const cards = flashcards.map((flashy) => {
    return <ArticleCard flashcard={flashy} key={flashy.title} user={user} />;
  });

  return (
    <Stack py="lg" w="65vw">
      <SimpleGrid spacing={20} cols={{ base: 1, xs: 1, sm: 2, lg: 3 }}>
        {cards}
      </SimpleGrid>
    </Stack>
  );
}
