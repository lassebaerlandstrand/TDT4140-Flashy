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
    })
    
    return users;
}