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
  increment,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where
} from "@firebase/firestore";
import { ComboboxItem } from "@mantine/core";
import { Session } from "next-auth";
import { CreateFlashCardType, CreateNewCommentType, EditFlashCardType, FlashcardComment, FlashcardSet, FlashcardView, Visibility } from "../types/flashcard";
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

function calculatePopularityScore(numOfViews: number, numOfFavorites: number, numOfLikes: number, numOfComments: number) {
  return numOfViews * 1 + numOfLikes * 3 + numOfComments * 2 + numOfFavorites * 4;
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
  const userDoc = doc(firestore, "users", user.id);
  const querySelection = query(flashcardCollection, where("creator", "==", userDoc));
  const flashcardDocs = await getDocs(querySelection);
  const allFlashcardSets = Promise.all(flashcardDocs.docs.map(async (doc) => {
    try {
      const { numOfFavorites, numOfLikes, numOfComments } = await getNumOfFavouritesLikesComments(doc.ref);
      const flashcardSet: FlashcardSet = {
        id: doc.id,
        creator: await convertDocumentRefToType<User>(doc.data().creator),
        title: doc.data().title,
        numViews: doc.data().numViews,
        numOfLikes: numOfLikes,
        numOfComments: numOfComments,
        numOfFavorites: numOfFavorites,
        visibility: doc.data().isPublic ? Visibility.Public : Visibility.Private,
        createdAt: doc.data().createdAt.toDate(),
        popularityScore: calculatePopularityScore(doc.data().numViews, numOfFavorites, numOfLikes, numOfComments),
        coverImage: doc.data().image,
      }
      return flashcardSet;
    } catch (e) {
      console.log(`[DocId: ${doc.id}]`, e);
    }
    return null;
  }));

  return (await allFlashcardSets).filter((flashcard) => flashcard != null) as FlashcardSet[];
}

