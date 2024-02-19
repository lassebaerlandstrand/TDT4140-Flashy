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
          {view.isCopy ? (
            <></>
          ) : (
            <Group justify="right">
              <Checkbox
                checked={difficultViews.some((card) => card.id === view.id + "copy")}
                onClick={() => {
                  toggleDifficult(view);
                }}
                labelPosition="left"
                label="Vanskelig?"
              />
            </Group>
          )}
        </Paper>
      </>
    );
  }

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
