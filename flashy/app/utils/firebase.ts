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
import { CreateFlashCardType, EditFlashCardType, FlashcardComment, FlashcardSet, FlashcardView, Visibility } from "../types/flashcard";
import { User } from "../types/user";
import { convertDocumentRefToType, converter } from "./converter";

export async function getAllUsers(actionUser: User): Promise<User[]> {
  if (actionUser.role !== "admin") {
    throw new Error("Du har ikke tilgang til å se alle brukere");
  }

  const userCollection = collection(firestore, "users").withConverter(converter<User>());
  const userDocs = await getDocs(userCollection);
  return userDocs.docs.map((doc) => doc.data());
}

async function getViews(flashcardDocument: DocumentReference) {
  const viewsCollection = collection(flashcardDocument, "views");
  const viewsDocs = await getDocs(viewsCollection);

  return viewsDocs.docs.map((doc) => {
    return {
      id: doc.id,
      front: doc.data().front,
      back: doc.data().back,
      isCopy: doc.data().isCopy,
    };
  });
}

export async function getMyFlashies(user: User): Promise<FlashcardSet[]> {
  const flashcardCollection = collection(firestore, "flashies");
  const userDoc = doc(firestore, "users", user.id)
  const querySelection = query(flashcardCollection, where("creator", "==", userDoc));
  const flashcardDocs = await getDocs(querySelection);
  const allFlashcardSets = Promise.all(flashcardDocs.docs.map(async (doc) => {
    try {
      return {
        id: doc.id,
        creator: await convertDocumentRefToType<User>(doc.data().creator),
        title: doc.data().title,
        numViews: doc.data().numViews,
        numOfLikes: await getNumberOfLikes(doc.ref),
        visibility: doc.data().isPublic ? Visibility.Public : Visibility.Private,
        createdAt: doc.data().createdAt.toDate(),
      }
    } catch (e) {
      console.log(`[DocId: ${doc.id}]`, e);
    }
    return null;
  }));

  return (await allFlashcardSets).filter((flashcard) => flashcard != null) as FlashcardSet[];
}




export async function getAllPublicFlashCardSets(): Promise<(FlashcardSet)[]> {
  const flashcardCollection = collection(firestore, "flashies");
  const querySelection = query(flashcardCollection, where("isPublic", "==", true));
  const flashcardDocs = await getDocs(querySelection);

  const allFlashcardSets = Promise.all(
    flashcardDocs.docs.map(async (doc) => {
      try {
        const flashcardSet = {
          id: doc.id,
          creator: await convertDocumentRefToType<User>(doc.data().creator),
          title: doc.data().title,
          numViews: doc.data().numViews,
          numOfLikes: await getNumberOfLikes(doc.ref),
          visibility: doc.data().isPublic ? Visibility.Public : Visibility.Private,
          createdAt: doc.data().createdAt.toDate(),
          coverImage: doc.data().image,
        };
        return flashcardSet;
      } catch (e) {
        console.log(`[DocId: ${doc.id}]`, e);
      }
      return null;
    })
  );

  return (await allFlashcardSets).filter((flashcard) => flashcard != null) as FlashcardSet[];
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

  const views = await getViews(flashcardDocument);
  const userHasLiked = await userHasLikedFlashcard(flashcardDocument, currentUserId);
  const numOfLikes = await getNumberOfLikes(flashcardDocument);
  const userHasFavorited = await getHasFavoritedFlashcard(flashcardDocument, currentUserId);
  const comments = await getComments(flashcardDocument);
  const visibility = flashcardData.isPublic ? Visibility.Public : Visibility.Private;

  try {
    const flashcard: FlashcardSet = {
      id: flashcardDoc.id,
      creator: creator,
      title: flashcardData.title,
      numViews: flashcardData.numViews,
      numOfLikes: numOfLikes,
      userHasLiked: userHasLiked,
      userHasFavorited: userHasFavorited,
      comments: comments,
      views: views,
      visibility: visibility,
      createdAt: flashcardData.createdAt.toDate(),
    };

    return flashcard;

  } catch (e) {
    console.log(`[DocId: ${flashcardDoc.id}]`, e);
  }

  return null;

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
  updateId: string,
  newRole: ComboboxItem | null
) => {
  const userDoc = doc(firestore, "users", updateId);

  if (actionUser?.role !== "admin") {
    throw new Error("Du har ikke tilgang til å endre roller");
  }

  if (newRole == null) {
    throw new Error("Ugyldig rolle");
  }

  updateDoc(userDoc, {
    role: newRole.value,
  });
};


