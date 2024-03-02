import { FlashcardSet } from "@/app/types/flashcard";
import classes from "@/components/articleView/ArticleCardsGrid.module.css";
import { AspectRatio, Card, SimpleGrid, Stack, Text } from "@mantine/core";
import Image from "next/image";

type ArticleCardsProps = {
  flashcards: FlashcardSet[];
};

export function ArticleCardsGrid({ flashcards }: ArticleCardsProps) {
  const cards = flashcards.map((flashy) => (
    <Card
      key={flashy.title}
      p="md"
      shadow="sm"
      radius="md"
      component="a"
      href={"/carousel/" + flashy.title}
      className={classes.card}
    >
      <AspectRatio ratio={1920 / 1080}>
        <Image
          style={{ borderRadius: 5 }}
          src={flashy.coverImage ?? "https://picsum.photos/300?grayscale"}
          alt="Flashy logo"
          width={200}
          height={100}
          priority={true}
        />
      </AspectRatio>
      <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
        👨‍🎨 {flashy.creator?.name}
      </Text>
      <Text className={classes.title} mt={5}>
        {flashy.title}
      </Text>
    </Card>
  ));

  return (
    <Stack py="lg" w="65vw">
      <SimpleGrid spacing={20} cols={{ base: 1, xs: 1, sm: 2, lg: 3 }}>
        {cards}
      </SimpleGrid>
    </Stack>
  );
}
