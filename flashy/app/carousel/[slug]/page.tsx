"use client"

import { getFlashcard } from "@/app/utils/firebase";
import { useEffect } from "react";




export default function Flashcards() {

    useEffect(() => {
        async function printFlashcard() {
          console.log(await getFlashcard("dummyFlashcardSet,"));
        }
        printFlashcard();
      }, []);


}