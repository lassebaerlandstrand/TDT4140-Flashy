"use client";

import { CreateFlashCardType, Visibility } from "@/app/types/flashcard";
import { createNewFlashcard } from "@/app/utils/firebase";
import { ActionIcon, Button, Divider, FileButton, Flex, Grid, Group, Select, Space, Stack, Text, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconPhoto, IconX } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const regexLettersAndNumbers = new RegExp("^[a-zA-Z0-9æøåÆØÅ\\s]+$");

export const CreateFlashCardForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const form = useForm<Omit<CreateFlashCardType, "creator">>({
    initialValues: {
      title: "",
      views: [],
      visibility: Visibility.Public,
      createdAt: new Date(),
      image: undefined,
    },

    validate: {
      title: (value) => {
        if (value.length < 3) return "Navnet må være minst 3 tegn";
        if (!regexLettersAndNumbers.test(value)) return "Navnet kan bare inneholde bokstaver og tall";
      },
    },
  });

  const onSubmit = (values: typeof form.values) => {
    if (!session) {
      return;
    }
    setLoading(true);

    const emptyInputs = values.views.some((view) => view.front.trim() === "" || view.back.trim() === "");

    if (emptyInputs) {
      notifications.show({
        title: "Kan ikke lagre settet",
        message: "Alle kort må ha en forside og en bakside før settet kan lagres",
        color: "red",
      });
      setLoading(false);
      return;
    }
    if (values.views.length === 0) {
      notifications.show({
        title: "Kan ikke lagre settet",
        message: "Settet må ha minst ett kort før det kan lagres",
        color: "red",
      });
      setLoading(false);
      return;
    }

    const flashcardSet: CreateFlashCardType = {
      creator: session.user,
      title: values.title,
      views: values.views,
      visibility: values.visibility,
      createdAt: new Date(),
      image: values.image,
    };

    createNewFlashcard(flashcardSet)
      .then(() => {
        notifications.show({
          title: "Settet er laget",
          message: "Synligheten på settet er " + values.visibility.toLowerCase() + " og det er lagt til i din profil",
          color: "green",
          onClick: () => {
            router.push("/carousel/" + flashcardSet.title);
            notifications.clean();
          },
          style: { cursor: "pointer" },
        });
        form.reset();
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: "Slett settet",
      centered: true,
      children: <Text size="sm">Sikker på at du vil slette settet? Alle kortene på dette settet vil da forsvinne for godt.</Text>,
      labels: { confirm: "Slett settet", cancel: "Ikke slett" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => form.reset(),
    });
  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
      <Stack>
        <Group justify="space-between">
          <TextInput withAsterisk label="Navn på sett" placeholder="Skriv inn navn på settet" {...form.getInputProps("title")} w={250} />

          <Select label="Sett synlighet" placeholder="Rediger synlighet" data={Object.values(Visibility)} {...form.getInputProps("visibility")} maw={150} />
        </Group>
        <Group justify="center">
          <FileButton onChange={(file) => form.setFieldValue("image", file || undefined)} accept="image/png, image/jpeg">
            {(props) => <Button {...props}>Last opp bilde</Button>}
          </FileButton>
        </Group>
        {form.getInputProps("image") && (
          <Text size="sm" ta="center" mt="sm">
            Picked file: {form.getInputProps("image").value?.name || "No file picked"}
          </Text>
        )}
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
                <Space h={10} />
                <Group>
                  <FileButton onChange={(file) => form.setFieldValue(`views.${index}.image`, file || undefined)} accept="image/png, image/jpeg">
                    {(props) => (
                      <ActionIcon {...props} color="lime.4" variant="filled">
                        <IconPhoto size={50} />
                      </ActionIcon>
                    )}
                  </FileButton>
                  {form.getInputProps(`views.${index}.image`) && <>Valgt bilde: {form.getInputProps(`views.${index}.image`).value?.name || "ingen valgt bilde"}</>}
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
        <Group justify="space-between">
          <Button type="button" onClick={openDeleteModal} disabled={loading} color="red">
            Slett settet
          </Button>
          <Button type="submit" loading={loading}>
            Lag sett
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
