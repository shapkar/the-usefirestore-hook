import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'app/hooks';
import { StateStatus } from 'slices/generic';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { actions } from 'slices/user';
import { useFirestore } from 'hooks/useFirestore';
import { User } from 'models/user';

function LazyLoad() {
    const {users, loading, error} = useSelector((state) => ({
        users: state.user.data,
        loading: state.user.status === StateStatus.Loading,
        error: state.user.errors
    }))

    const dispatch = useDispatch();
    const firestore = useFirestore<User[]>('users');
    const collection = useRef<{loadMore: () => void}>();

    useEffect(() => {
        collection.current = firestore.collection(
            actions,
            {listen: true, lazyLoad: true, limit: 1}
        );

        return () => {
            dispatch(actions.reset())
        };
    }, [])

    const loadMore = () => {
        collection.current?.loadMore();
    }
   
    return (
        <>
        <div>
            <Row>
                <Col>
                {loading && (
                    <p>Loading...</p>
                )}
                {!users?.length && error && !loading && (
                    <>
                    <p>{error}</p>
                    <p>Go to home page and click the button Add mock data.</p>
                    </>
                )}
                {users && (
                    users.map(user => (
                        <Card key={user.id} style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>{user.name}</Card.Title>
                                <Card.Text>
                                    {user.email}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))    
                )}
                </Col>
               <Col>
                    <Button onClick={loadMore} variant="primary" type="submit">
                        load more
                    </Button>
               </Col>
            </Row>
            
        </div>
        </>
    )
}

export default LazyLoad;