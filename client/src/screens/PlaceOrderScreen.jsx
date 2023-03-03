import React, { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import Col from 'react-bootstrap/esm/Col'
import Row from 'react-bootstrap/esm/Row'
import Card from 'react-bootstrap/esm/Card'
import Button from 'react-bootstrap/esm/Button'
import ListGroup from 'react-bootstrap/esm/ListGroup'
import { Store } from '../Store'
import CheckoutSteps from '../components/CheckoutSteps'
import { Link, useNavigate } from 'react-router-dom'

const PlaceOrderScreen = () => {
    const navigate= useNavigate();

    const {state, dispatch: ctxDispatch} = useContext (Store);
    const {cart, userInfo} = state;

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; //123.2345
    cart.itemsPrice = round2(cart.cartItems.reduce((a, c)=> a + c.quantity * c.price, 0)); 
    cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
    cart.taxPrice = round2(0.15 * cart.itemsPrice);
    cart.totalPrice= cart.itemsPrice + cart.shippingPrice + cart.taxPrice;
    const placeOrderHandler = async() => {
         
    }

    useEffect(() => {
        if (!cart.paymentMethod){
            navigate('/payment');
        }
    },[cart, navigate])
  return (
    <div>
        <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
        <Helmet>
            <title>Preview Order</title>
        </Helmet>
        <h1 className="my-3">Preview Order</h1>
        <Row>
            <Col md={8}>
                <Card className="mb-3">
                    <Card.Body>
                        <Card.Title>Shipping</Card.Title>
                        <Card.Text>
                            <strong>Name:</strong> {cart.shippingAddress.fullName} <br/>
                            <strong>Address:</strong> {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}                           
                        </Card.Text>
                        <Link to='/shipping'>Edit</Link>
                    </Card.Body>
                </Card>
                <Card className="mb-3">
                    <Card.Body>
                        <Card.Title>Payment</Card.Title>
                        <Card.Text>
                            <strong>Method:</strong> {cart.paymentMethod}
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card className ="mb-3">
                    <Card.Body>
                        <Card.Title>Items</Card.Title>
                        <ListGroup variant='flush'>
                            {cart.cartItems.map((item) => (
                                <ListGroup.Item key={item._id}>
                                    <Row className='align-items-center'>
                                        <Col md={6}>
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            className="img-fluid rounded img-thumbnail"
                                        ></img>{' '}
                                        <Link to={'/product/${item.slug}'}>{item.name}</Link>
                                        </Col>
                                        <Col md={3}><span>{item.quantity}</span></Col>
                                        <Col md={3}>${item.price}</Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        <Link to="'/cart">Edit</Link>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={4}>
                <Card>
                    <Card.Body>
                        <Card.Title>Order Summary</Card.Title>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>${cart.itemsPrice.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${cart.shippingPrice.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${cart.taxPrice.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Order Total</Col>
                                    <Col>${cart.totalPrice.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <div>
                                    <Button
                                        type="buton"
                                        onClick={placeOrderHandler}
                                        disabled={cart.cartItems.length===0}
                                        >
                                            Place Order
                                        </Button>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default PlaceOrderScreen