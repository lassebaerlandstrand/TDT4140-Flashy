type Flashcard = {
    creator?: User;
    title: string;
    views: number;
}

type FlashcardComment = {
    commentedBy: User;
    content: string;
}

type FlashcardLike = {
    likedBy: User;
}