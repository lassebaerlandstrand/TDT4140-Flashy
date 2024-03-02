import { FlashcardSet } from "@/app/types/flashcard";
import { User } from "@/app/types/user";
import { toggleLike } from "@/app/utils/firebase";
import { ActionIcon } from "@mantine/core";
import { IconThumbUp, IconThumbUpFilled } from "@tabler/icons-react";
import { useState } from "react";

type SettingsButtonType = {
  user: User;
  flashcard: FlashcardSet;
}

export function LikeButton({ user, flashcard }: SettingsButtonType) {
  const [liked, setLiked] = useState(flashcard.userHasLiked);

  const handleLike = async (actionUser: User) => {
    toggleLike(actionUser, flashcard).then((hasLiked) => {
      setLiked(hasLiked);
    }).catch((error) => {

    });
  };

  return (
    <ActionIcon variant="subtle" size="lg" onClick={() => handleLike(user)}>
      {
        liked ? <IconThumbUpFilled width={22} /> : <IconThumbUp width={22} />
      }
    </ActionIcon>
  );
}
