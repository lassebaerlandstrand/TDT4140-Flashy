"use client";

import { Carousel } from "@mantine/carousel";
import { Button, Container, Group, Paper, Stack, Text, Title, UnstyledButton } from "@mantine/core";
import { useState } from "react";

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
    <UnstyledButton style={{ width: "100%", height: "100%" }} onClick={() => handleClick()}>
      <Paper
        shadow="md"
        p="xl"
        radius="md"
        style={{ height: "100%", width: "100%", backgroundColor: frontOrBack == "front" ? "orange" : "#7AD1DD" }}
      >
        <Stack align="center" style={{ width: "100%" }}>
          <Title style={{ textAlign: "center" }}>{frontOrBack === "front" ? "Spørsmål" : "Fasit"}</Title>
          <Text style={{ textAlign: "center" }} lineClamp={4} size="xl" p={10}>
            {frontOrBack === "front" ? <>{view.front}</> : <>{view.back}</>}
          </Text>
        </Stack>
      </Paper>
    </UnstyledButton>
  );
}
type CarouselCardProps = {
  views: FlashcardView[];
};

export default function CarouselCard({ views }: CarouselCardProps) {
  const [currentViews, setCurrentViews] = useState(views);
  const originalViews = [...views];

  // Shuffle function
  const shuffleViews = () => {
    let shuffled = [...currentViews];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setCurrentViews(shuffled);
  };

  const resetViews = () => {
    setCurrentViews(originalViews);
  };
  const slides = currentViews.map((item, index) => (
    <Carousel.Slide key={item.id}>
      <Title style={{ position: "absolute", left: 10, top: 10 }}>{index + 1}</Title>
      <Card {...item} />
    </Carousel.Slide>
  ));

  return (
    <Stack align="center">
      <Group>
        <Button onClick={shuffleViews} style={{ margin: 10 }}>
          Shuffle
        </Button>
        <Button onClick={resetViews} style={{ margin: 10 }}>
          Reset
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
