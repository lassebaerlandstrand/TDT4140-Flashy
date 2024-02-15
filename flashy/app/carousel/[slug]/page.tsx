"use client";

import { getFlashcardSet } from "@/app/utils/firebase";
import CarouselCard from "@/components/carousel/carousel";
import { Loader } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Flashcards() {
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet>();
  const { data: session } = useSession();

  useEffect(() => {
    if (session == null) {
      return;
    }

    async function fetchFlashcardSet() {
      console.log(session?.user);
      const flashcardSet = await getFlashcardSet("dummyFlashcardSet", session?.user.id);
      setFlashcardSet(flashcardSet);
      // getAllUsers();
    }
    fetchFlashcardSet();
  }, [session]);

  if (!flashcardSet) {
    return <Loader color="blue" size={48} />;
  }

  // console.log(flashcardSet);

  return <CarouselCard />;
}
