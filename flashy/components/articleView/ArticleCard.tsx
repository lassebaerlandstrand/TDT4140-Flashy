import { FlashcardSet } from "@/app/types/flashcard";
import { removeFavoriteFlashcard, setFavoriteFlashcard } from "@/app/utils/firebase";
import classes from "@/components/articleView/ArticleCardsGrid.module.css";
import { ActionIcon, AspectRatio, Card, Group, Stack, Text, UnstyledButton, useMantineTheme } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconStarFilled } from "@tabler/icons-react";
import { Session } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ArticleCardProps = {
  flashcard: FlashcardSet;
  user: Session["user"];
};

export function ArticleCard({ flashcard, user }: ArticleCardProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const favoriteColor = theme.colors.yellow[5];
  const notFavoriteColor = theme.colors.cyan[5];
  const [color, setColor] = useState(flashcard.userHasFavorited ? favoriteColor : notFavoriteColor);

  const handleToggleSetFavourite = async () => {
    if (color === favoriteColor) {
      try {
        await removeFavoriteFlashcard(flashcard.id, user.id);
        setColor(notFavoriteColor);
        notifications.show({
          title: "Fjernet fra favoritter",
          message: "Flashcard fjernet fra favoritter 😶‍🌫️",
          color: "cyan",
        });
      } catch (error) {
        notifications.show({
          title: "Noe gikk galt",
          message: "Kunne ikke fjerne flashcard fra favoritter",
          color: "red",
        });
      }
    } else {
      try {
        await setFavoriteFlashcard(flashcard.id, user.id);
        setColor(favoriteColor);
        notifications.show({
          title: "Lagt til i favoritter",
          message: "Flashcard lagt til i favoritter 🌟",
          color: "yellow",
        });
      } catch (error) {
        notifications.show({
          title: "Noe gikk galt",
          message: "Kunne ikke legge til flashcard i favoritter",
          color: "red",
        });
      }
    }
  };

  return (
    <Card key={flashcard.title} p="md" shadow="sm" radius="md" component="a" className={classes.card}>
      <UnstyledButton onClick={() => router.push("/carousel/" + flashcard.title)}>
        <AspectRatio ratio={1920 / 1080}>
          <Image
            style={{ borderRadius: 5 }}
            src={flashcard.coverImage || "https://picsum.photos/300?grayscale"}
            alt="Forsidebilde for Flashy"
            width={200}
            height={100}
            priority={true}
          />
        </AspectRatio>
      </UnstyledButton>
      <Group justify="space-between" mt="md">
        <Stack align="left">
          <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
            👨‍🎨 {flashcard.creator?.name ?? "slettet bruker"}
          </Text>
          <Text tt="capitalize" fw={600}>
            {flashcard.title}
          </Text>
        </Stack>
        <ActionIcon
          variant="filled"
          color={color}
          onClick={handleToggleSetFavourite}
          disabled={user.id === flashcard.creator?.id}
        >
          <IconStarFilled size={20} />
        </ActionIcon>
      </Group>
    </Card>
  );
}
