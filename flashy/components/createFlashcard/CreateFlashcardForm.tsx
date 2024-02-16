"use client";

import { CreateFlashCardType, Visibility } from "@/app/types/flashcard";
import { createNewFlashcard } from "@/app/utils/firebase";
import { ActionIcon, Button, Divider, Group, Select, Stack, Text, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
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

        validate: {
            title: (value) => {
                if (value.length < 3) return 'Navnet må være minst 3 tegn';
            },
        }
    });

    const onSubmit = (values: typeof form.values) => {
        if (!session) { return; }

        const flashcardSet: CreateFlashCardType = {
            creator: session.user,
            title: values.title,
            views: values.views,
            visibility: values.visibility,
        }

        createNewFlashcard(flashcardSet).then(() => {
            notifications.show({
                title: "Settet er laget",
                message: "Synligheten på settet er " + values.visibility + " og det er lagt til i din profil",
                color: "green",
            });
            form.reset();
        }).catch((error) => {
            notifications.show({
                title: 'Noe gikk galt',
                message: error.message,
                color: 'red',
            })
        });

    }

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

                <Divider />

                <Stack gap="xl">
                    {form.values.views.map((_, index) => (
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
                <Button onClick={() => form.setFieldValue('views', [...form.values.views, { front: '', back: '' }])}>Legg til nytt kort</Button>

                <Group justify="flex-end" mt="md">
                    <Button type="submit">Lag sett</Button>
                </Group>
            </Stack>
        </form>

    );

}