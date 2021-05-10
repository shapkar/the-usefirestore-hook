import {
    WhereFilterOp,
    OrderByDirection,
  } from '@firebase/firestore-types';
  
  export type CollectionOptions = {
    listen?: boolean;
    listenerName?: string;
    sort?: SortOptions;
    queries?: QueryOptions[];
    limit?: number;
    lazyLoad?: boolean;
  };
  
  export type DocumentOptions = {
    listen?: boolean;
    listenerName?: string;
    subcollections?: { path: string; storeAs: string }[];
  };
  
  type SortOptions = {
    attribute: string;
    order: OrderByDirection;
  };
  
  type QueryOptions = {
    attribute: string;
    operator: WhereFilterOp;
    value: string | number | boolean | any[];
  };
  