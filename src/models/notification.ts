import firebase from 'firebase';

export interface Notification {
    id?: string;
    title: string;
    description: string;
    type: string;
    createdAt: string | firebase.firestore.Timestamp;
    subcollections?: any[];
}
