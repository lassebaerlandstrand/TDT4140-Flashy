import { ShallowFlashcardSet } from "@/app/types/flashcard";
import classes from "@/components/tables/FlashiesTable.module.css";
import { ScrollArea, Table, UnstyledButton } from "@mantine/core";
import cx from "clsx";
import Link from "next/link";
import { useState } from "react";

type FlashiesTableProps = {
  flashies: ShallowFlashcardSet[];
};

export function FlashiesTable({ flashies }: FlashiesTableProps) {
  const [scrolled, setScrolled] = useState(false);

  const rows = flashies.map((flashy) => (
    <Table.Tr key={flashy.id}>
      <Table.Td>
        <UnstyledButton component={Link} href={`carousel/${flashy.title}`}>
          {flashy.title}
        </UnstyledButton>
      </Table.Td>
      <Table.Td>{flashy.creator ? flashy.creator.name : "Slettet bruker"}</Table.Td>
      <Table.Td>{flashy.numOfLikes}</Table.Td>
      <Table.Td>{flashy.numViews}</Table.Td>
      <Table.Td>
        <UnstyledButton component={Link} href={`carousel/${flashy.title}`}>
          Go to ↗️
        </UnstyledButton>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table miw={700}>
        <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>Creator 👨‍🎨</Table.Th>
            <Table.Th>Likes ❤️</Table.Th>
            <Table.Th>Views 👀</Table.Th>
            <Table.Th>Link 🔗</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
