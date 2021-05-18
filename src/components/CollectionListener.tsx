import { useFirestore } from 'hooks/useFirestore';
import { useEffect, useRef, useState } from 'react';
import { actions } from 'slices/notification';
import { Notification } from 'models/notification';
import { useSelector } from 'app/hooks';
import { StateStatus } from 'slices/generic';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { db } from 'firebase-config/firebase';

function CollectionListener() {
    const [data, setData] = useState<{title?: string, description?: string}>({});

    const {notifications, loading, error} = useSelector((state) => ({
        notifications: state.notification.data,
        loading: state.notification.status === StateStatus.Loading,
        error: state.notification.errors
    }))
    const firestore = useFirestore<Notification[]>('notifications');

    useEffect(() => {
        firestore.collection(actions, {listen: true});
    }, [])

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!data.title || !data.description) return;
        db.collection('mode/development/notifications')
            .add({
                title: data.title,
                description: data.description,
                createdAt: new Date(),
                type: 'order_placed'
        }).then().catch(e => console.log(e));
    }

    return (
        <>
        <div>
            <Row>
                <Col>
                    {loading && (
                        <p>Loading...</p>
                    )}
                    {(!loading && !notifications?.length) && (
                        <>
                        <p>There is not data in your database.</p>
                        <p>Go to home page and click the button Add mock data or add manually through the form.</p>
                        </>
                    )}
                    {error && (
                        <p>{error}</p>
                    )}
                    {notifications && (
                        notifications.map(n => (
                            <Card key={n.id} style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Title>{n.title}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{n.createdAt}</Card.Subtitle>
                                    <Card.Text>
                                        {n.description}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        ))    
                    )}
                </Col>
                <Col>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Title</Form.Label>
                            <Form.Control onChange={(e) => setData({...data, title: e.target.value})} type="text" placeholder="Enter title" />
                        </Form.Group>
                        <br></br>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Description</Form.Label>
                            <Form.Control onChange={(e) => setData({...data, description: e.target.value})} type="text" placeholder="Description" />
                        </Form.Group>
                            <br></br>
                        <Button variant="primary" type="submit">
                            Add
                        </Button>
                    </Form>
                </Col>
            </Row>
            
        </div>
        </>
    )
}

export default CollectionListener;