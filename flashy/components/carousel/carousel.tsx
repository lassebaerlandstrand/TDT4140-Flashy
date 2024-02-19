"use client";

import { FlashcardView } from "@/app/types/flashcard";
import { Carousel } from "@mantine/carousel";
import { Button, Container, Group, Stack, Title } from "@mantine/core";
import { IconCheck, IconQuestionMark } from "@tabler/icons-react";
import { useState } from "react";
import Card from "./card";

type CarouselCardProps = {
  views: FlashcardView[];
};

export default function CarouselCard({ views }: CarouselCardProps) {
  const [currentViews, setCurrentViews] = useState(views);
  const [isShuffled, setIsShuffled] = useState(false);
  const originalViews = [...views];
  const [difficultViews, setDifficultViews] = useState([] as FlashcardView[]);
  const [combinedViews, setCombinedViews] = useState(currentViews);

  const toggleDifficult = (markedView: FlashcardView) => {
    const markedViewCopy: FlashcardView = { ...markedView, id: markedView.id + "copy", isCopy: true };
    let newDifficultViews = [...difficultViews];

    if (markedViewCopy) {
      if (newDifficultViews.some((card) => card.id === markedView.id + "copy")) {
        newDifficultViews = newDifficultViews.filter((view) => view.id !== markedViewCopy.id);
        setDifficultViews(newDifficultViews);
      } else {
        newDifficultViews = [...difficultViews, markedViewCopy];
        setDifficultViews(newDifficultViews);
      }
    }

    setCombinedViews([...currentViews, ...newDifficultViews]);
  };

  // Shuffle function
  const shuffleViews = () => {
    let newCurrentViews = [...currentViews];
    if (isShuffled) {
      setCurrentViews(originalViews);
      newCurrentViews = originalViews;
      setIsShuffled(!isShuffled);
    } else {
      let shuffled = [...currentViews];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setCurrentViews(shuffled);
      newCurrentViews = shuffled;
      setIsShuffled(!isShuffled);
    }
    setCombinedViews([...newCurrentViews, ...difficultViews]);
  };
  const slides = combinedViews.map((item, index) => (
    <Carousel.Slide key={item.id}>
      <Title style={{ position: "absolute", left: 10, top: 10 }}>{index + 1}</Title>
      <Card
        view={item}
        hasCopy={difficultViews.some((card) => card.id === item.id + "copy")}
        toggleDifficult={(markedView: FlashcardView) => toggleDifficult(markedView)}
        {...item}
      />
    </Carousel.Slide>
  ));

  return (
    <Stack align="center">
      <Group>
        <Button
          onClick={shuffleViews}
          style={{ margin: 10 }}
          color={isShuffled ? "blue" : "gray"}
          rightSection={isShuffled ? <IconCheck></IconCheck> : <IconQuestionMark></IconQuestionMark>}
        >
          Shuffle{isShuffled ? "d" : ""}
        </Button>
      </Group>
      <Container style={{ width: "50vw" }}>
        <Carousel height={400} slideGap="xl" withIndicators align="start">
          {slides}
        </Carousel>
      </Container>
    </Stack>
  );
}
