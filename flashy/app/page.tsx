"use client";

import { Button, Stack, Title } from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();


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
