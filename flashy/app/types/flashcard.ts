import { User } from "./user";

export enum Visibility {
    Public = 'Offentlig',
    Private = 'Privat',
}

export type FlashcardSet = {
    id: string;
    creator: User | undefined;
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

// Used to save on read operations
export type ShallowFlashcardSet = {
    id: string;
    creator: User | undefined;
    title: string;
    numViews: number;
    numOfLikes: number;
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

export type CreateViewType = Pick<FlashcardView, "front" | "back">;

export type EditFlashCardType = {
    views: EditFlashcardView[];
    visibility: Visibility;
}

export type EditFlashcardView = Pick<FlashcardView, "front" | "back"> & {
    id?: string;
};