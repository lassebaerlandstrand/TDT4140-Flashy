import { FlashcardSet, FlashcardView } from "@/app/types/flashcard"
import { User } from "next-auth"

export const dummyFlashcard: FlashcardSet = {
  id: "1",
  title: "dummy",
  numViews: 2,
  numOfLikes: 2,
  numOfFavorites: 4,
  numOfComments: 3,
  createdAt: new Date(),
  popularityScore: 2,
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
  id: 'abcd',
  email: "test@test.com",
  name: "Ola Nordmann Admin",
  image: "",
  role: "admin",
  age: 20,
  username: "olanordmannadmin",
}

export const dummyViews: FlashcardView[] = [
  {
    id: "1",
    front: "Front1",
    back: "Back1",
  },
  {
    id: "2",
    front: "Front2",
    back: "Back2",
  },
  {
    id: "3",
    front: "Front3",
    back: "Back3",
  },
]