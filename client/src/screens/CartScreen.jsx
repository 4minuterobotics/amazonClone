import React, { useContext } from 'react'
import { Store } from '../Store'
import { Helmet } from 'react-helmet-async'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import MessageBox from '../components/MessageBox'
import { Link, useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

const CartScreen = () => {

    const navigate = useNavigate()
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {
        cart: {cartItems},
    } = state;
    
const updateCartHandler = async (item, quantity) => {
    try {
        console.log("pressing + 1 button")
        // http://localhost:5000/api/products/${item._id} for local server
        // https://amazon-clone-1zgp.onrender.com/api/products/${item._id} for remote server
        const data = await fetch(`https://amazon-clone-1zgp.onrender.com/api/products/${item._id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
            console.log("outside of fetch")
        //if there's a response back....
        if (data){
            console.log("got something back")
            const result = await data.json(); //save the response (our posts) as 'result'
            console.log(result) 
            if (data.ok) {
                console.log(result.countInStock);
                console.log(quantity);
                if (result.countInStock<quantity){
                    window.alert('Sorry. Product is out of stock')
                    return;
                }
            }
        else if (!data.ok){
            console.log('retrieved some bulljive from fetch response')
            console.log(result)
        }
    } 
    } catch (err) {
        alert(err);
        alert ("on fo nem")
        console.log('got nothing back from fetch');
        console.log(err);
    }

    ctxDispatch({
        type: 'CART_ADD_ITEM',
        payload:{...item, quantity}
    })

}

const removeItemHandler = (item) =>  {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item})
}

const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping')
}


  return (
    <div>
        <Helmet>
            <title> Shopping Cart </title>
        </Helmet>
        <h1> Shopping Cart </h1>
        <Row>
            <Col md={8}>
                {cartItems.length === 0 ? (
                    <MessageBox>
                        Cart is empty. <Link to="/"> Go Shopping </Link>
                    </MessageBox>
                ) : (
                    <ListGroup>
                    {cartItems.map((item) => (
                        <ListGroup.Item key={item._id}>
                            <Row className="align-items-center">
                                <Col md={4}>
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="img-fluid rounded img-thumbnail"
                                    ></img>{' '}
                                    <Link to={`/product/${item.slug}`}> {item.name} </Link>
                                </Col>
                                <Col md={3}>
                                    <Button 
                                        variant="light" 
                                        onClick={() =>
                                        updateCartHandler(item, item.quantity - 1)}
                                        disabled={item.quantity === 1}>
                                        <i className="fas fa-minus-circle"></i>
                                    </Button> {' '}
                                    <span>{item.quantity}</span>{' '}
                                    <Button 
                                        variant="light"
                                        onClick={() =>
                                        updateCartHandler(item, item.quantity + 1)} 
                                        disabled={item.quantity === item.countInStock}>
                                        <i className="fas fa-plus-circle"></i>
                                    </Button>
                                </Col>
                                <Col md={3}> ${item.price} </Col>
                                <Col md={2}>
                                    <Button 
                                    variant="light"
                                    onClick={() => removeItemHandler(item)}>
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                    </ListGroup>
                )}
            </Col>
            <Col md={4}>
                <Card>
                    <Card.Body>
                        <ListGroup variant = "flush">
                            <ListGroup.Item>
                                <h3>
                                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                                    items) : $ {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                                </h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <div className="d-grid">
                                    <Button
                                        onClick={checkoutHandler}
                                        type="button"
                                        variant="primary"
                                        disabled={cartItems.length === 0}
                                        >
                                        Proceed to Checkout
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

export default CartScreen