export async function getAllPublicFlashCardSets(currentUser: Session["user"]): Promise<FlashcardSet[]> {
  const flashcardCollection = collection(firestore, "flashies");
  const querySelection = query(flashcardCollection, where("isPublic", "==", true));
  const flashcardDocs = await getDocs(querySelection);

  const allFlashcardSets = Promise.all(
    flashcardDocs.docs.map(async (doc) => {
      try {
        const { numOfFavorites, numOfLikes, numOfComments } = await getNumOfFavouritesLikesComments(doc.ref);
        const flashcardSet: FlashcardSet = {
          id: doc.id,
          userHasFavorited: await getHasFavoritedFlashcard(doc.ref, currentUser.id),
          creator: await convertDocumentRefToType<User>(doc.data().creator),
          title: doc.data().title,
          numViews: doc.data().numViews,
          numOfLikes: numOfLikes,
          numOfFavorites: numOfFavorites,
          numOfComments: numOfComments,
          visibility: doc.data().isPublic ? Visibility.Public : Visibility.Private,
          createdAt: doc.data().createdAt.toDate(),
          coverImage: doc.data().image,
          popularityScore: calculatePopularityScore(doc.data().numViews, numOfFavorites, numOfLikes, numOfComments),
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

export function setIncrementFlashcardViews(flashcard: FlashcardSet) {
  const flashcardCollection = collection(firestore, "flashies");
  const flashcardDocument = doc(flashcardCollection, flashcard.id);
  updateDoc(flashcardDocument, {
    numViews: increment(1),
  });
}

async function userHasLikedFlashcard(flashcardDocument: DocumentReference, currentUserId: User["id"]): Promise<boolean> {
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

type NumOfFavoritesLikesComments = {
  numOfFavorites: number;
  numOfLikes: number;
  numOfComments: number;
};

export async function getNumOfFavouritesLikesComments(flashcardDocument: DocumentReference): Promise<NumOfFavoritesLikesComments> {
  const favoritesCollection = collection(flashcardDocument, "favorites");
  const likesCollection = collection(flashcardDocument, "likes");
  const commentCollection = collection(flashcardDocument, "comments");
  const numOfFavorites = await getCountFromServer(favoritesCollection);
  const numOfLikes = await getCountFromServer(likesCollection);
  const numOfComments = await getCountFromServer(commentCollection);

  return { numOfFavorites: numOfFavorites.data().count, numOfLikes: numOfLikes.data().count, numOfComments: numOfComments.data().count };
}

export async function setFavoriteFlashcard(flashcardId: FlashcardSet["id"], currentUserId: User["id"]) {
  const flashcardCollection = collection(firestore, "flashies");
  const flashcardDocument = doc(flashcardCollection, flashcardId);
  const currentUserRef = doc(firestore, "users", currentUserId);
  const favoritesCollection = collection(flashcardDocument, "favorites");

  const queryFavorites = query(favoritesCollection, where("favoritedBy", "==", currentUserRef));
  const querySnapshot = await getDocs(queryFavorites);

  if (querySnapshot.empty) {
    await addDoc(favoritesCollection, { favoritedBy: currentUserRef });
  } else {
    console.log("Flashcard is already in favorites");
  }
}

export async function removeFavoriteFlashcard(flashcardId: FlashcardSet["id"], currentUserId: User["id"]) {
  const flashcardCollection = collection(firestore, "flashies");
  const flashcardDocument = doc(flashcardCollection, flashcardId);
  const currentUserRef = doc(firestore, "users", currentUserId);
  const favoritesCollection = collection(flashcardDocument, "favorites");
  const queryFavorites = query(favoritesCollection, where("favoritedBy", "==", currentUserRef));
  const queryDocs = await getDocs(queryFavorites);

  if (!queryDocs.empty) {
    queryDocs.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }
}

async function getHasFavoritedFlashcard(flashcardDocument: DocumentReference, currentUserId: User["id"]): Promise<boolean> {
  const currentUserRef = doc(firestore, "users", currentUserId);
  const favoritesCollection = collection(flashcardDocument, "favorites");
  const queryFavorites = query(favoritesCollection, where("favoritedBy", "==", currentUserRef), limit(1));
  const queryDocs = await getDocs(queryFavorites);
  return !queryDocs.empty;
}

async function getComments(flashcardDocument: DocumentReference): Promise<FlashcardComment[]> {
  const commentsCollection = collection(flashcardDocument, "comments");
  const sortedComments = query(commentsCollection, orderBy("createdAt", "desc"));
  const commentsDocs = await getDocs(sortedComments);

  const comments = await Promise.all(
    commentsDocs.docs.map(async (doc) => {
      try {
        const comment = {
          id: doc.id,
          commentedBy: await convertDocumentRefToType<User>(doc.data().commentedBy),
          content: doc.data().content,
          createdAt: doc.data().createdAt.toDate(),
        };
        return comment;
      } catch (e) {
        console.log(`[DocId: ${doc.id}]`, e);
      }
    })
  );

  return comments.filter((comment) => comment != null) as FlashcardComment[];
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
  const { numOfFavorites, numOfLikes, numOfComments } = await getNumOfFavouritesLikesComments(flashcardDocument);
  const userHasFavorited = await getHasFavoritedFlashcard(flashcardDocument, currentUserId);
  const comments = await getComments(flashcardDocument);
  const visibility = flashcardData.isPublic ? Visibility.Public : Visibility.Private;
  const popularityScore = calculatePopularityScore(flashcardData.numViews, numOfFavorites, numOfLikes, numOfComments);

  try {
    const flashcard: FlashcardSet = {
      id: flashcardDoc.id,
      creator: creator,
      title: flashcardData.title,
      numViews: flashcardData.numViews,
      numOfLikes: numOfLikes,
      numOfFavorites: numOfFavorites,
      numOfComments: numOfComments,
      userHasLiked: userHasLiked,
      userHasFavorited: userHasFavorited,
      comments: comments,
      views: views,
      visibility: visibility,
      createdAt: flashcardData.createdAt.toDate(),
      popularityScore: popularityScore,
      coverImage: flashcardData.image,
    };

    return flashcard;
  } catch (e) {
    console.log(`[DocId: ${flashcardDoc.id}]`, e);
  }

  return null;
}

export const toggleLike = async (currentUser: User, flashcard: FlashcardSet) => {
  const currentUserRef = doc(firestore, "users", currentUser.id);
  const flashcardDocument = doc(firestore, "flashies", flashcard.id);
  const likesCollection = collection(flashcardDocument, "likes");

  const queryLikes = query(likesCollection, where("likedBy", "==", currentUserRef), limit(1));
  const queryDocs = await getDocs(queryLikes);

  if (queryDocs.empty) {
    await addDoc(likesCollection, {
      likedBy: currentUserRef,
    });
    return true;
  } else {
    await deleteDoc(queryDocs.docs[0].ref);
    return false;
  }
};

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

export const setUpdateUserRoles = async (actionUser: User | undefined, updateId: string, newRole: ComboboxItem | null) => {
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

export const setUpdateFlashySetVisibility = async (actionUser: User, flashy: FlashcardSet, newVisibility: Visibility) => {
  if (flashy.creator?.id == actionUser.id) {
    const flashyDoc = doc(firestore, "flashies", flashy.id);
    updateDoc(flashyDoc, {
      isPublic: newVisibility === Visibility.Public,
    });
  }
};

function ConvertToBase64(image: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
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
      //const maybeFormattedView = {image: view.image ? await ConvertToBase64(view.image) : { front: view.front, back: view.back }}
      const formattedView = {
        image: view.image ? await ConvertToBase64(view.image) : "",
        front: view.front,
        back: view.back,
      };
      return await addDoc(viewsCollection, formattedView);
    })
  ).catch((e) => {
    throw new Error("Feilet å opprette kortene for settet\n"+e);
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
      throw new Error("Feilet å slette kortene for settet");
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

export async function deleteFlashcardSet(actionUser: User, flashcard: FlashcardSet) {
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

export const commentOnSet = async (flashcard: FlashcardSet, comment: CreateNewCommentType) => {
  const flashcardDoc = doc(firestore, "flashies", flashcard.id);
  const commentsCollection = collection(flashcardDoc, "comments");

  const data = {
    commentedBy: doc(firestore, "users", comment.commentedBy.id),
    content: comment.content,
    createdAt: new Date(),
  };

  await addDoc(commentsCollection, data);
};
