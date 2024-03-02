import {
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  WithFieldValue,
  getDoc
} from "@firebase/firestore";
export const converter = <T extends { id: string;[x: string]: any }>(): FirestoreDataConverter<T> => ({
  toFirestore: (data: WithFieldValue<T>): DocumentData => {
    return data;
  },
  fromFirestore: (snap: QueryDocumentSnapshot): T => {
    const id = snap.id;
    return { id, ...snap.data() } as T;
  },
});


export const convertDocumentRefToType = async <T extends { id: string;[x: string]: any }>(
  ref: DocumentReference
): Promise<T | undefined> => {
  const docSnap = await getDoc(ref.withConverter(converter<T>()));
  if (docSnap.exists()) {
    return docSnap.data() as T;
  }
  return undefined;
};

export const getIdForDocumentRef = async (ref: DocumentReference) => {
  const docSnap = await getDoc(ref);
  return docSnap.id;
}
