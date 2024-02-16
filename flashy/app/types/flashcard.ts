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
    id: string;
    front: string;
    back: string;
}

type CreateFlashCardType = {
    creator: User;
    title: string;
    views: CreateViewType[];
}

type CreateViewType = {
    front: string;
    back: string;
}