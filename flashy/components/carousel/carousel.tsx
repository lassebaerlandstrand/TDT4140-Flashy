"use client";

import { FlashcardView } from "@/app/types/flashcard";
import { Carousel, Embla } from "@mantine/carousel";
import { Button, Container, Group, Progress, Stack } from "@mantine/core";
import { IconCheck, IconQuestionMark } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [embla, setEmbla] = useState<Embla | null>(null);

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
    setTimeout(() => {
      if (embla) {
        handleScroll();
      }
    }, 0);
  };

  const handleScroll = useCallback(() => {
    if (!embla) return;
    const progress = Math.max(0, Math.min(1, embla.scrollProgress()));
    setScrollProgress(progress * 100);
  }, [embla, setScrollProgress]);

  useEffect(() => {
    if (embla) {
      embla.on("scroll", handleScroll);
      handleScroll();
    }
  }, [embla, handleScroll]);

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
      <Card
        view={item}
        hasCopy={difficultViews.some((card) => card.id === item.id + "copy")}
        toggleDifficult={(markedView: FlashcardView) => toggleDifficult(markedView)}
        {...item}
      />
    </Carousel.Slide>
  ));

  return (
    <Stack align="center" w="100%">
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
      <Container w="100%">
        <Carousel height={400} slideGap="xl" align="start" getEmblaApi={setEmbla}>
          {slides}
        </Carousel>
        <Progress value={scrollProgress} size="sm" mt="xl" mx="auto" style={{ maxWidth: 320 }} />
      </Container>
    </Stack>
  );
}
