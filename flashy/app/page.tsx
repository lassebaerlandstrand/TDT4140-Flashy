"use client";

import Image from "next/image";
import { Button, Stack, Title } from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { getAllFlashcards, getAllUsers, getFlashcardsByEmail } from "@/lib/utils/firebase";

export default function Home() {
  const { data: session } = useSession();

  useEffect(() => {
    async function printAllFlashcards() {
      console.log(await getAllFlashcards());
    } 
    printAllFlashcards();
  }, []);

  return (
    <Stack align="center">
      <Button component={Link} href="/demo">
        Go to demo
      </Button>
      {session ? (
        <>
          <Title>Hello, {session.user?.name}</Title>
          <Image
            src="/logo/FlashyLogoMain.png"
            alt="Flashy logo"
            width={330}
            height={487}
          />
          <Button onClick={() => signOut()}>Sign out</Button>
        </>
      ) : (
        <>
          <Title>Sign in to continue</Title>
          <Button onClick={() => signIn()}>Sign in</Button>
        </>
      )}
    </Stack>
  );
}
