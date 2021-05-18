import { MutableRefObject} from 'react';
import { AppDispatch } from 'app/store';
import { DocumentData} from '@firebase/firestore-types';
import { GenericActions } from 'slices/generic';
import { ListenerState } from './index';
import { DocumentOptions } from 'firebase-config/queryOptions';
import getFirestoreRef from 'firebase-config/getFirestoreRef';

const docApi = <T>(
    path: string,
    id: string,
    actions: GenericActions<T>,
    dispatch: AppDispatch,
    docListenersRef: MutableRefObject<ListenerState[]>,
    options?: DocumentOptions
) => {
    const docRef = getFirestoreRef(path).doc(id);

    dispatch(actions?.loading());
    if (options?.listen) {
        const listener = docRef.onSnapshot(doc => {
            if (!doc.exists) {
                dispatch(actions.error('Document does not exists.'));
                return;
            }
            console.log('pelod', {id: doc.id, ...doc.data()})
            dispatch(actions.success({ id: doc.id, ...doc.data()} as unknown as T));
        });
        docListenersRef.current.push({ name: options.listenerName, unsubscribe: listener });
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
}

export default docApi;