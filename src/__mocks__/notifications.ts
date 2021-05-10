import moment from 'moment';
import type { Notification } from 'models/notification';
import firebase from 'firebase';

export const notifications: Notification[] = [
  {
    id: '5e8883f1b51cc1956a5a1ec0',
    createdAt: firebase.firestore.Timestamp.fromDate(moment()
    .subtract(2, 'hours')
    .toDate()),
    description: 'Dummy text',
    title: 'Your order is placed',
    type: 'order_placed'
  },
  {
    id: '5e8883f7ed1486d665d8be1e',
    createdAt: firebase.firestore.Timestamp.fromDate(moment()
    .subtract(1, 'day')
    .toDate()),
    description: 'You have 32 unread messages',
    title: 'New message received',
    type: 'new_message'
  },
  {
    id: '5e8883fca0e8612044248ecf',
    createdAt:  firebase.firestore.Timestamp.fromDate(moment()
    .subtract(3, 'days')
    .toDate()),
    description: 'Dummy text',
    title: 'Your item is shipped',
    type: 'item_shipped'
  },
  {
    id: '5e88840187f6b09b431bae68',
    createdAt: firebase.firestore.Timestamp.fromDate(moment()
    .subtract(7, 'days')
    .toDate()),
    description: 'You have 32 unread messages',
    title: 'New message received',
    type: 'new_message'
  },
  {
    id: 'ge88840187f6b09b401bae68',
    createdAt: firebase.firestore.Timestamp.fromDate(moment()
    .subtract(7, 'days')
    .toDate()),
    description: 'You have 32 unread messages',
    title: 'Your item is too large',
    type: 'error_shipment'
  }
];