export const setUpdateFlashySetVisibility = async (
  actionUser: User,
  flashy: FlashcardSet,
  newVisibility: Visibility
) => {
  if (flashy.creator?.id == actionUser.id) {
    const flashyDoc = doc(firestore, "flashies", flashy.id)
    updateDoc(flashyDoc, {
      isPublic: newVisibility === Visibility.Public,
    })
  }
}

function ConvertToBase64(image: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    console.log(reader.result);
  });
}

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
    createdAt: flashcard.createdAt,
    image: flashcard.image ? await ConvertToBase64(flashcard.image) : "",
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

export async function editFlashcard(actionUser: User, flashcard: FlashcardSet, updatedFlashcard: EditFlashCardType) {
  if (actionUser.id !== flashcard.creator?.id && actionUser.role !== "admin") {
    throw new Error("Du har ikke tilgang til å redigere dette settet");
  }

  const flashcardDoc = doc(firestore, "flashies", flashcard.id);
  const flashcardData = await getDoc(flashcardDoc);

  if (!flashcardData.exists()) {
    throw new Error("Fant ikke flashcard settet");
  }

  // Currently you can only edit the visibility or the views
  if (flashcard.visibility !== updatedFlashcard.visibility) {
    await updateDoc(flashcardDoc, {
      isPublic: updatedFlashcard.visibility === Visibility.Public,
    });
  }

  const viewsCollection = collection(flashcardDoc, "views");

  // Delete views
  const deletedViews = flashcard.views?.filter((view) => {
    return !updatedFlashcard.views.some((updatedView) => updatedView.id === view.id);
  });
  if (deletedViews) {
    await Promise.all(
      deletedViews.map(async (view) => {
        const viewDoc = doc(viewsCollection, view.id);
        await deleteDoc(viewDoc);
      })
    ).catch(() => {
      throw new Error("Feilet å slette kortene for settet")
    });
  }

  // In order to return the correct id's
  const resultingViews: FlashcardView[] = updatedFlashcard.views.filter((view) => {
    return flashcard.views?.some((flashcardView) => flashcardView.id === view.id);
  }) as FlashcardView[];

  // Add new views
  const newViews = updatedFlashcard.views.filter((view) => view.id == null);
  await Promise.all(
    newViews.map(async (view) => {
      const newView = await addDoc(viewsCollection, {
        front: view.front,
        back: view.back,
      });
      resultingViews.push({
        id: newView.id,
        front: view.front,
        back: view.back,
      });
    })
  ).catch(() => {
    throw new Error("Feilet å opprette kortene for settet");
  });

  // Update existing views
  const updatedViews = updatedFlashcard.views.filter((view) => {
    return flashcard.views?.some((flashcardView) => flashcardView.id === view.id);
  });
  await Promise.all(
    updatedViews.map(async (view) => {
      const viewDoc = doc(viewsCollection, view.id);
      await updateDoc(viewDoc, {
        front: view.front,
        back: view.back,
      });
    })
  ).catch(() => {
    throw new Error("Feilet å oppdatere kortene for settet");
  });

  return resultingViews;
}

export async function deleteFlashcard(actionUser: User, flashcard: FlashcardSet) {
  if (actionUser.id !== flashcard.creator?.id && actionUser.role !== "admin") {
    throw new Error("Du har ikke tilgang til å redigere dette settet");
  }

  // Delete outer document
  const flashcardDoc = doc(firestore, "flashies", flashcard.id);
  await deleteDoc(flashcardDoc);

  // Delete all inner document (there is no deep-delete in Firebase :/)
  const viewsCollection = collection(flashcardDoc, "views");
  const viewsDocs = await getDocs(viewsCollection);
  await Promise.all(viewsDocs.docs.map((doc) => deleteDoc(doc.ref)));

  const likesCollection = collection(flashcardDoc, "likes");
  const likesDocs = await getDocs(likesCollection);
  await Promise.all(likesDocs.docs.map((doc) => deleteDoc(doc.ref)));

  const commentsCollection = collection(flashcardDoc, "comments");
  const commentsDocs = await getDocs(commentsCollection);
  await Promise.all(commentsDocs.docs.map((doc) => deleteDoc(doc.ref)));

  const favoritesCollection = collection(flashcardDoc, "favorites");
  const favoritesDocs = await getDocs(favoritesCollection);
  await Promise.all(favoritesDocs.docs.map((doc) => deleteDoc(doc.ref)));
}

