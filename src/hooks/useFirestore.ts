import { useEffect, useRef } from 'react';
import { useDispatch } from 'app/hooks';
import { QueryDocumentSnapshot, DocumentData, Query, CollectionReference } from '@firebase/firestore-types';
import { db } from 'app/firebase';
import { GenericActions } from 'slices/generic';
import { CollectionOptions, DocumentOptions } from 'types/firestore';

interface ListenerState {
    name?: string,
    unsubscribe: () => void
}

export const useFirestore = <T extends DocumentData>(path: string) => {
    const collectionListeners = useRef<ListenerState[]>([]);
    const docListeners = useRef<ListenerState[]>([]);
    const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData>>();

    useEffect(() => {
        return () => {
            collectionListeners.current?.forEach(listener => {
                listener.unsubscribe();
            })
            docListeners.current.forEach(listener => {
                listener.unsubscribe();
            });
        };
    }, [collectionListeners]);

    const dispatch = useDispatch();

    const collection = (actions: GenericActions<T>, options?: CollectionOptions) => {
        let query = getQuery(path, options);

        getCollectionData(actions, query, options);
        
        if (options?.lazyLoad) {
            return {
                loadMore: () => {
                    getCollectionData(actions, query, options);
                }
            }
        }
    };

    const doc = async (id: string, actions: GenericActions<T>, options?: DocumentOptions) => {
        const docRef = getFirestoreRef(path).doc(id);

        dispatch(actions?.loading());
        if (options?.listen) {
            const listener = docRef.onSnapshot(doc => {
                if (!doc.exists) {
                    dispatch(actions.error('Document does not exists.'));
                    return;
                }
                dispatch(actions.success({ id: doc.id, ...doc.data()} as unknown as T));
            });
            docListeners.current.push({ name: options.listenerName, unsubscribe: listener });
        } else {
            console.log(docRef.path);
            docRef
                .get()
                .then(doc => {
                    if (!doc.exists) {
                        dispatch(actions.error('Document does not exists.'));
                        return;
                    }

                    let result: DocumentData = { id: doc.id, ...doc.data() };
                    dispatch(actions.success(result as T));

                    for (const subcoll of (options?.subcollections || [])) {
                        doc.ref
                            .collection(subcoll.path)
                            .get()
                            .then(snap => {
                                if (!snap.empty || snap.docs.length) {
                                    result[subcoll.storeAs] = snap.docs.map(doc => {
                                        return { id: doc.id, ...doc.data() };
                                    });
                                    dispatch(actions.success(result as T));
                                }
                        });
                    }
                })
                .catch(err => {
                    console.error('get document error', err);
                    dispatch(actions.error(err.message));
                });
        }
    };

    const unsubscribe = (listenerName?: string) => {
        if (listenerName) {
            collectionListeners.current.find(listener => listener.name === listenerName)?.unsubscribe();
            docListeners.current.find(listener => listener.name === listenerName)?.unsubscribe();
            return;
        }
        collectionListeners.current.forEach(listener => listener.unsubscribe());
        docListeners.current.forEach(listener => listener.unsubscribe());
    };

    const getCollectionData = (actions: GenericActions<T>, query: Query, options?: CollectionOptions) => {
        dispatch(actions.loading());
        if (options && options?.listen) {

            if (options.lazyLoad && lastDocRef.current) {
                query = query.startAfter(lastDocRef.current);
            }

            const listener = query.onSnapshot(
                querySnapshot => {
                    const data: DocumentData[] = [];
                    if (querySnapshot.empty) {
                        dispatch(actions?.success([] as unknown as T));
                        return;
                    }
                    querySnapshot.forEach(doc =>
                        data.push({ id: doc.id, ...doc.data() })
                    );
                    console.log('test', data);
                    dispatch(actions?.success(data as unknown as T));
                    if (options.lazyLoad) {
                        lastDocRef.current = querySnapshot.docs[querySnapshot.docs.length - 1];
                    }
                },
                error => {
                    dispatch(actions?.error(error.message));
                    console.log('collection streaming error', error.message);
                }
            );
            collectionListeners.current.push({name: options.listenerName, unsubscribe: listener});
        } else {
            query
                .get()
                .then(querySnapshot => {
                    const data: T[] = [];
                    querySnapshot.forEach(doc =>
                        data.push(({ id: doc.id, ...doc.data() } as unknown) as T)
                    );
                    dispatch(actions?.success((data as unknown) as T));
                    if (options && options.lazyLoad) {
                        lastDocRef.current = querySnapshot.docs[querySnapshot.docs.length - 1];
                    }
                })
                .catch(error => {
                    console.log('collection get error', error.message);
                    dispatch(actions?.error(error.message));
                });
        }
        
    }

    return { collection, doc, unsubscribe };
};

const getQuery = (collection: string, options?: CollectionOptions) => {
    const baseQuery: CollectionReference = getFirestoreRef(collection);
    let query: Query = baseQuery;
    if (options && options.queries) {
      const { queries } = options;
      queries.forEach(({ attribute, operator, value }) => {
        query = query.where(attribute, operator, value);
      });
    }
  
    if (options && options.sort) {
      const { attribute, order } = options.sort;
      query = query.orderBy(attribute, order);
    }
  
    if (options && options.limit) {
      query = query.limit(options.limit);
    }
  
    return query;
  };
  
const getFirestoreRef = (
    path: string
): CollectionReference<DocumentData> => {
    const basePath = 'mode/development';
    return db.collection(`${basePath}/${path}`);
};

