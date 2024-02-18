"use client";

import { FlashcardView } from "@/app/types/flashcard";
import { Carousel } from "@mantine/carousel";
import { Container, Paper, Stack, Text, Title, UnstyledButton } from "@mantine/core";
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
  const slides = views.map((item, index) => (
    <Carousel.Slide key={item.id}>
      <Title style={{ position: "absolute", left: 10, top: 10 }}>{index + 1}</Title>
      <Card {...item} />
    </Carousel.Slide>
  ));

  return (
    <Stack align="center">
      <Container style={{ width: "50vw" }}>
        <Carousel height={400} slideGap="xl" withIndicators align="start">
          {slides}
        </Carousel>
      </Container>
    </Stack>
  );
}
