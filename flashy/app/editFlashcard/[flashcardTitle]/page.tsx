"use client";

import { FlashcardSet } from "@/app/types/flashcard";
import { getFlashcardSet } from "@/app/utils/firebase";
import { EditFlashCardForm } from "@/components/editFlashcard/EditFlashcardForm";
import { Button, Loader, Stack, Title } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

type FlashcardEditFormType = {
    params: { flashcardTitle: string };
};

export default function FlashcardEditForm({ params }: FlashcardEditFormType) {
    const { data: session } = useSession();
    const [flashcardSet, setFlashcardSet] = useState<FlashcardSet>();
    const [failedToFetch, setFailedToFetch] = useState(false);

    useEffect(() => {
        if (session == null) return;

        async function fetchFlashcardSet() {
            if (session == null) return;
            try {
                const decodedTitle = decodeURIComponent(params.flashcardTitle);
                const flashcardSet = await getFlashcardSet(decodedTitle, session.user.id);
                setFlashcardSet(flashcardSet);
            } catch (error) {
                setFailedToFetch(true);
            }
        }
        fetchFlashcardSet();
    }, [session, params.flashcardTitle]);

    if (failedToFetch) {
        return (
            <Stack>
                <Title>Fant ikke flashcard settet</Title>
                <Button component={Link} href="/" >Gå til hjemmesiden</Button>
            </Stack>
        );
    }

    if (!session || !flashcardSet) {
        return <Loader color="blue" size={48} />;
    }

    if (session.user.role !== "admin" && flashcardSet?.creator?.id !== session.user.id) {
        return (
            <Stack>
                <Title>Du har ikke tilgang til å redigere dette settet</Title>
                <Button component={Link} href="/" >Gå til hjemmesiden</Button>
            </Stack>
        );
    }


    return (
        <Stack gap="xl" w={800}>
            <Title>Rediger settet "{flashcardSet.title}"</Title>
            <EditFlashCardForm flashcardSet={flashcardSet} />
        </Stack>
    );

}