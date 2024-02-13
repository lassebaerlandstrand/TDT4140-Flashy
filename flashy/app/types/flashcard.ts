type FlashcardSet = {
    creator?: User;
    title: string;
    numViews: number;
    likes: FlashcardLike[];
    comments: FlashcardComment[];
    flagged: FlashcardFlagged[];
    views: FlashcardView[];
}

type FlashcardFlagged = {
    cardsFlagged: string[];
}

type FlashcardComment = {
    commentedBy: User | undefined;
    content: string;
}

type FlashcardLike = {
    likedBy: User | undefined;
}

type FlashcardView = {
    front: string;
    back: string;
}