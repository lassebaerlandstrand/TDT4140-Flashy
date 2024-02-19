"use client";

import { CreateFlashCardType, Visibility } from "@/app/types/flashcard";
import { createNewFlashcard } from "@/app/utils/firebase";
import { ActionIcon, Button, Divider, Flex, Grid, Group, Select, Stack, Text, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useState } from "react";


export const CreateFlashCardForm = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

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
    }).finally(() => { setLoading(false); });
  }

  return (

    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
      <Stack>

        <Group justify="space-between">
          <TextInput
            withAsterisk
            label="Navn på sett"
            placeholder="Skriv inn navn på settet"
            {...form.getInputProps('title')}
            w={250}
          />

          <Select
            label="Sett synlighet"
            placeholder="Rediger synlighet"
            data={Object.values(Visibility)}
            {...form.getInputProps('visibility')}
            maw={150}
          />
        </Group>

        <Divider />

        <Stack gap="xl">
          {form.values.views.map((_, index) => (
            <Grid key={index}>
              <Grid.Col span={1}>
                <Flex justify="center" align="center" style={{ height: "100%" }}>
                  <Text fw={700}>{index + 1}:</Text> {/* Order is not guaranteed to be the same in Firebase*/}
                </Flex>
              </Grid.Col>
              <Grid.Col span={5}>
                <Textarea
                  label="Framside"
                  placeholder="Skriv inn det som skal vises på framsiden"
                  {...form.getInputProps(`views.${index}.front`)}
                  autosize
                  resize="vertical"
                  minRows={4}
                />
              </Grid.Col>
              <Grid.Col span={5}>
                <Textarea
                  label="Bakside"
                  placeholder="Skriv inn det som skal vises på baksiden"
                  {...form.getInputProps(`views.${index}.back`)}
                  autosize
                  resize="vertical"
                  minRows={4}
                />
              </Grid.Col>
              <Grid.Col span={1}>
                <Flex justify="center" align="center" style={{ height: "100%" }}>
                  <ActionIcon onClick={() => form.setFieldValue('views', form.values.views.filter((_, i) => i !== index))} color="red" >
                    <IconX stroke={1.5} />
                  </ActionIcon>
                </Flex>
              </Grid.Col>
            </Grid>
          ))}
        </Stack>
        <Group justify="center">
          <Button onClick={() => form.setFieldValue('views', [...form.values.views, { front: '', back: '' }])}>Legg til nytt kort</Button>
        </Group>

        <Group justify="flex-end" mt="md">
          <Button type="submit" loading={loading}>Lag sett</Button>
        </Group>
      </Stack>
    </form>

  );

}