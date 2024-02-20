"use client";

import { Stack, Title } from "@mantine/core";
import { useSession } from "next-auth/react";
// import { getAllFlashcards } from "@/app/utils/firebase";
import { UserCard } from "@/components/user/UserCard";

export default function Home() {
  const { data: session } = useSession();

  return (
    <Stack align="center">
      <Title>Hei, {session?.user?.name ?? "user"}</Title>
      {session && <UserCard user={session.user} expires={""} />}
    </Stack>
  );
}
