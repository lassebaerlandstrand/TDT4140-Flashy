"use client";

import Image from "next/image";
import { Button, Stack, Title } from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { firestore } from "@/lib/firestore";
import { collection, getDocs } from "@firebase/firestore";
import { useEffect } from "react";
import { getAllUsers } from "@/lib/utils/firebase";

export default function Home() {
  const { data: session } = useSession();

  useEffect(() => {
    // getUsers();

    async function abc() {
      console.log(await getAllUsers());
    } 
    abc();
      
  }, [])

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
