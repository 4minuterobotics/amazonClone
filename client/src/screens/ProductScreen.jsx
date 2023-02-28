import React, { useContext, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Rating from '../components/Rating';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';

//this reducer function moniters and changes the state/value for fetch requests
const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_REQUEST':
			console.log("inside of reducer setting loading to be true")
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			console.log("updating product")
			return { ...state, product: action.payload, loading: false };
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		default:
			return state;
	}
};

const ProductScreen = () => {
	const navigate = useNavigate();

	//the slug params aka link suffix gets saved as the variable params
	const params = useParams();
	// the slug paams used in the link gets saved into the slug variable, where it is used below that
	const { slug } = params;

	///////////////long way
	//const slug = params.slug
	//const ect = params.ect

	/////////////////short way
	//const {slug,ect} = params


	const [{ loading, error, product }, dispatch] = useReducer(reducer, {
		loading: true,
		error: null,
		product: null,
	});

	//this state is the old way to save the products from the back end
	//const [products, setProducts] = useState([]);

	useEffect(() => {
		console.log('beginning use effect');
		const fetchData = async () => {
			dispatch({ type: 'FETCH_REQUEST' });
			console.log('dispatched first useReducer action');
			console.log(slug);
			try {
				console.log("inside of try")
				const response = await fetch(`http://localhost:5000/api/products/slug/${slug}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				//if there's a response back....
				if (response){
					console.log('got something back from fetch');
					const result = await response.json(); //save the response (our posts) as 'result'
					console.log(`we got back the following: ${result}`);
				

				if (response.ok) {
					dispatch({ type: 'FETCH_SUCCESS', payload: result });
					console.log(result);
					console.log(product);
				}
				else if (!response.ok){
					dispatch({ type: 'FETCH_FAIL', payload: result });
					console.log('retrieved some bulljive from fetch response')
					console.log(result)
				}
			} 
			} catch (err) {
				alert(err);
				console.log('got nothing back from fetch');
				console.log(err);
			}
			console.log("sdfsadfasfsadfasdfasdf dsfsdf")
		};
		fetchData();
	}, [slug]);

	console.log(`loading? ${loading}`)
	console.log(error)
	console.log(product) 


//this is how you add the useContext value/state and functions to a page
const {state, dispatch: ctxDispatch} = useContext(Store);	
const {cart} = state;

//when the add to car button is clicked....
const addToCartHandler = async () => {
	//check to see if the item  already exists in the cart
	const existItem = cart.cartItems.find((x) => x._id === product._id)
	//if it exists, increase the quantity by 1, otherwise set the quantity to 1
	const quantity = existItem ? existItem.quantity + 1 : 1;
	console.log(" just stated add to cart handler")




	//how video recommended getting shit from backend

	// const {data} = await axios.get(`/api/products/${product._id}`)
	// if (data.countInStock< quantity){
	// 	window.alert('Sorry, Product is out of stock')
	// 	return;
	// } 




	//send a request to the product API  
	try {
		const data = await fetch(`http://localhost:5000/api/products/${product._id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		//if there's a response back....
		if (data){
			console.log('got something back from ProductScreen fetch');
			const result = await data.json(); //save the response (our posts) as 'result'
			console.log(`we got back the following: ${result}`);
		
		//make sure quantity being added to the cart is not less than what's in stock (countInStock)
		if (data.ok) {
			console.log(result);
			if (result.countInStock< quantity){
				window.alert('Sorry, Product is out of stock')
				// return;
			} 
		}
		else if (!data.ok){
			console.log('retrieved some bulljive from fetch response')
			console.log(result)
		}
	} 
	} catch (err) {
		alert(err);
		console.log('got nothing back from fetch');
		console.log(err);
	}




	//this reducer sets the payload (state object) equal to the data object that was fetched to this page (product). 
	//It also adds the quantity key to the data with a value of 1 to the state object
	ctxDispatch({type: 'CART_ADD_ITEM', payload: {...product, quantity}})
	console.log(" adding the new product and its quantity value to the payload for usecontext")

	navigate('/cart');
}

	return loading ? (
		<LoadingBox/>
	) : error ? (
		<MessageBox variant="danger">{error.message}</MessageBox>
	) : (
		<div>
			<Row>
				<Col md={6}>
					<img className='img-large' src={product.image} alt={product.name}/>
				</Col>
				<Col md={3}><ListGroup variant="flush"> <ListGroup.Item> <Helmet><title>{product.name}</title></Helmet><h1>{product.name}</h1> </ListGroup.Item><ListGroup.Item><Rating rating={product.rating} numReviews={product.numReviews}></Rating></ListGroup.Item><ListGroup.Item>Price: ${product.price}</ListGroup.Item><ListGroup.Item>Description: <p>{product.description}</p></ListGroup.Item></ListGroup></Col>
				<Col md={3}><Card><Card.Body><ListGroup variant="flush"><ListGroup.Item><Row><Col> Price: </Col><Col>${product.price}</Col></Row></ListGroup.Item><ListGroup.Item><Row><Col>Status: </Col><Col>{product.countInStock>0?<Badge bg="success">In Stock</Badge>:<Badge bg="danger">Danger</Badge>}</Col></Row></ListGroup.Item> {product.countInStock>0 && (<ListGroup.Item><div className="d-grid"><Button onClick={addToCartHandler} variant="primary">Add to Cart</Button></div></ListGroup.Item>)}</ListGroup></Card.Body></Card></Col>  
			</Row>
		</div>
	);  
};
 
export default ProductScreen;
