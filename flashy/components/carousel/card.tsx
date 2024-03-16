import { FlashcardView } from "@/app/types/flashcard";
import { Button, Checkbox, Group, Stack, Text, Title, UnstyledButton, useMantineTheme } from "@mantine/core";
import { a, useSpring } from '@react-spring/web';
import { useState } from "react";

type CardProps = {
  view: FlashcardView;
  hasCopy: boolean;
  toggleDifficult: (markedView: FlashcardView) => void;
};

export default function Card({ view, hasCopy, toggleDifficult }: CardProps) {
  const theme = useMantineTheme();
  const [flipped, setFlipped] = useState(false)
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  })

  return (
    <>
      <a.div style={{
        display: "flex", alignItems: "center", width: "800px", height: "100%", opacity: opacity.to(o => 1 - o), transform, position: "absolute", top: 0, left: "180px", backgroundColor: theme.colors.orange[6],
        cursor: "pointer", border: "none", borderRadius: "10px", pointerEvents: `${ !flipped ? "auto" : "none" }`
      }} onClick={() => setFlipped(state => !state)} >
        <Stack align="center" style={{ width: "100%", color: "white" }}>
          <Title style={{ textAlign: "center" }} >Spørsmål</Title>
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
        {!view.isCopy && (
          <Group style={{ position: "absolute", left: "645px", top: "355px" }} onClick={(e) => e.stopPropagation()}>
            <Button
              color="rgba(80, 80, 80, 1)"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleDifficult(view);
              }}
            >
              <Checkbox
                checked={hasCopy}
                onChange={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDifficult(view);
                }}
                labelPosition="left"
                label="Vanskelig?"
              />
            </Button>
          </Group>
        )}
      </a.div>
      <a.div style={{
        display: "flex", alignItems: "center", width: "800px", height: "100%", opacity, transform, rotateX: '180deg', position: "absolute", top: 0, left: "180px", backgroundColor: theme.colors.grape[5],
        cursor: "pointer", border: "none", borderRadius: "10px", pointerEvents: `${ flipped ? "auto" : "none" }`
      }} onClick={() => setFlipped(state => !state)} >
        <Stack align="center" style={{ width: "100%", color: "white" }}>
          <Title style={{ textAlign: "center" }} >Fasit</Title>
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
        {!view.isCopy && (
          <Group style={{ position: "absolute", left: "645px", top: "355px" }} onClick={(e) => e.stopPropagation()}>
            <Button
              color="rgba(80, 80, 80, 1)"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleDifficult(view);
              }}
            >
              <Checkbox
                checked={hasCopy}
                onChange={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDifficult(view);
                }}
                labelPosition="left"
                label="Vanskelig?"
              />
            </Button>
          </Group>
        )}
      </a.div>
    </>
  );
}
