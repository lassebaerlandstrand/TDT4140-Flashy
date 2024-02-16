type FlashcardSet = {
    id: string;
    creator: User;
    title: string;
    numViews: number;
    numOfLikes: number;
    userHasLiked: boolean;
    userHasFavorited: boolean;
    comments: FlashcardComment[];
    flagged: FlashcardFlagged;
    views: FlashcardView[];
}

type FlashcardFlagged = {
    cardsFlagged: string[];
}

type FlashcardComment = {
    commentedBy: User | undefined;
    content: string;
}

type FlashcardView = {
    front: string;
    back: string;
}