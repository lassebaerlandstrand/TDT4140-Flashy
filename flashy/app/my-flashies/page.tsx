"use client";

import { FlashcardSet } from "@/app/types/flashcard";
import { getMyFlashies } from "@/app/utils/firebase";
import { UserFlashiesTable } from "@/components/tables/UserFlashiesTable";
import { ActionIcon, Button, Group, Loader, Stack, TextInput, Title, rem, useMantineTheme } from "@mantine/core";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
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
            {session.user && <UserFlashiesTable user={session.user} flashies={flashcardSets ?? []} />}
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
