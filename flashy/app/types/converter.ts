import { DocumentReference, QueryDocumentSnapshot, getDoc } from "@firebase/firestore";

export const converter = <T>() => ({
    toFirestore: (data: T) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) =>
      snap.data() as T
})

export  const convertDocumentDataToType = async <T>(ref: DocumentReference): Promise<T | undefined> => {
    const docSnap = await getDoc(ref.withConverter(converter<T>()));

    if (docSnap.exists()) {
        return docSnap.data();
    }
    return undefined;
}