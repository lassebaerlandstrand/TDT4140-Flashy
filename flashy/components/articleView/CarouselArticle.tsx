import { FlashcardSet } from "@/app/types/flashcard";
import { User } from "@/app/types/user";
import { Carousel } from "@mantine/carousel";
import { ArticleCard } from "./ArticleCard";


type CarouselArticleProps = {
    flashcards: FlashcardSet[];
    user: User;
}

export const CarouselArticle = ({ flashcards, user }: CarouselArticleProps) => {

    const cards = flashcards.map((flashy) => {
        return <ArticleCard flashcard={flashy} key={flashy.title} user={user} />;
    });

    return (
        <Carousel align="start">
            {cards}
        </Carousel>
    );
}