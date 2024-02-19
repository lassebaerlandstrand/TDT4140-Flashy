import { EditFlashCardType, FlashcardSet, Visibility } from "@/app/types/flashcard";
import { ActionIcon, Button, Divider, Flex, Grid, Group, Select, Stack, Text, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconX } from "@tabler/icons-react";
import { useSession } from "next-auth/react";

type EditFlashCardFormType = {
  flashcardSet: FlashcardSet;
}

export const EditFlashCardForm = ({ flashcardSet }: EditFlashCardFormType) => {
  const { data: session } = useSession();

  const form = useForm<EditFlashCardType>({
    initialValues: {
      views: flashcardSet.views,
      visibility: flashcardSet.visibility,
    },
  });

  const onSubmit = (values: typeof form.values) => {
    if (!session) { return; }

    const flashcardSet: EditFlashCardType = {
      views: values.views,
      visibility: values.visibility,
    }

  }

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
      <Stack>

        <Select
          label="Sett synlighet"
          placeholder="Rediger synlighet"
          data={Object.values(Visibility)}
          {...form.getInputProps('visibility')}
          maw={150}
        />

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
          <Button onClick={() => form.reset()} color="red" disabled={!form.isDirty()}>Reset</Button>
          <Button type="submit" disabled={!form.isDirty()}>Lagre redigert sett</Button>
        </Group>
      </Stack>
    </form >
  );

}