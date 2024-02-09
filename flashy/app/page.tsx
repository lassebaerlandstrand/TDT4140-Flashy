"use client";

import Image from "next/image";
import { Button, Stack, Title } from "@mantine/core";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <Stack align="center">
      {session ? (
        <>
          <Title>Hello, {session.user?.name}</Title>
          <Image src="/logo/FlashyLogoMain.png" alt="Flashy logo" width={330} height={487} />
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
