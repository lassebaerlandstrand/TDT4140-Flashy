import { FlashcardView } from "@/app/types/flashcard";
import { Checkbox, Group, Paper, Stack, Text, Title, UnstyledButton, useMantineTheme } from "@mantine/core";
import { useState } from "react";

type CardProps = {
  view: FlashcardView;
  hasCopy: boolean;
  toggleDifficult: (markedView: FlashcardView) => void;
};

export default function Card({ view, hasCopy, toggleDifficult }: CardProps) {
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
          backgroundColor: frontOrBack == "front" ? theme.colors.orange[5] : theme.colors.grape[5],
          color: "black",
        }}
      >
        <UnstyledButton style={{ width: "100%", height: "100%" }} onClick={() => handleClick()}>
          <Stack align="center" style={{ width: "100%" }}>
            <Title style={{ textAlign: "center" }}>{frontOrBack === "front" ? "Spørsmål" : "Fasit"}</Title>
            <Text
              style={{
                textAlign: "center",
              }}
              lineClamp={4}
              size="xl"
              p={10}
            >
              {frontOrBack === "front" ? <>{view.front}</> : <>{view.back}</>}
            </Text>
          </Stack>
        </UnstyledButton>
        {view.isCopy ? (
          <></>
        ) : (
          <Group justify="right">
            <Checkbox
              checked={hasCopy}
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
