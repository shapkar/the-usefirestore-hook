import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import classnames from 'classnames';
import { db } from 'app/firebase';
import { notifications } from './__mocks__/notifications';
import { users } from './__mocks__/users';

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const addData = async () => {
    setLoading(true);
    for (const not of notifications) {
      await db.collection('mode/development/notifications').doc(not.id).set(not)
        .then(() => {
          setError('');
          console.log('Mock data added!');
        })
        .catch(e => {
          console.log('error adding mock data', e);
          setError(e.message);
        });
    }
    for (const user of users) {
      await db.collection('mode/development/users').doc(user.id).set(user)
        .then(() => {
          setError('');
          console.log('Mock data added!');
        })
        .catch(e => {
          console.log('error adding mock data', e);
          setError(e.message);
        });
    }
    await db.collection('mode/development/examples').doc('Documentslkdjfhskjf').set({
      field: 'valueee'
    })
    setLoading(false);
  }

  return (
    <div className="App">
        <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <hr></hr>
        <a href="https://exelerateit.com" target="_blank" className={classnames('h2')}>Exelerate</a>
        <hr></hr>
        
        <p>Create firebase project, firebase web app and a database, then add the app config in the .env file</p>

        <p>When you are done click the button to add mock data to your firebase firestore database.</p>
        <Button disabled={loading} onClick={addData} size="lg">Add mock data</Button>
        {error && (
            <p className={classnames('text-danger', 'h5')}>{error}</p>
        )}
        </header>
    </div>
  );
}

export default App;
