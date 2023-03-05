import React, { useContext, useEffect, useReducer } from 'react'
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import Card from 'react-bootstrap/esm/Card';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { Store } from '../Store';

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: ''};
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, order: action.payload, error: ''}
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload}

    default: 
        return state;
    }   
}

const OrderScreen = () => {
    const {state} = useContext(Store)
    const { userInfo } = state;

    const params = useParams();
    const { id: orderId} = params;

    const navigate = useNavigate();

    const[{ loading, error, order}, dispatch] = useReducer(reducer,{
        loading: true,
        order: {},
        error: '',
    });


    useEffect(() => {
        const fetchOrder = async () =>{
            try {
				console.log("inside of order screen try")
                dispatch({type: 'FETCH_REQUEST'});
				const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
                        'authorization': `Bearer ${userInfo.token}`,
					},
				});

				//if there's a response back....
				if (response){
					console.log('got something back from fetch');
					const data = await response.json(); //save the response (our posts) as 'result'
					console.log(`we got back the following: ${data}`);
				

                    if (response.ok) {
                        dispatch({ type: 'FETCH_SUCCESS', payload: data });
                        console.log(data);
                    }
                    else if (!response.ok){
                        dispatch({ type: 'FETCH_FAIL', payload: data });
                        console.log('retrieved some bulljive from fetch response')
                        console.log(data)
                    }
			    } 
			} catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err});
				alert(err);
				console.log('got no response back from fetch');
				console.log(err);
			}
        }
        if (!userInfo) { // if it's null
            return navigate('/signin')
        }
        if (!order._id || (order._id && order._id !== orderId)){
            fetchOrder();
        }
    }, [order, userInfo, orderId, navigate]);

  return (
    loading ? (
    <LoadingBox></LoadingBox>
    ): error ? (
        <MessageBox variant = "danger">{error}</MessageBox>
    ) : (
        <div>
            <Helmet>
                <title>Order {orderId} </title>
            </Helmet>
            <h1 className = "my-3">Order {orderId}</h1> 
            <Row>
                <Col md={8}>
                    <Card className= "mb-3">
                        <Card.Body>
                            <Card.Title>Shipping</Card.Title>
                            <Card.Text>
                                <strong>Name: </strong>{order.shippingAddress.fullName} <br/>
                                <strong>Address: </strong>{order.shippingAddress.address}, 
                                {order.shippingAddress.city}, {order.shippingAddress.postalCode}, 
                                {order.shippingAddress.country}
                            </Card.Text>
                            {order.isDelivered ? (
                                <MessageBox variant = "success">
                                    Delivered at {order.deliverdAt}
                                </MessageBox>
                            ) : (
                                <MessageBox variant ="danger"> Not Delivered </MessageBox>
                            )}
                        </Card.Body>
                    </Card>
                    <Card className= "mb-3">
                        <Card.Body>
                            <Card.Title>Payment</Card.Title>
                            <Card.Text>
                                <strong>Method: </strong>{order.paymentMethod} 
                            </Card.Text>
                            {order.isPaid ? (
                                <MessageBox variant = "success">
                                    Paid at {order.paidAt}
                                </MessageBox>
                            ) : (
                                <MessageBox variant ="danger"> Not Paid </MessageBox>
                            )}
                        </Card.Body>
                    </Card>
                    <Card className= "mb-3">
                        <Card.Body>
                            <Card.Title>Items</Card.Title>
                            <ListGroup variant = "flush">
                                {order.orderItems.map((item) => (
                                    <ListGroup.Item key={item._id}>
                                        <Row className = "align-items-center">
                                            <Col md = {6}>
                                                <img
                                                    src = {item.image}
                                                    alt = {item.name}
                                                    className = "img-fluid rounded img-thumbnail"
                                                    ></img> {' '}
                                                    <Link to={`/product/${item.slug}`}> {item.name}</Link>
                                            </Col>
                                            <Col md={3}>
                                                <span>{item.quantity}</span>
                                            </Col>
                                            <Col md={3}>${item.price}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                                </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className = "mb-3">
                        <Card.Body>
                            <Card.Title>Order Summary</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>${order.itemsPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>${order.shippingPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>${order.taxPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Order Total</Col>
                                        <Col><strong>${order.totalPrice.toFixed(2)}</strong></Col>
                                    </Row>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
  );
}

export default OrderScreen