import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID)

const database = new Databases(client);


export const updateSearchCount = async (searchTerm, anime) => {
    // 1. Use Appwrite SDK to check if the search term exists in the database
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', searchTerm),
        ])

        // 2. If it does, update the count
        if(result.documents.length > 0 ) {
            const doc = result.documents[0];

            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1,
            })
        // 3. If it doesn't, create a new document with the search term and count as 1
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm,
                count: 1,
                poster_url: anime.images?.jpg?.image_url || '',
                anime_id: anime.id || '',
            })
        }

    } catch (error) {
        console.log(error);
    }

}

export const getTrendingAnime = async () => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc("count")
        ])

        // Filter to only unique anime_id
        const seen = new Set();
        const unique = [];
        for (const doc of result.documents) {
            if (!seen.has(doc.anime_id)) {
                seen.add(doc.anime_id);
                unique.push(doc);
            }
            if (unique.length === 5) break; // show 5 unique trending anime
        }

        return unique; // return only unique trending anime
    } catch (error) {
        console.error(error);
    }
}