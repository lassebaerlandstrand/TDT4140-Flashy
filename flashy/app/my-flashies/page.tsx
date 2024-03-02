"use client";

import { FlashcardSet } from "@/app/types/flashcard";
import { getMyFlashies } from "@/app/utils/firebase";
import { UserFlashiesTable } from "@/components/tables/UserFlashiesTable";
import { ActionIcon, Button, Group, Loader, Stack, TextInput, Title, rem, useMantineTheme } from "@mantine/core";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import levenshtein from "fast-levenshtein";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: session } = useSession();
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>();
  const theme = useMantineTheme();

  useEffect(() => {
    if (session == null) return;

    async function fetchFlashcardSet() {
      if (session === null) return;
      const flashcardSet = await getMyFlashies(session.user);
      setFlashcardSets(flashcardSet);
    }
    fetchFlashcardSet();
  }, [session]);

  const filteredFlashcardSets = useMemo(() => {
    if (!flashcardSets) return [];

    return flashcardSets
      .filter((flashcardSet) => flashcardSet.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        // Use Levenshtein distance for sorting
        const distanceA = levenshtein.get(a.title.toLowerCase(), searchQuery.toLowerCase());
        const distanceB = levenshtein.get(b.title.toLowerCase(), searchQuery.toLowerCase());
        return distanceA - distanceB; // Sort in ascending order of distance
      });
  }, [flashcardSets, searchQuery]);

  return (
    <Stack align="center">
      {session ? (
        !flashcardSets ? (
          <Loader color="blue" size={48} />
        ) : (
          <>
            <Title>Mine Flashies</Title>
            <Group justify="space-between">
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
            </Group>
            {session.user && <UserFlashiesTable user={session.user} flashies={filteredFlashcardSets} />}
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
