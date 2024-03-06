import { FlashcardSet } from "@/app/types/flashcard"
import { User } from "next-auth"

export const dummyFlashcard: FlashcardSet = {
    id: "1",
    title: "dummy",
    numViews: 2,
    numOfLikes: 3,
    numOfFavorites: 4,
    createdAt: new Date(),
}

export const dummyUser: User = {
    id: 'abc',
    email: "test@test.com",
    name: "Ola Nordmann",
    image: "",
    role: "user",
    age: 20,
    username: "olanordmann",
}

export const dummyAdmin: User = {
    id: 'abc',
    email: "test@test.com",
    name: "Ola Nordmann Admin",
    image: "",
    role: "admin",
    age: 20,
    username: "olanordmannadmin",
}