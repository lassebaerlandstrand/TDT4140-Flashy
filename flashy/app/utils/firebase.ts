import { firestore } from "@/lib/firestore";
import { DocumentReference, collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, limit, query, updateDoc, where } from "@firebase/firestore";
import { ComboboxItem } from "@mantine/core";
import { Session } from "next-auth";
import { convertDocumentRefToType, converter } from "./converter";

export async function getAllUsers(): Promise<User[]> {
  const userCollection = collection(firestore, "users").withConverter(converter<User>());
  const userDocs = await getDocs(userCollection);
  return userDocs.docs.map(doc => doc.data());
}

async function getUserByEmail(email: string): Promise<User | null> {
  const usersRef = collection(firestore, "users").withConverter(converter<User>());
  const querySelelction = query(usersRef, where("email", "==", email), limit(1));
  const querySnapshot = await getDocs(querySelelction);

  if (querySnapshot.docs.length != 0)
    return querySnapshot.docs[0].data();
  return null;
}

async function getViews(flashcardDocument: DocumentReference) {
  const viewsCollection = collection(flashcardDocument, "views").withConverter(converter<FlashcardView>());
  const viewsDocs = await getDocs(viewsCollection);
  return viewsDocs.docs.map((doc) => doc.data());
}

async function userHasLikedFlashcard(flashcardDocument: DocumentReference, currentUserId: User["id"]): Promise<boolean> {
  const likesCollection = collection(flashcardDocument, "likes");
  const queryLikes = query(likesCollection, where("likedBy", "==", `users/${currentUserId}`), limit(1));
  const queryDocs = await getDocs(queryLikes);
  return queryDocs.docs.length != 0;
}

async function getNumberOfLikes(flashcardDocument: DocumentReference): Promise<number> {
  const likesCollection = collection(flashcardDocument, "likes");
  const numOfLikes = await getCountFromServer(likesCollection);
  return numOfLikes.data().count;
}

async function getComments(flashcardDocument: DocumentReference): Promise<FlashcardComment[]> {
  const commentsCollection = collection(flashcardDocument, "comments").withConverter(converter<FlashcardComment>());
  const commentsDocs = await getDocs(commentsCollection);
  return commentsDocs.docs.map((doc) => doc.data());
}

async function getFlaggedCards(flashcardDocument: DocumentReference, currentUserId: User["id"]): Promise<FlashcardFlagged> {
  const usersFlagged = collection(flashcardDocument, "usersFlagged");
  const flaggedDoc = doc(usersFlagged, currentUserId).withConverter(converter<FlashcardFlagged>());
  const flagged = await getDoc(flaggedDoc);

  if (flagged.exists()) {
    return flagged.data();
  }
  return { cardsFlagged: [] };
}

export async function getFlashcardSet(flashcardId: string, currentUserId: User["id"]) {
  const flashcardCollection = collection(firestore, "flashies");
  const flashcardDocument = doc(flashcardCollection, flashcardId);
  const flashcardDoc = await getDoc(flashcardDocument);

  const flashcardData = flashcardDoc.data();

  if (flashcardData == null)
    throw new Error("Flashcard not found");

  const creator = await convertDocumentRefToType<User>(flashcardData.creator); // Could convert to username in database to save on read operations
  const views = await getViews(flashcardDocument);
  const userHasLiked = await userHasLikedFlashcard(flashcardDocument, currentUserId);
  const numOfLikes = await getNumberOfLikes(flashcardDocument);
  const comments = await getComments(flashcardDocument);
  const flagged = await getFlaggedCards(flashcardDocument, currentUserId);


  const flashcard: FlashcardSet = {
    id: flashcardDoc.id,
    creator: creator,
    title: flashcardData.title,
    numViews: flashcardData.numViews,
    numOfLikes: numOfLikes,
    userHasLiked: userHasLiked,
    comments: comments,
    flagged: flagged,
    views: views,
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
