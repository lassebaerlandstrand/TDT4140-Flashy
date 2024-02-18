import { firestore } from "@/lib/firestore";
import {
  DocumentReference,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from "@firebase/firestore";
import { ComboboxItem } from "@mantine/core";
import { Session } from "next-auth";
import { CreateFlashCardType, FlashcardComment, FlashcardFlagged, FlashcardSet, Visibility } from "../types/flashcard";
import { convertDocumentRefToType, converter } from "./converter";

export async function getAllUsers(): Promise<User[]> {
  const userCollection = collection(firestore, "users").withConverter(converter<User>());
  const userDocs = await getDocs(userCollection);
  return userDocs.docs.map((doc) => doc.data());
}

async function getUserByEmail(email: string): Promise<User | null> {
  const usersRef = collection(firestore, "users").withConverter(converter<User>());
  const querySelelction = query(usersRef, where("email", "==", email), limit(1));
  const querySnapshot = await getDocs(querySelelction);

  if (querySnapshot.docs.length != 0) return querySnapshot.docs[0].data();
  return null;
}

async function getViews(flashcardDocument: DocumentReference) {
  const viewsCollection = collection(flashcardDocument, "views");
  const viewsDocs = await getDocs(viewsCollection);

  return viewsDocs.docs.map((doc) => {
    return {
      id: doc.id,
      front: doc.data().front,
      back: doc.data().back,
    };
  });
}

export async function getAllPublicFlashCardSets(): Promise<FlashcardSet[]> {
  const flashcardCollection = collection(firestore, "flashies");
  const querySelection = query(flashcardCollection, where("isPublic", "==", true));
  const flashcardDocs = await getDocs(querySelection);
  return flashcardDocs.docs.map((doc) => doc.data()) as FlashcardSet[];
}

async function userHasLikedFlashcard(
  flashcardDocument: DocumentReference,
  currentUserId: User["id"]
): Promise<boolean> {
  const currentUserRef = doc(firestore, "users", currentUserId);
  const likesCollection = collection(flashcardDocument, "likes");
  const queryLikes = query(likesCollection, where("likedBy", "==", currentUserRef), limit(1));
  const queryDocs = await getDocs(queryLikes);
  return !queryDocs.empty;
}

async function getNumberOfLikes(flashcardDocument: DocumentReference): Promise<number> {
  const likesCollection = collection(flashcardDocument, "likes");
  const numOfLikes = await getCountFromServer(likesCollection);
  return numOfLikes.data().count;
}

async function getHasFavoritedFlashcard(
  flashcardDocument: DocumentReference,
  currentUserId: User["id"]
): Promise<boolean> {
  const currentUserRef = doc(firestore, "users", currentUserId);
  const favoritesCollection = collection(flashcardDocument, "favorites");
  const queryFavorites = query(favoritesCollection, where("favoritedBy", "==", currentUserRef), limit(1));
  const queryDocs = await getDocs(queryFavorites);
  return !queryDocs.empty;
}

async function getComments(flashcardDocument: DocumentReference): Promise<FlashcardComment[]> {
  const commentsCollection = collection(flashcardDocument, "comments");
  const commentsDocs = await getDocs(commentsCollection);

  const comments = await Promise.all(
    commentsDocs.docs.map(async (doc) => {
      return {
        commentedBy: await convertDocumentRefToType<User>(doc.data().commentedBy),
        content: doc.data().content,
      };
    })
  );

  return comments;
}

async function getFlaggedCards(
  flashcardDocument: DocumentReference,
  currentUserId: User["id"]
): Promise<FlashcardFlagged> {
  const usersFlagged = collection(flashcardDocument, "usersFlagged");
  const flaggedDoc = doc(usersFlagged, currentUserId).withConverter(converter<FlashcardFlagged>());
  const flagged = await getDoc(flaggedDoc);

  if (flagged.exists()) {
    return flagged.data();
  }
  return { cardsFlagged: [] };
}
/*
 Here are some ideas if we want to reduce the number of read operations further:
 - Convert creator field into a string
 - Convert commentedBy field into a string
 - Convert a subCollection into a field in the parent document
*/
export async function getFlashcardSet(flashcardId: string, currentUserId: User["id"]) {
  const flashcardCollection = collection(firestore, "flashies");
  const flashcardDocument = doc(flashcardCollection, flashcardId);
  const flashcardDoc = await getDoc(flashcardDocument);

  const flashcardData = flashcardDoc.data();

  if (flashcardData == null) throw new Error("Flashcard not found");

  const creator = await convertDocumentRefToType<User>(flashcardData.creator);

  if (creator == null) throw new Error("Creator not found");

  const views = await getViews(flashcardDocument);
  const userHasLiked = await userHasLikedFlashcard(flashcardDocument, currentUserId);
  const numOfLikes = await getNumberOfLikes(flashcardDocument);
  const userHasFavorited = await getHasFavoritedFlashcard(flashcardDocument, currentUserId);
  const comments = await getComments(flashcardDocument);
  const flagged = await getFlaggedCards(flashcardDocument, currentUserId);
  const visibility = flashcardData.isPublic ? Visibility.Public : Visibility.Private;

  const flashcard: FlashcardSet = {
    id: flashcardDoc.id,
    creator: creator,
    title: flashcardData.title,
    numViews: flashcardData.numViews,
    numOfLikes: numOfLikes,
    userHasLiked: userHasLiked,
    userHasFavorited: userHasFavorited,
    comments: comments,
    flagged: flagged,
    views: views,
    visibility: visibility,
  };

  return flashcard;
}

export const deleteUser = async (actionUser: User | Session["user"], deleteUserEmail: string) => {
  const userCollection = collection(firestore, "users");
  const docs = getDocs(userCollection);

  (await docs).forEach((doc) => {
    const docData = doc.data();
    if (docData.email == deleteUserEmail) {
      if (actionUser.role == "admin" || actionUser.email == deleteUserEmail) {
        // delete user
        deleteDoc(doc.ref);
      }
    }
  });
};

export const setUpdateUserRoles = async (
  actionUser: User | undefined,
  updateEmail: string,
  newRole: ComboboxItem | null
) => {
  const userCollection = collection(firestore, "users");
  const docs = getDocs(userCollection);
  if (actionUser && actionUser.role === "admin") {
    (await docs).forEach((doc) => {
      const docData = doc.data();
      if (docData.email == updateEmail) {
        updateDoc(doc.ref, {
          role: newRole?.value,
        });
      }
    });
  }
};


export async function createNewFlashcard(flashcard: CreateFlashCardType) {
  // Check if flashcard is available
  const flashcardDoc = doc(firestore, "flashies", flashcard.title);
  const flashcardData = await getDoc(flashcardDoc);
  if (flashcardData.exists()) {
    throw new Error("Navnet på settet er allerede i bruk");
  }

  // Create flashcard
  const docData = {
    creator: doc(firestore, "users", flashcard.creator.id),
    title: flashcard.title,
    numViews: 0,
    isPublic: flashcard.visibility === Visibility.Public,
  };

  await setDoc(flashcardDoc, docData).catch(() => {
    throw new Error("Feilet å opprette flashcard settet");
  });

  // Create views within flashcard
  const viewsCollection = collection(flashcardDoc, "views");

  await Promise.all(
    flashcard.views.map(async (view) => {
      return await addDoc(viewsCollection, view);
    })
  ).catch(() => {
    throw new Error("Feilet å opprette kortene for settet");
  });

}
