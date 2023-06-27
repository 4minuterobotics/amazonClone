import React, { useContext, useEffect, useReducer } from 'react'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import Card from 'react-bootstrap/esm/Card';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import PageAnimation from '../components/PageAnimation';
import { Store } from '../Store';
import {toast} from 'react-toastify'

let data ='' //i had to make this global for it to be used below

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: ''};
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, order: action.payload, error: ''}
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload}
        case 'PAY_REQUEST':
            return { ...state, loadingPay: true,};
        case 'PAY_SUCCESS':
            return { ...state, loadingPay: false, successPay: true}
        case 'PAY_FAIL':
            return { ...state, loadingPay: false}
        case 'PAY_RESET':
            return { ...state, loadingPay: false, successPay: false}

    default: 
        return state;
    }   
}


const OrderScreen = () => {
    console.log('Order Screen page starts here')

    const {state, dispatch: ctxDispatch} = useContext (Store); //add the global store state context to this page
    const { userInfo } = state; // create an object of the user's info
    console.log(userInfo);

    const params = useParams(); // params is an object
    console.log(params); //this logs as -->  id: as;lkj45p98oflhr98
    const { id: orderId} = params; //if params is being deconstructed, 
    //console.log (id)


    const navigate = useNavigate();

    const[{ loading, error, order, successPay, loadingPay}, dispatch] = useReducer(reducer,{
        loading: true,
        order: {},
        error: '',
        successPay: false,
        loadingPay: false,
    });

    const [{isPending}, paypalDispatch] = usePayPalScriptReducer(); // this returns the state of the loading script and a function to load the script.

    //-First action (create the order) after one of the paypal buttons is pressed.
    //... This function passes data and actions as arguments needed for the popup that 
    //... comes after the PayPal button is pressed
    function createOrder(data, actions){
        console.log('createOrder function began')
        return actions.order
        .create ({ //create an actions.order object
            purchase_units: [
                {
                    amount: {value: order.totalPrice}, //pass the amount based on the order.totalPrice
                },
            ],
        })
        .then ((orderId) => { // might need to lowecase the D in ID ////////////////////////////////////////////////
            return orderId;
        })
    }

    //-2nd action (approve the order) after clicking pay on the 'complete purchase' popup. 
    //... What happens is first all the order details is captured and sent to paypal.
    //... Next paypal approves or disapproves the transaction
    function onApprove (data, actions) {
        console.log('onApprove function began')
        console.log(order)
        return actions.order.capture().then(async function (details){
            try {
				console.log("inside of onApprove try")
                dispatch({type: 'PAY_REQUEST'});

                // http://localhost:5000/api/orders/${order._id}/pay for local server
                // https://amazon-clone-1zgp.onrender.com/api/orders/${order._id}/pay for remote server
				const response = await fetch(`https://amazon-clone-1zgp.onrender.com/api/orders/${order._id}/pay`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
                        'authorization': `Bearer ${userInfo.token}`,
					},
                    body: JSON.stringify({
                        details
                    }),
				});

				//if there's a response back....
				if (response){
					console.log('got something back from fetch');
					const data = await response.json(); //save the response as 'result'
					console.log(`we got back the following: ${data}`);
				

                    if (response.ok) {
                        dispatch({ type: 'PAY_SUCCESS', payload: data });
                        ctxDispatch({type: 'CART_CLEAR'});
                        localStorage.removeItem('cartItems')
                        console.log('payment was successful')
                        console.log(data);
                        //navigate(`/order/${data.order._id}`)
                        toast.success('Order is paid')
                        console.log(data.order._id)
                        

                    }
                    else if (!response.ok){
                        dispatch({ type: 'PAY_FAIL', payload: data.message });
                        console.log('retrieved some bulljive from fetch response')
                        console.log(data)
                        toast.error(data.message)
                    }
			    } 
			} catch (err) {
                dispatch({ type: 'PAY_FAIL', payload: err});
				alert(err);
				console.log('got no response back from fetch');
				console.log(err);
                toast.error('got no response back from order payment approval')
			}
        })
    }    
        
        function onError (err) {
            console.log('error jo');
            toast.error('error jo');
        }
     
    useEffect(() => {
        const fetchOrder = async () =>{
            try {
				console.log("inside of order screen try")
                dispatch({type: 'FETCH_REQUEST'});

                // http://localhost:5000/api/orders/${orderId} for local server
                // https://amazon-clone-1zgp.onrender.com/api/orders/${orderId} for remote server
				const response = await fetch(`https://amazon-clone-1zgp.onrender.com/api/orders/${orderId}`, {
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
            return navigate('/signin')////////////////////////////////////////////
        }
        if (!order._id || successPay || (order._id && order._id !== orderId)){
            fetchOrder();
            if (successPay){
                dispatch ({ type: 'PAY_RESET'});
            }
        } else{

            const loadPaypalScript = async() => {
                /////////////////////
                try {
                    console.log("loading paypal script fetch")

                    // http://localhost:5000/api/keys/paypal for local server
                    // https://amazon-clone-1zgp.onrender.com/api/keys/paypal for remote server
                    const response = await fetch('https://amazon-clone-1zgp.onrender.com/api/keys/paypal', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': `Bearer ${userInfo.token}`,
                        },
                    });
    
                    //if there's a response back....
                    if (response){
                        console.log(response)
                        console.log('got something back from paypal script fetch');
                        data = await response.text(); //save the response  as 'data'
                        console.log(`we got back the following: ${data}`);
                        console.log(data)
                    
    
                        if (response.ok) {
                            console.log(data);
                        }
                        else if (!response.ok){
                            console.log('retrieved some bulljive from fetch response')
                            console.log(data)
                        }
                    } 
                } catch (err) {
                    alert(err);
                    console.log('got no response back from fetch');
                    console.log(err);
                }
                /////////////////////


                paypalDispatch({
                    type: 'resetOptions',
                    value:{
                        'client-id': data,
                        currency: 'USD',
                    },
                })
                paypalDispatch ({ type: 'setLoadingStatus', value: 'pending'})
            }
            loadPaypalScript()
        }
    }, [order, userInfo, orderId, navigate, paypalDispatch, successPay]);

  return (
    loading ? (
    <LoadingBox></LoadingBox>
    ): error ? (
        <MessageBox variant = "danger">{error}</MessageBox>
    ) : (
        <div>
        <PageAnimation>
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
                            </Card.Text>{console.log(order)}
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
                                {!order.isPaid && (
                                    <ListGroup.Item>
                                        {isPending ? (
                                            <LoadingBox/>
                                        ) : (
                                            <div>
                                                <PayPalButtons
                                                    createOrder = {createOrder} 
                                                    onApprove = {onApprove} 
                                                    onError = {onError} 
                                                ></PayPalButtons>
                                            </div>                    
                                        )}
                                        {loadingPay && <LoadingBox/>}
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </PageAnimation>
        </div>
    )
  );
}

export default OrderScreen