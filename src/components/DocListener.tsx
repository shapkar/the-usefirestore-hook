import { useFirestore } from 'hooks/useFirestore';
import { useEffect, useState } from 'react';
import { useSelector } from 'app/hooks';
import { StateStatus } from 'slices/generic';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { actions } from 'slices/documentExample';
import { DocumentExample } from 'models/documentExample';
import { db } from 'app/firebase';

function DocListener() {
    const [value, setValue] = useState<string>('');
    const [unsubscribed, setUnsubscribed] = useState<boolean>(false);

    const {data, loading, error} = useSelector((state) => ({
        data: state.documentExample.data,
        loading: state.documentExample.status === StateStatus.Loading,
        error: state.documentExample.errors
    }))
    const firestore = useFirestore<DocumentExample>('examples');

    useEffect(() => {
        firestore
            .doc(
                'Documentslkdjfhskjf',
                actions,
                {
                    listen: true,
                    listenerName: 'listener'
                }
            )
    }, [])

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!value) return;

        db.collection('mode/development/examples')
            .doc(data?.id)
            .update({field: value})
    }

    const unsubscribe = () => {
        firestore.unsubscribe('listener');
        setUnsubscribed(true);
    }
   
    return (
        <>
        <div>
            <Row>
                <Col>
                <h3>Document data</h3>
                {loading && (
                <p>Loading...</p>
                )}
                {!data && error && !loading && (
                    <>
                    <p>{error}</p>
                    <p>Go to home page and click the button Add mock data.</p>
                    </>
                )}
                {data && (
                    <Card style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>{data.id}</Card.Title>
                            <Card.Text>
                                {data.field}
                            </Card.Text>
                            {!unsubscribed && (<Button onClick={unsubscribe} variant="primary" type="submit">
                                Unsubscribe
                            </Button>
                            )} 
                            {unsubscribed && (
                                <p>unsubscribed</p>
                            )}
                        </Card.Body>
                    </Card>
                )}
                </Col>
               <Col>
                    {data && (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>value</Form.Label>
                                <Form.Control onChange={(e) => setValue(e.target.value)} type="text" placeholder="Enter value" />
                            </Form.Group>
                            <br></br>
                                <br></br>
                            <Button variant="primary" type="submit">
                                Change value
                            </Button>
                        </Form>
                    )}
               </Col>
            </Row>
            
        </div>
        </>
    )
}

export default DocListener;