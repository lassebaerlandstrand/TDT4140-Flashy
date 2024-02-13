type FlashcardSet = {
    creator?: User;
    title: string;
    numViews: number;
    likes: FlashcardLike[];
    comments: FlashcardComment[];
    flagged: FlashcardFlagged[];
}

type FlashcardFlagged = {
    flaggedBy: User;
}

type FlashcardComment = {
    commentedBy: User;
    content: string;
}

type FlashcardLike = {
    likedBy: User;
}