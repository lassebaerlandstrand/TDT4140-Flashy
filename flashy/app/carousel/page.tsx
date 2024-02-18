"use client";

import CarouselCard from "@/components/carousel/carousel";
import { useFlashcards } from './shuffle';
import { Container, Button } from '@mantine/core';

export default function Carousel() {
  const { flashcards, shuffleFlashcards } = useFlashcards();
  return (
    <Container>
      <Button onClick={shuffleFlashcards}>Shuffle flashcards</Button>
      <CarouselCard/>
    </Container>
  );
}

