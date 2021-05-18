import { CollectionReference, DocumentData } from '@firebase/firestore-types';
import { db } from './firebase';

const getFirestoreRef = (
    path: string
): CollectionReference<DocumentData> => {
    const basePath = 'mode/development';
    return db.collection(`${basePath}/${path}`);
};

export default getFirestoreRef;