import { collection, deleteDoc, getDocs, updateDoc } from "@firebase/firestore";
import { firestore } from "@/lib/firestore";
import { ComboboxItem } from "@mantine/core";


export async function getAllUsers(): Promise<User[]> {
    const userCollection = collection(firestore, "users");
    const docs = await getDocs(userCollection);

    const users: User[] = [];

    docs.forEach(doc => {
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

export async function getAllFlashcards(): Promise<Flashcard[]> {
    const flashcardCollection = collection(firestore, "flashies");
    const docs = await getDocs(flashcardCollection);


    const users = await getAllUsers();
    const flashcards: Flashcard[] = [];

    docs.forEach(doc => {
        const docData = doc.data();

        const creator = users.find(user => user.email == docData.creatorEmail);
        flashcards.push({
            creator: creator,
            title: docData.title,
            views: docData.views,
        });
    })

    return flashcards;
}

export async function getFlashcardsByEmail(email: string): Promise<Flashcard[]> {
    const flashcardCollection = collection(firestore, "flashies");
    const docs = await getDocs(flashcardCollection);

    const users = await getAllUsers();
    const user = users.find(user => user.email == email);

    if (user == null){
        throw new Error("There is no user registered with that email");
    }

    const flashcards: Flashcard[] = [];

    docs.forEach(doc => {
        const docData = doc.data();

        if (docData.creatorEmail == email){
            flashcards.push({
                creator: user,
                title: docData.title,
                views: docData.views,
            });
        }
    })

    return flashcards;
}

export const deleteUser = async (actionUser: User, deleteUserEmail: string) => {
    const userCollection = collection(firestore, "users");
    const docs = getDocs(userCollection);

    (await docs).forEach(doc => {
        const docData = doc.data();
        if (docData.email == deleteUserEmail){
            if (actionUser.role == "admin" || actionUser.email == deleteUserEmail){
                // delete user
                deleteDoc(doc.ref);
            }
        }
    });

}

export const setUpdateUserRoles = async (actionUser: User | undefined, updateEmail: string, newRole: ComboboxItem | null) => {
    const userCollection = collection(firestore, "users");
    const docs = getDocs(userCollection);
    if (actionUser && actionUser.role === "admin"){
    (await docs).forEach(doc => {
        const docData = doc.data();
        if (docData.email == updateEmail){
                updateDoc(doc.ref,{
                    role: newRole?.value
                })
        }
    })}
}