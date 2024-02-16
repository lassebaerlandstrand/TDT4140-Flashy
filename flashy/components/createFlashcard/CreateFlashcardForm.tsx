"use client";

import { CreateFlashCardType, Visibility } from "@/app/types/flashcard";
import { createNewFlashcard } from "@/app/utils/firebase";
import { ActionIcon, Button, Group, Select, Stack, Text, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconX } from "@tabler/icons-react";
import { useSession } from "next-auth/react";


export const CreateFlashCardForm = () => {
    const { data: session } = useSession();

    const form = useForm<Omit<CreateFlashCardType, "creator">>({
        initialValues: {
            title: '',
            views: [],
            visibility: Visibility.Public,
        },

        validate: {},
    });

    const onSubmit = (values: typeof form.values) => {
        if (!session) { return; }

        const flashcardSet: CreateFlashCardType = {
            creator: session.user,
            title: values.title,
            views: values.views,
            visibility: values.visibility,
        }

        try {
            createNewFlashcard(flashcardSet);
        }
        catch (error) {
            console.error(error);
        }
    }

    console.log(form.values);

    return (

        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
            <Stack>
                <TextInput
                    withAsterisk
                    label="Navn på sett"
                    placeholder="Skriv inn navn på settet"
                    {...form.getInputProps('title')}
                />

                <Select
                    label="Sett synlighet"
                    placeholder="Velg synlighet"
                    data={Object.values(Visibility)}
                    {...form.getInputProps('visibility')}
                />

                <Button onClick={() => form.setFieldValue('views', [...form.values.views, { front: '', back: '' }])}>Legg til nytt kort</Button>
                <Stack gap="xl">
                    {form.values.views.map((view, index) => (
                        <Group>
                            <Text mt={22}>Kort {index + 1}:</Text>
                            <Group>
                                <Textarea label="Framside" placeholder="Skriv inn det som skal vises på framsiden"  {...form.getInputProps(`views.${index}.front`)} />
                                <Textarea label="Bakside" placeholder="Skriv inn det som skal vises på baksiden" {...form.getInputProps(`views.${index}.back`)} />
                                <ActionIcon mt={22} onClick={() => form.setFieldValue('views', form.values.views.filter((_, i) => i !== index))} color="red" >
                                    <IconX stroke={1.5} />
                                </ActionIcon>
                            </Group>
                        </Group>
                    ))}
                </Stack>

                <Group justify="flex-end" mt="md">
                    <Button type="submit">Lag sett</Button>
                </Group>
            </Stack>
        </form>

    );

}