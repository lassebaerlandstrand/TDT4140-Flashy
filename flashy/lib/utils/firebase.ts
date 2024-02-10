import { collection, getDocs } from "@firebase/firestore";
import { firestore } from "@/lib/firestore";


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