"use client";

import Image from "next/image";
import { Button, Stack, Title } from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
// import { getAllFlashcards } from "@/app/utils/firebase";
import { UserCard } from "@/components/user/UserCard";

export default function Home() {
  const { data: session } = useSession();

  return (
    <Stack align="center">
      <Title>Hello, {session?.user?.name ?? "user"}</Title>
      {session && <UserCard user={session.user} expires={""} />}
    </Stack>
  );
}
