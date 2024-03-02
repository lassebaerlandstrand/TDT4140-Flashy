"use client";

import { Button, Divider, Stack, Title } from "@mantine/core";
import { signIn, useSession } from "next-auth/react";
// import { getAllFlashcards } from "@/app/utils/firebase";
import { DangerZone, UserCard } from "@/components/user/UserCard";

export default function Home() {
  const { data: session } = useSession();

  return (
    <Stack align="center">
      {session ? (
        <>
          <Title>Hei {session.user?.name}</Title>
          <UserCard user={session.user} expires={""} />
          <Divider
            style={{ paddingTop: 100, paddingBottom: 100 }}
            my="md"
            size="xl"
            label="Danger Zone"
            labelPosition="center"
          />
          <DangerZone user={session.user} expires={undefined} />
        </>
      ) : (
        <>
          <Title>Logg inn for å fortsette</Title>
          <Button onClick={() => signIn()}>Logg inn</Button>
        </>
      )}
    </Stack>
  );
}
