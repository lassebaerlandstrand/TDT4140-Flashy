import { FlashcardSet } from "@/app/types/flashcard";
import { setIncrementFlashcardViews } from "@/app/utils/firebase";
import classes from "@/components/articleView/ArticleCardsGrid.module.css";
import { AspectRatio, Card, Container, Divider, Group, Space, Stack, Text, UnstyledButton } from "@mantine/core";
import { IconBrandHipchat, IconEyeUp, IconThumbUp } from "@tabler/icons-react";
import { Session } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";

type ArticleCardProps = {
  flashcard: FlashcardSet;
  user: Session["user"];
};

export function ArticleCard({ flashcard }: ArticleCardProps) {
  const router = useRouter();

  const handleClickCarousel = () => {
    setIncrementFlashcardViews(flashcard);
    router.push("/carousel/" + flashcard.title);
  };

  return (
    <Card key={flashcard.title} p="md" shadow="sm" radius="md" component="a" className={classes.card}>
      <UnstyledButton onClick={() => handleClickCarousel()}>
        <AspectRatio ratio={1920 / 1080}>
          <Image
            style={{ borderRadius: 5 }}
            src={flashcard.coverImage ?? "https://picsum.photos/300?grayscale"}
            alt="Flashy logo"
            width={200}
            height={100}
            priority={true}
          />
        </AspectRatio>
      </UnstyledButton>
      <Space h={10} />
      <Stack align="left" w={"100%"}>
        <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
          👨‍🎨 {flashcard.creator?.name ?? "slettet bruker"}
          <Text tt="capitalize" fw={600} size="xl">
            {flashcard.title}
          </Text>
        </Text>
        <Group justify="space-between" w={"100%"}>
          <Container style={{ display: "flex", alignItems: "center" }}>
            <Text size="xl" fw={700} style={{ paddingRight: 2 }}>
              {flashcard.numOfLikes ?? 0}
            </Text>
            <IconThumbUp />
          </Container>
          <Divider orientation="vertical" />
          <Container style={{ display: "flex", alignItems: "center" }}>
            <Text size="xl" fw={700} style={{ paddingRight: 2 }}>
              {flashcard.numViews ?? 0}
            </Text>
            <IconEyeUp />
          </Container>
          <Divider orientation="vertical" />
          <Container style={{ display: "flex", alignItems: "center" }}>
            <Text size="xl" fw={700} style={{ paddingRight: 2 }}>
              {flashcard.numOfComments ?? 0}
            </Text>
            <IconBrandHipchat />
          </Container>
        </Group>
      </Stack>
    </Card>
  );
}
