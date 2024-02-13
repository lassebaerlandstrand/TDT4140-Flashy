"use client"

import { getFlashcardSet } from "@/app/utils/firebase";
import { useEffect } from "react";




export default function Flashcards() {

    useEffect(() => {
        async function printFlashcard() {
          console.log(await getFlashcardSet("dummyFlashcardSet"));
        }
        printFlashcard();
      }, []);


}