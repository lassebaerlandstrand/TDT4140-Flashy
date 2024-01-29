import { Button, Stack, Title } from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";


export default function HeaderMenu() {
  const { data: session } = useSession();
  return (
    <header color="white">
      <Stack
      >
<Title>Hello</Title>
        </Stack>
        <Stack >
          {session ? (
            <>
              <Button
                onClick={() => signOut()}
                size="large"
              >
                Logg ut
              </Button>
            </>
          ) : (
            <Button
              size="large"
              onClick={() => signIn()}
            >
              Logg inn
            </Button>
          )}
      </Stack>
    </header>
  );
}