"use client";

import { FlashcardView } from "@/app/types/flashcard";
import { Carousel } from "@mantine/carousel";
import { Button, Checkbox, Container, Group, Paper, Stack, Text, Title, UnstyledButton } from "@mantine/core";
import { IconCheck, IconQuestionMark } from "@tabler/icons-react";
import { useState } from "react";

type CarouselCardProps = {
  views: FlashcardView[];
};

export default function CarouselCard({ views }: CarouselCardProps) {
  const [currentViews, setCurrentViews] = useState(views);
  const [isShuffled, setIsShuffled] = useState(false);
  const originalViews = [...views];
  const [difficultViews, setDifficultViews] = useState([] as FlashcardView[]);
  const [combinedViews, setCombinedViews] = useState([...currentViews, ...difficultViews]);

  const toggleDifficult = (id: string) => {
    const markedView = originalViews.find((view) => view.id === id);
    if (markedView) {
      if (difficultViews.includes(markedView)) {
        setDifficultViews(difficultViews.filter((view) => view.id !== id));
      } else {
        setDifficultViews([...difficultViews, markedView]);
      }
    }
  };

  function Card(view: FlashcardView) {
    const [frontOrBack, setFrontOrBack] = useState("front");

    const handleClick = () => {
      if (frontOrBack === "front") {
        setFrontOrBack("back");
      } else {
        setFrontOrBack("front");
      }
    };

    return (
      <>
        <Paper
          shadow="md"
          p="xl"
          radius="md"
          style={{ height: "100%", width: "100%", backgroundColor: frontOrBack == "front" ? "orange" : "#7AD1DD" }}
        >
          <UnstyledButton style={{ width: "100%", height: "100%" }} onClick={() => handleClick()}>
            <Stack align="center" style={{ width: "100%" }}>
              <Title style={{ textAlign: "center" }}>{frontOrBack === "front" ? "Spørsmål" : "Fasit"}</Title>
              <Text style={{ textAlign: "center" }} lineClamp={4} size="xl" p={10}>
                {frontOrBack === "front" ? <>{view.front}</> : <>{view.back}</>}
              </Text>
            </Stack>
          </UnstyledButton>
          <Group justify="right">
            <Checkbox
              onClick={() => {
                toggleDifficult(view.id);
              }}
              style={{ paddingBottom: 100 }}
              label="Vanskelig?"
            />
          </Group>
        </Paper>
      </>
    );
  }

  // Shuffle function
  const shuffleViews = () => {
    if (isShuffled) {
      setCurrentViews(originalViews);
      setIsShuffled(!isShuffled);
    } else {
      let shuffled = [...currentViews];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setIsShuffled(!isShuffled);
      setCurrentViews(shuffled);
    }
  };
  const slides = combinedViews.map((item, index) => (
    <Carousel.Slide key={item.id}>
      <Title style={{ position: "absolute", left: 10, top: 10 }}>{index + 1}</Title>
      <Card {...item} />
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
