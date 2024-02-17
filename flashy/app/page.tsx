"use client";

import { FlashiesTable } from "@/components/tables/FlashiesTable";
import { ActionIcon, Button, Loader, Stack, TextInput, Title, rem, useMantineTheme } from "@mantine/core";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getAllPublicFlashCardSets } from "./utils/firebase";

export default function Home() {
  const { data: session } = useSession();
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>();
  const theme = useMantineTheme();

  useEffect(() => {
    if (session == null) return;

    async function fetchFlashcardSet() {
      if (session == null) return;
      const flashcardSet = await getAllPublicFlashCardSets();
      setFlashcardSets(flashcardSet);
    }
    fetchFlashcardSet();
  }, [session]);

  return (
    <Stack align="center">
      {session ? (
        !flashcardSets ? (
          <Loader color="blue" size={48} />
        ) : (
          <>
            <Title>All Flashies</Title>
            <TextInput
              radius="xl"
              size="md"
              placeholder="Search flashies by title"
              rightSectionWidth={42}
              width="100%"
              leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
              rightSection={
                <ActionIcon size={32} radius="xl" color={theme.primaryColor} variant="filled">
                  <IconArrowRight style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                </ActionIcon>
              }
            />
            {<FlashiesTable flashies={flashcardSets} />}
          </>
        )
      ) : (
        <>
          <Title>Sign in to continue</Title>
          <Button onClick={() => signIn()}>Sign in</Button>
        </>
      )}
    </Stack>
  );
}
