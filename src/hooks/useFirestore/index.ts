import { useEffect, useRef } from 'react';
import { QueryDocumentSnapshot, DocumentData } from '@firebase/firestore-types';
import { GenericActions } from 'slices/generic';
import { CollectionOptions, DocumentOptions } from 'firebase-config/queryOptions';
import getFirestoreRef from 'firebase-config/getFirestoreRef';
import collectionApi from './collectionApi';
import docApi from './docApi';
import getQuery from 'firebase-config/getQuery';
import { useDispatch } from 'app/hooks';

export interface ListenerState {
    name?: string,
    unsubscribe: () => void
}

export const useFirestore = <T extends DocumentData>(path: string) => {
    const collectionListenersRef = useRef<ListenerState[]>([]);
    const docListenersRef = useRef<ListenerState[]>([]);
    const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData>>();

    useEffect(() => {
        return () => {
            collectionListenersRef.current?.forEach(listener => {
                listener.unsubscribe();
            })
            docListenersRef.current.forEach(listener => {
                listener.unsubscribe();
            });
        };
    }, [collectionListenersRef]);

    const dispatch = useDispatch();

    const collection = (actions: GenericActions<T>, options?: CollectionOptions) => {
        let query = getQuery(path, options);

        collectionApi<T>(query, actions, dispatch, collectionListenersRef, lastDocRef, options);
        
        if (options?.lazyLoad) {
            return {
                loadMore: (limit?: number) => {
                    limit && (query = getQuery(path, {...options, limit}));
                    query = query.startAfter(lastDocRef.current);
                    collectionApi<T>(query, actions, dispatch, collectionListenersRef, lastDocRef, options);
                }
            }
        }
    };

    const doc = async (id: string, actions: GenericActions<T>, options?: DocumentOptions) => {
        docApi<T>(path, id, actions, dispatch, docListenersRef, options);
    };

    const id = () => {
        const ref = getFirestoreRef(path).doc();
        return ref.id;
    }

    const create = async (data: any) => {
        return getFirestoreRef(path)
            .add(data)
            .then(res => console.log('Document created with id: ', res.id))
            .catch(e => console.log('Error creating document', e))
    }

    const update = async (id: string, data: any) => {
        return getFirestoreRef(path)
            .doc(id)
            .update(data)
            .then(() => console.log('Document updated.'))
            .catch(e => console.log(`Error updating document with id: ${id}`, e))
    }
    
    const remove = async (id: string) => {
        return getFirestoreRef(path)
            .doc(id)
            .delete()
            .then(() => console.log('Document deleted.'))
            .catch(e => console.log(`Error deleting document with id: ${id}`, e))
    }

    const unsubscribe = (listenerName?: string) => {
        if (listenerName) {
            collectionListenersRef.current.find(listener => listener.name === listenerName)?.unsubscribe();
            docListenersRef.current.find(listener => listener.name === listenerName)?.unsubscribe();
            return;
        }
        collectionListenersRef.current.forEach(listener => listener.unsubscribe());
        docListenersRef.current.forEach(listener => listener.unsubscribe());
    };

    return { collection, doc, id, create, update, remove, unsubscribe };
};
