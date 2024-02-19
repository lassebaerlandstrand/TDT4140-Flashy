import classes from "@/app/css/not-found.module.css";
import {
  Button,
  Container,
  Image,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container className={classes.root}>
      <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
        <Container>
          <Title>Something is not right...</Title>
          <Text c="dimmed" size="lg">
            Page you are trying to open does not exist. You may have mistyped
            the address, or the page has been moved to another URL. If you think
            this is an error contact support.
          </Text>
          <Button
            variant="outline"
            size="md"
            mt="xl"
            className={classes.control}
            component={Link}
            href="/"
          >
            Get back to home page
          </Button>
        </Container>
        <Image src="404.png" alt="404" />
      </SimpleGrid>
    </Container>
  );
}
