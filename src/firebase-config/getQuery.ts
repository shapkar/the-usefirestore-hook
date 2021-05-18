import { Query, CollectionReference } from '@firebase/firestore-types';
import { CollectionOptions } from 'firebase-config/queryOptions';
import getFirestoreRef from './getFirestoreRef';

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

export default getQuery;