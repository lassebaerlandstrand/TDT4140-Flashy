import {
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  WithFieldValue,
  getDoc
} from "@firebase/firestore";
export const converter = <T extends { [x: string]: any }>(): FirestoreDataConverter<T> => ({
  toFirestore: (data: WithFieldValue<T>): DocumentData => {
    return data;
  },
  fromFirestore: (snap: QueryDocumentSnapshot): T => {
    return snap.data() as T;
  },
});


export const convertDocumentRefToType = async <T extends { [x: string]: any }>(
  ref: DocumentReference
): Promise<T | undefined> => {
  const docSnap = await getDoc(ref.withConverter(converter<T>()));
  if (docSnap.exists()) {
    const id = docSnap.id;
    return { id, ...docSnap.data() } as T;
  }
  return undefined;
};

export const getIdForDocumentRef = async (ref: DocumentReference) => {
  const docSnap = await getDoc(ref);
  return docSnap.id;
}
