import { EditFlashCardType, EditFlashcardView, FlashcardSet, Visibility } from "@/app/types/flashcard";
import { ConvertToBase64, editFlashcard } from "@/app/utils/firebase";
import { ActionIcon, Button, Divider, FileButton, Flex, Grid, Group, Select, Space, Stack, Text, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

type EditFlashCardFormType = {
  flashcardSet: FlashcardSet;
};

export const EditFlashCardForm = ({ flashcardSet }: EditFlashCardFormType) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [prevFlashcardSet, setPrevFlashcardSet] = useState<FlashcardSet>(flashcardSet);

  const form = useForm<EditFlashCardType>({
    initialValues: {
      views: flashcardSet.views ?? [],
      visibility: flashcardSet.visibility ?? Visibility.Private,
    },
  });

  const onSubmit = (values: typeof form.values) => {
    if (!session) {
      return;
    }
    setLoading(true);

    const editedFlashcard: EditFlashCardType = {
      views: values.views,
      visibility: values.visibility,
    };

    editFlashcard(session.user, prevFlashcardSet, editedFlashcard)
      .then((newViews) => {
        notifications.show({
          title: "Settet er oppdatert",
          message: "",
          color: "green",
        });
        setPrevFlashcardSet({ ...prevFlashcardSet, views: newViews, visibility: editedFlashcard.visibility });
        form.setInitialValues(editedFlashcard);
        form.reset();
      })
      .catch((error) => {
        notifications.show({
          title: "Noe gikk galt",
          message: error.message,
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOnChangeAddImage = async (file: File | null, index: number, view: EditFlashcardView) => {
    if (file) {
      const imageBase64 = (await ConvertToBase64(file)) as string;
      form.setFieldValue(`views.${index}.image`, imageBase64);
      view.image = imageBase64;
    } else {
      form.setFieldValue(`views.${index}.image`, undefined);
      view.image = undefined;
    }
  };

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
      <Stack>
        <Select label="Sett synlighet" placeholder="Rediger synlighet" data={Object.values(Visibility)} {...form.getInputProps("visibility")} maw={150} />

        <Divider />

        <Stack gap="xl">
          {form.values.views.map((view, index) => (
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
                <Space h={10} />
                {view.image && (
                  <Group>
                    Bilde: <Image src={view.image} alt="Bilde" height={50} width={200} />
                  </Group>
                )}
                <Space h={10} />
                <Group align="center">
                  <FileButton
                    onChange={(file) => {
                      handleOnChangeAddImage(file, index, view);
                    }}
                    accept="image/png, image/jpeg"
                  >
                    {(props) => (
                      <Button {...props} color="lime.4" variant="filled">
                        {form.getInputProps(`views.${index}.image`) && (
                          <>{view.image ? "endre bilde" : "Valgt bilde: " + (form.getInputProps(`views.${index}.image`).value?.name || "ingen valgt bilde")}</>
                        )}
                      </Button>
                    )}
                  </FileButton>
                </Group>
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
                  <ActionIcon
                    onClick={() =>
                      form.setFieldValue(
                        "views",
                        form.values.views.filter((_, i) => i !== index)
                      )
                    }
                    color="red"
                  >
                    <IconX stroke={1.5} />
                  </ActionIcon>
                </Flex>
              </Grid.Col>
            </Grid>
          ))}
        </Stack>
        <Group justify="center">
          <Button onClick={() => form.setFieldValue("views", [...form.values.views, { front: "", back: "" }])}>Legg til nytt kort</Button>
        </Group>

        <Group justify="flex-end" mt="md">
          <Button onClick={() => form.reset()} color="red" disabled={!form.isDirty()}>
            Reset
          </Button>
          <Button type="submit" disabled={!form.isDirty()} loading={loading}>
            Lagre redigert sett
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
