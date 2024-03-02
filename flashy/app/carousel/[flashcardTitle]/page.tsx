"use client";

import { FlashcardSet } from "@/app/types/flashcard";
import { getFlashcardSet, removeFavoriteFlashcard, setFavoriteFlashcard } from "@/app/utils/firebase";
import { SettingsButton } from "@/components/carousel/SettingsButton";
import CarouselCard from "@/components/carousel/carousel";
import { ActionIcon, Button, Code, Group, Loader, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconStarFilled } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

type FlashcardsType = {
  params: { flashcardTitle: string };
};

export default function Flashcards({ params }: FlashcardsType) {
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>();
  const [failedToFetch, setFailedToFetch] = useState(false);
  const { data: session } = useSession();

  const theme = useMantineTheme();
  const favoriteColor = theme.colors.yellow[5];
  const notFavoriteColor = theme.colors.cyan[5];
  const [color, setColor] = useState(flashcardSet?.userHasFavorited ? favoriteColor : notFavoriteColor);

  const handleToggleSetFavourite = async () => {
    if (!session?.user.id || !flashcardSet?.id) {
      notifications.show({
        title: "Noe gikk galt",
        message: "Kunne ikke legge til flashcard i favoritter",
        color: "red",
      });
      return;
    }
    if (color === favoriteColor) {
      try {
        await removeFavoriteFlashcard(flashcardSet?.id!, session?.user.id);
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
        await setFavoriteFlashcard(flashcardSet.id, session.user.id);
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

  useEffect(() => {
    if (session == null) return;

    async function fetchFlashcardSet() {
      if (session == null) return;
      try {
        const decodedTitle = decodeURIComponent(params.flashcardTitle);
        const flashcardSet = await getFlashcardSet(decodedTitle, session.user.id);
        setFlashcardSet(flashcardSet);
      } catch (error) {
        setFailedToFetch(true);
      }
    }
    fetchFlashcardSet();
  }, [session, params.flashcardTitle]);

  if (failedToFetch) {
    return (
      <Stack>
        <Title>Fant ikke flashcard settet</Title>
        <Button component={Link} href="/">
          Gå til hjemmesiden
        </Button>
      </Stack>
    );
  }

  if (!session || !flashcardSet) {
    return <Loader color="blue" size={48} />;
  }

  return (
    <Stack align="center">
      <Group gap="lg">
        <Title>{flashcardSet.title}</Title>
        <ActionIcon
          variant="filled"
          color={color}
          onClick={handleToggleSetFavourite}
          disabled={session.user.id === flashcardSet.creator?.id}
        >
          <IconStarFilled size={20} />
        </ActionIcon>
      </Group>
      <Text>
        by: <Code>{flashcardSet.creator ? flashcardSet.creator.name : "Slettet bruker"}</Code>{" "}
      </Text>
      <CarouselCard views={flashcardSet.views ?? []} />

      {session?.user.role === "admin" || flashcardSet.creator?.id === session?.user.id ? (
        <Group pl="md" w={"100%"} justify="space-between">
          <SettingsButton user={session.user} flashcard={flashcardSet} />
        </Group>
      ) : null}
    </Stack>
  );
}
