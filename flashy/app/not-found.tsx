import {
  Image,
  Container,
  Title,
  Text,
  Button,
  SimpleGrid,
} from "@mantine/core";
import classes from "@/app/css/not-found.module.css";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container className={classes.root}>
      <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
        <div>
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
        </div>
        <Image src="404.png" alt="404" />
      </SimpleGrid>
    </Container>
  );
}
