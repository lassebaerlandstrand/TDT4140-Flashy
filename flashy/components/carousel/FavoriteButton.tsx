"use client";

import { FlashcardSet } from "@/app/types/flashcard";
import { removeFavoriteFlashcard, setFavoriteFlashcard } from "@/app/utils/firebase";
import { ActionIcon, useMantineTheme } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconStar } from "@tabler/icons-react";
import { Session } from "next-auth";
import { useState } from "react";

type FavoriteButtonParams = {
  user: Session["user"];
  flashcard: FlashcardSet;
};

export default function FavoriteButton({ user, flashcard }: FavoriteButtonParams) {
  const theme = useMantineTheme();
  const favoriteColor = theme.colors.yellow[5];
  const notFavoriteColor = theme.colors.cyan[5];
  const [color, setColor] = useState(flashcard?.userHasFavorited ? favoriteColor : notFavoriteColor);

  const handleToggleSetFavourite = async () => {
    if (!user.id || !flashcard?.id) {
      notifications.show({
        title: "Noe gikk galt",
        message: "Kunne ikke legge til flashcard i favoritter",
        color: "red",
      });
      return;
    }
    if (color === favoriteColor) {
      try {
        await removeFavoriteFlashcard(flashcard?.id, user.id);
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
    <ActionIcon variant="filled" color={color} onClick={handleToggleSetFavourite} disabled={user.id === flashcard.creator?.id}>
      <IconStar size={20} />
    </ActionIcon>
  );
}
