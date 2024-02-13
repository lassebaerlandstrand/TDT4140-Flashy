"use client"

import { getAllUsers, getFlashcardSet } from "@/app/utils/firebase";
import CarouselCard from "@/components/carousel/carousel";
import { useEffect, useState } from "react";




export default function Flashcards() {

  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet>();



  useEffect(() => {
    async function fetchFlashcardSet() {
      const flashcardSet = await getFlashcardSet("dummyFlashcardSet");
      setFlashcardSet(flashcardSet);
      // getAllUsers();
    }
    fetchFlashcardSet();
  }, []);

  if (!flashcardSet) {
    return <div>Loading...</div>;
  }

  console.log(flashcardSet);

  return (
    <CarouselCard />
  )

}