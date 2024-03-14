import { FlashcardView } from "@/app/types/flashcard";
import { Checkbox, Group, Paper, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { a, useSpring } from '@react-spring/web';
import { useState } from "react";

type CardProps = {
  view: FlashcardView;
  hasCopy: boolean;
  toggleDifficult: (markedView: FlashcardView) => void;
};

export default function Card({ view, hasCopy, toggleDifficult }: CardProps) {

  const [flipped, setFlipped] = useState(false)
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  })

  const [frontOrBack, setFrontOrBack] = useState("front");
  const theme = useMantineTheme();
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
        style={{
          height: "100%",
          width: "100%",
          // backgroundColor: frontOrBack == "front" ? theme.colors.orange[5] : theme.colors.grape[5],
          backgroundColor: "transparent",
          color: "black",
        }}
      >
        <a.button style={{ width: "66%", height: "66%", opacity: opacity.to(o => 1 - o), transform, position: "absolute", top: 0, left: 0, backgroundColor: theme.colors.orange[5] }} onClick={() => setFlipped(state => !state)}>
          <Stack align="center" style={{ width: "100%" }}>
            <Title style={{ textAlign: "center" }}>Spørsmål</Title>
            <Text
              style={{
                textAlign: "center",
              }}
              lineClamp={4}
              size="xl"
              p={10}
            >
              {view.front}
            </Text>
          </Stack>
        </a.button>
        <a.button style={{
          width: "66%", height: "66%", opacity, transform, rotateX: '180deg', position: "absolute", top: "25%", left: "25%", backgroundColor: theme.colors.grape[5]
        }} onClick={() => setFlipped(state => !state)}>
          <Stack align="center" style={{ width: "100%" }}>
            <Title style={{ textAlign: "center" }}>Fasit</Title>
            <Text
              style={{
                textAlign: "center",
              }}
              lineClamp={4}
              size="xl"
              p={10}
            >
              {view.back}
            </Text>
          </Stack>
        </a.button>
        {view.isCopy ? (
          <></>
        ) : (
          <Group justify="right">
            <Checkbox
              checked={hasCopy}
              onChange={() => {
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
