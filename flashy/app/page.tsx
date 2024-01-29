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
          <Image src="/flashy.png" alt="Flashy logo" width={500} height={500} />
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
