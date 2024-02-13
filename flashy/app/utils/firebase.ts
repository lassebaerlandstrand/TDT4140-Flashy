import { firestore } from "@/lib/firestore";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import { ComboboxItem } from "@mantine/core";
import { Session } from "next-auth";
import { converter, convertDocumentRefToType, getIdForDocumentRef } from "./converter";
import { get } from "http";

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
  const usersRef = collection(firestore, "users").withConverter(
    converter<User>()
  );
  const queryA = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(queryA);
  let user = null;
  if (querySnapshot.docs.length != 0) {
    user = querySnapshot.docs[0].data();
  }
  return user;
}

export async function getFlashcardSet(flashcardId: string) {
  const flashcardCollection = collection(firestore, "flashies");
  const flashcardDocument = doc(flashcardCollection, flashcardId);
  const flashcardDoc = await getDocs(flashcardCollection);

  if (flashcardDoc.docs.length == 0) {
    throw new Error("No flashcard with that id");
  }
  const tempFlashcard = flashcardDoc.docs[0].data();
  const creator = await convertDocumentRefToType<User>(tempFlashcard.creator);

  const viewsCollection = collection(flashcardDocument, "views").withConverter(converter<FlashcardView>());
  const viewsDoc = await getDocs(viewsCollection);

  const usersFlagged = collection(flashcardDocument, "usersFlagged");
  const flaggedDoc = doc(usersFlagged, await getIdForDocumentRef(tempFlashcard.creator));
  const flagged = (await getDoc(flaggedDoc)); // TODO: This needs to be converted

  const likesCollection = collection(flashcardDocument, "likes");
  const likesDoc = await getDocs(likesCollection);

  const commentsCollection = collection(flashcardDocument, "comments");
  const commentsDoc = await getDocs(commentsCollection);


  console.log(tempFlashcard.creator);


  const views = viewsDoc.docs.map((doc) => doc.data());

  const likes = await Promise.all(likesDoc.docs.map(async (doc) => {
    return {
      likedBy: await convertDocumentRefToType<User>(doc.data().likedBy),
    };
  }));

  const comments = await Promise.all(commentsDoc.docs.map(async (doc) => {
    return {
      commentedBy: await convertDocumentRefToType<User>(doc.data().commentedBy),
      content: doc.data().content,
    };
  }));

  console.log("FlaggedDoc:", flaggedDoc.docs.map((doc) => doc.data()));
  // const flagged = await Promise.all(flaggedDoc.docs.map(async (doc) => {
  //   return {

  //     flaggedBy: await convertDocumentRefToType<User>(doc.data().users.flaggedBy),
  //     cardsFlagged: doc.data().users.flaggedBy,
  //   };
  // }));

  console.log("Likes:", likes);
  console.log("Comments:", comments);
  // console.log("Flagged:", flagged);


  const flashcard: FlashcardSet = {
    creator: creator,
    title: tempFlashcard.title,
    numViews: tempFlashcard.numViews,
    likes: likes,
    comments: comments,
    flagged: [],
    views: views,
  };

  return flashcard;
}

export const deleteUser = async (
  actionUser: User | Session["user"],
  deleteUserEmail: string
) => {
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
