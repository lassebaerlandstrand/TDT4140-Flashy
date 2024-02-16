import { Button, Container, SimpleGrid, Stack, Title } from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";

export default function HeaderMenu() {
  const { data: session } = useSession();
  return (
    <header>
      <SimpleGrid cols={2}>
        <Container>
          <Title>Hello</Title>
        </Container>
        <Container>
          <Stack>
            {session ? (
              <>
                <Button onClick={() => signOut()} size="large">
                  Logg ut
                </Button>
              </>
            ) : (
              <Button size="large" onClick={() => signIn()}>
                Logg inn
              </Button>
            )}
          </Stack>
        </Container>
      </SimpleGrid>
    </header>
  );
}
