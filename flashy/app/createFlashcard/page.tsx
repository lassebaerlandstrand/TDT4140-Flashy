"use client";

import { CreateFlashCardForm } from "@/components/createFlashcard/CreateFlashcardForm";
import { Container, Loader, Title } from "@mantine/core";
import { useSession } from "next-auth/react";

export default function FlashcardCreationForm() {
    const { data: session } = useSession();

    if (!session) {
        <Loader color="blue" size={48} />
    }

    return (
        <Container>
            <Title>Lag et nytt Flashy-sett</Title>
            <CreateFlashCardForm />
        </Container>
    );

}