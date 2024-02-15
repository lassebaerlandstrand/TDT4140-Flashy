type FlashcardSet = {
    id: string;
    creator?: User; // Could possibly set this to string to save on read operations
    title: string;
    numViews: number;
    numOfLikes: number;
    userHasLiked: boolean;
    comments: FlashcardComment[];
    flagged: FlashcardFlagged;
    views: FlashcardView[];
}

type FlashcardFlagged = {
    cardsFlagged: string[];
}

type FlashcardComment = {
    commentedBy: string; // Set this to string to save on read operations
    content: string;
}

type FlashcardView = {
    front: string;
    back: string;
}