import { EditFlashCardType, FlashcardSet, Visibility } from "@/app/types/flashcard";
import { editFlashcard, getAllUsers } from "@/app/utils/firebase";
import { ActionIcon, Button, ComboboxData, Divider, Flex, Grid, Group, MultiSelect, Select, Stack, Text, Textarea, rem } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type EditFlashCardFormType = {
  flashcardSet: FlashcardSet;
};

const usersToComboBoxData = async () => {
  try {
    const users = await getAllUsers();
    return users.map((user) => ({
      value: user.id,
      label: user.name,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const EditFlashCardForm = ({ flashcardSet }: EditFlashCardFormType) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [prevFlashcardSet, setPrevFlashcardSet] = useState<FlashcardSet>(flashcardSet);
  const [userOptions, setUserOptions] = useState<ComboboxData | undefined>(undefined);

  useEffect(() => {
    const fetchUserOptions = async () => {
      try {
        const users = await usersToComboBoxData();
        setUserOptions(users);
      } catch (error) {
        console.error("Error fetching user options:", error);
        setUserOptions([]);
      }
    };

    fetchUserOptions();
  }, []);

  const form = useForm<EditFlashCardType>({
    initialValues: {
      views: flashcardSet.views ?? [],
      visibility: flashcardSet.visibility ?? Visibility.Private,
      coAuthors: flashcardSet.coAuthors?.map((coAuthor) => coAuthor.id) ?? [],
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
      coAuthors: values.coAuthors,
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

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values as EditFlashCardType))}>
      <Stack>
        <Select label="Sett synlighet" placeholder="Rediger synlighet" data={Object.values(Visibility)} {...form.getInputProps("visibility")} maw={150} />
        <Group>
          <MultiSelect
            label="Legge til medarbeidere?"
            placeholder="Søk etter brukere"
            data={userOptions || []}
            searchable
            clearable
            value={form.values.coAuthors}
            onChange={(value) => {
              form.setFieldValue("coAuthors", value);
            }}
            w="400"
            leftSection={<IconSearch style={{ width: rem(9), height: rem(9) }} stroke={1} />}
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
