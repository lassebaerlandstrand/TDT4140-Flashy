import { createNewFlashcard } from "@/app/utils/firebase";
import { Button, Group, Stack, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSession } from "next-auth/react";


export const CreateFlashCardForm = () => {
    const { data: session } = useSession();

    const form = useForm<Omit<CreateFlashCardType, "creator">>({
        initialValues: {
            title: '',
            views: [],
        },

        validate: {},
    });

    const onSubmit = (values: typeof form.values) => {
        if (!session) { return; }

        const flashcardSet: CreateFlashCardType = {
            creator: session.user,
            title: values.title,
            views: values.views,
        }

        createNewFlashcard(flashcardSet);
    }

    return (

        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
            <TextInput
                withAsterisk
                label="Navn på sett"
                placeholder="Skriv inn navn på settet"
                {...form.getInputProps('title')}
            />

            <Button onClick={() => form.setFieldValue('views', [...form.values.views, { front: '', back: '' }])}>Legg til nytt kort</Button>
            <Stack>
                {form.values.views.map((view, index) => (
                    <Group>
                        <Textarea label="Framside" placeholder="Skriv inn det som skal vises på framsiden" />
                        <Textarea label="Bakside" placeholder="Skriv inn det som skal vises på baksiden" />
                    </Group>
                ))}
            </Stack>

            <Group justify="flex-end" mt="md">
                <Button type="submit">Submit</Button>
            </Group>
        </form>

    );

}