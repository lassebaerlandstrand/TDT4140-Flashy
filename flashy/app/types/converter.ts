import {
  DocumentReference,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
  WithFieldValue,
  DocumentData,
  doc,
  getDoc,
  getFirestore,
} from "@firebase/firestore";
export const converter = <
  T extends { [x: string]: any }
>(): FirestoreDataConverter<T> => ({
  toFirestore: (data: WithFieldValue<T>): DocumentData => {
    return data;
  },
  fromFirestore: (snap: QueryDocumentSnapshot): T => {
    return snap.data() as T;
  },
});
export const fetchByRef = async <T extends { [x: string]: any }>(
  ref: DocumentReference
): Promise<T | undefined> => {
  const docSnap = await getDoc(ref.withConverter(converter<T>()));
  if (docSnap.exists()) {
    return docSnap.data() as T;
  }
  return undefined;
};
