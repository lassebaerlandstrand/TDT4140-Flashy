"use client";

import { ArticleCardsGrid } from "@/components/articleView/ArticleCardsGrid";
import { ActionIcon, Button, Group, Loader, Select, Stack, TextInput, Title, rem, useMantineTheme } from "@mantine/core";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FlashcardSet } from "./types/flashcard";
import { getAllPublicFlashCardSets } from "./utils/firebase";

const sortByLikedSets = (flashcardSets: FlashcardSet[]) => {
  if (!flashcardSets) return [];
  return flashcardSets
    .sort((a, b) => b.numOfLikes - a.numOfLikes)
};
const sortByFavoredSets = (flashcardSets: FlashcardSet[]) => {
  if (!flashcardSets) return [];
  return flashcardSets
    .sort((a, b) => b.numOfFavorites - a.numOfFavorites)
};
const sortByNewestDateSets = (flashcardSets: FlashcardSet[]) => {
  if (!flashcardSets) return [];
  return flashcardSets
    .sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf())
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>("");
  const { data: session } = useSession();
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>();
  const theme = useMantineTheme();

  const options = [
    { value: "most-liked", label: "Mest likte" },
    { value: "most-favored", label: "Mest favoriserte" },
    { value: "newest", label: "Nyeste" }
  ]

  useEffect(() => {
    if (session == null) return;

    async function fetchFlashcardSet() {
      if (session == null) return;
      const flashcardSet = await getAllPublicFlashCardSets(session.user);
      setFlashcardSets(flashcardSet);
    }
    fetchFlashcardSet();
  }, [session]);

  const sortedFlashcardSets = useMemo(() => {
    if (!flashcardSets) return [];

    let result = [...flashcardSets];

    if (selectedOption === "most-liked") {
      return sortByLikedSets(result);
    } else if (selectedOption === "most-favored") {
      return sortByFavoredSets(result);
    } else if (selectedOption === "newest") {
      return sortByNewestDateSets(result);
    }

    return result;

  }, [flashcardSets, selectedOption]);

  const searchAndFilterFlashcardSets = useMemo(() => {
    if (!sortedFlashcardSets) return [];
    return sortedFlashcardSets.filter((flashcardSets) =>
      flashcardSets.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [sortedFlashcardSets, searchQuery]);

  return (
    <Stack align="center">
      {session ? (
        !flashcardSets ? (
          <Loader color="blue" size={48} />
        ) : (
          <>
            <Group >
              <Title style={{ marginTop: '30px' }}>Populære flashies</Title>
            </Group>

            <Title>Alle flashies</Title>
            <Group>
              <TextInput
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                radius="xl"
                size="md"
                placeholder="Søk etter flashies etter tittel"
                rightSectionWidth={42}
                width="100%"
                leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
                rightSection={
                  <ActionIcon size={32} radius="xl" color={theme.primaryColor} variant="filled">
                    <IconArrowRight style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                  </ActionIcon>
                }
              />
              <Button component={Link} href="/createFlashcard">
                Lag nytt sett
              </Button>
              <Select
                // label="Sorter"
                placeholder="Sorter flashies"
                data={options}
                value={selectedOption}
                onChange={(value) => setSelectedOption(value)}
              />
            </Group>
            {<ArticleCardsGrid user={session.user} flashcards={searchAndFilterFlashcardSets ?? []} />}
            {/* {<ArticleCardsGrid user={session.user} flashcards={filteredFlashcardSets ?? []} />} */}
          </>
        )
      ) : (
        <>
          <Title>Logg inn for å fortsette</Title>
          <Button onClick={() => signIn()}>Logg inn</Button>
        </>
      )}
    </Stack>
  );
}
