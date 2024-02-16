import { User } from "./user";

export enum Visibility {
    Public = 'Offentlig',
    Private = 'Privat',
}

export type FlashcardSet = {
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
    visibility: Visibility;
}

export type FlashcardFlagged = {
    cardsFlagged: string[];
}

export type FlashcardComment = {
    commentedBy: User | undefined;
    content: string;
}

export type FlashcardView = {
    id: string;
    front: string;
    back: string;
}

export type CreateFlashCardType = {
    creator: User;
    title: string;
    views: CreateViewType[];
    visibility: Visibility;
}

export type CreateViewType = {
    front: string;
    back: string;
}