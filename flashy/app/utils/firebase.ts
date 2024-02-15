import { firestore } from "@/lib/firestore";
import { DocumentReference, collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, limit, query, updateDoc, where } from "@firebase/firestore";
import { ComboboxItem } from "@mantine/core";
import { Session } from "next-auth";
import { convertDocumentRefToType, converter } from "./converter";

/*
const usersRef = collection(firestore, "users").withConverter(converter<User>());
const queryA = query(usersRef, where("email", "==", "lassebaerlandstrand@gmail.com"));
const querySnapshot = await getDocs(queryA);
const userDoc = querySnapshot.docs[0].data();

 */

export async function getAllUsers(): Promise<User[]> {
  const userCollection = collection(firestore, "users");
  const docs = await getDocs(userCollection);

  const users: User[] = [];

  docs.forEach((doc) => {
    const docData = doc.data();
    users.push({
      id: doc.id,
      email: docData.email,
      name: docData.name,
      image: docData.image,
      emailVerified: docData.emailVerified,
      role: docData.role,
    });
  });

  return users;
}

// export async function getAllFlashcards(): Promise<Flashcard[]> {
//     const flashcardCollection = collection(firestore, "flashies");
//     const docs = await getDocs(flashcardCollection);

//     const users = await getAllUsers();
//     const flashcards: Flashcard[] = [];

//     docs.forEach(doc => {
//         const docData = doc.data();

//         const creator = users.find(user => user.email == docData.creatorEmail);
//         flashcards.push({
//             creator: creator,
//             title: docData.title,
//             numViews: docData.numViews,
//         });
//     })

//     return flashcards;
// }

// export async function getFlashcardsByEmail(email: string): Promise<Flashcard[]> {
//     const flashcardCollection = collection(firestore, "flashies");
//     const docs = await getDocs(flashcardCollection);

//     const users = await getAllUsers();
//     const user = users.find(user => user.email == email);

//     if (user == null){
//         throw new Error("There is no user registered with that email");
//     }

//     const flashcards: Flashcard[] = [];

//     docs.forEach(doc => {
//         const docData = doc.data();

//         if (docData.creatorEmail == email){
//             flashcards.push({
//                 creator: user,
//                 title: docData.title,
//                 numViews: docData.numViews,
//             });
//         }
//     })

//     return flashcards;
// }

async function getUserByEmail(email: string): Promise<User | null> {
  const usersRef = collection(firestore, "users").withConverter(converter<User>());
  const queryA = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(queryA);
  let user = null;
  if (querySnapshot.docs.length != 0) {
    user = querySnapshot.docs[0].data();
  }
  return user;
}

async function getViews(flashcardDocument: DocumentReference) {
  const viewsCollection = collection(flashcardDocument, "views").withConverter(converter<FlashcardView>());
  const viewsDocs = await getDocs(viewsCollection);
  return viewsDocs.docs.map((doc) => doc.data());
}

async function userHasLikedFlashcard(flashcardDocument: DocumentReference, currentUser: User): Promise<boolean> {
  const likesCollection = collection(flashcardDocument, "likes");
  const queryLikes = query(likesCollection, where("likedBy", "==", `users/${currentUser.id}`), limit(1));
  const queryDocs = await getDocs(queryLikes);
  return queryDocs.docs.length != 0;
}

// Cost 1 read operation per 1000 likes
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

async function getFlaggedCards(flashcardDocument: DocumentReference, currentUser: User): Promise<FlashcardFlagged> {
  const usersFlagged = collection(flashcardDocument, "usersFlagged");
  const flaggedDoc = doc(usersFlagged, currentUser.id).withConverter(converter<FlashcardFlagged>());
  const flagged = await getDoc(flaggedDoc);

  if (flagged.exists()) {
    return flagged.data();
  }
  return { cardsFlagged: [] };
}

export async function getFlashcardSet(flashcardId: string, currentUser: User) {
  const flashcardCollection = collection(firestore, "flashies");
  const flashcardDocument = doc(flashcardCollection, flashcardId);
  const flashcardDoc = await getDoc(flashcardDocument);

  const flashcardData = flashcardDoc.data();

  if (flashcardData == null) {
    throw new Error("Flashcard not found");
  }

  const creator = await convertDocumentRefToType<User>(flashcardData.creator); // Could convert to username in database to save on read operations

  const views = await getViews(flashcardDocument);
  const userHasLiked = await userHasLikedFlashcard(flashcardDocument, currentUser);
  const numOfLikes = await getNumberOfLikes(flashcardDocument);
  const comments = await getComments(flashcardDocument);
  const flagged = await getFlaggedCards(flashcardDocument, currentUser);


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
  console.log(flashcard);
  return flashcard;
}

// export async function getFlashcardSet(flashcardId: string, currentUser: User) {
//   const flashcardCollection = collection(firestore, "flashies");
//   const flashcardDocument = doc(flashcardCollection, flashcardId);
//   const flashcardDoc = await getDoc(flashcardDocument);

//   const tempFlashcard = flashcardDoc.data();

//   if (tempFlashcard == null) {
//     throw new Error("Flashcard not found");
//   }

//   const creator = await convertDocumentRefToType<User>(tempFlashcard.creator);

//   // Get all flagged cards by the tempFlashcard.creator.
//   const usersFlagged = collection(flashcardDocument, "usersFlagged");
//   const flaggedDoc = doc(usersFlagged, await getIdForDocumentRef(tempFlashcard.creator));
//   const flagged = await getDoc(flaggedDoc);
//   const flaggedData = flagged.data();
//   const flaggedArray = flaggedData?.cardsFlagged;
//   // flaggedArray.forEach((card: String) => {
//   //   console.log("Flagged card:", card);
//   // });

//   const likesCollection = collection(flashcardDocument, "likes");
//   const likesDoc = await getDocs(likesCollection);

//   const commentsCollection = collection(flashcardDocument, "comments");
//   const commentsDoc = await getDocs(commentsCollection);

//   // console.log(tempFlashcard.creator);

//   const views = await getViews(flashcardDocument);

//   // const likes = await Promise.all(
//   //   likesDoc.docs.map(async (doc) => {
//   //     return {
//   //       likedBy: await convertDocumentRefToType<User>(doc.data().likedBy),
//   //     };
//   //   })
//   // );

//   const likes = await getLikes(flashcardDocument);
//   console.log("Likes", likes);

//   const comments = await Promise.all(
//     commentsDoc.docs.map(async (doc) => {
//       return {
//         commentedBy: await convertDocumentRefToType<User>(doc.data().commentedBy),
//         content: doc.data().content,
//       };
//     })
//   );

//   // console.log("FlaggedDoc:", flaggedDoc.docs.map((doc) => doc.data()));
//   // const flagged = await Promise.all(flaggedDoc.docs.map(async (doc) => {
//   //   return {

//   //     flaggedBy: await convertDocumentRefToType<User>(doc.data().users.flaggedBy),
//   //     cardsFlagged: doc.data().users.flaggedBy,
//   //   };
//   // }));

//   // console.log("Likes:", likes);
//   // console.log("Comments:", comments);

//   const flashcard: FlashcardSet = {
//     creator: creator,
//     title: tempFlashcard.title,
//     numViews: tempFlashcard.numViews,
//     likes: likes,
//     comments: comments,
//     flagged: [],
//     views: views,
//   };
//   console.log(flashcard);
//   return flashcard;
// }

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
