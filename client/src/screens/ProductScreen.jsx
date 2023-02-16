import React, { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
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

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return { ...state, product: action.payload, loading: false };
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		default:
			return state;
	}
};

const ProductScreen = () => {
	//the slug params aka link suffix gets saved as the variable params
	const params = useParams();
	// the slug paams used in the link gets saved into the slug variable, where it is used below that
	const { slug } = params;

	const [{ loading, error, product }, dispatch] = useReducer(reducer, {
		loading: true,
		error: '',
		product: [],
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
				const response = await fetch(`http://localhost:5000/api/products/slug/${slug}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'appplication.json',
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
			
		};
		fetchData();
	}, [slug]);

	console.log(`loading? ${loading}`)
	console.log(error)
	console.log(product)

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
				<Col md={3}><Card><Card.Body><ListGroup variant="flush"><ListGroup.Item><Row><Col> Price: </Col><Col>${product.price}</Col></Row></ListGroup.Item><ListGroup.Item><Row><Col>Status: </Col><Col>{product.countInStock>0?<Badge bg="success">In Stock</Badge>:<Badge bg="danger">Danger</Badge>}</Col></Row></ListGroup.Item> {product.countInStock>0 && (<ListGroup.Item><div className="d-grid"><Button variant="primary">Add to Cart</Button></div></ListGroup.Item>)}</ListGroup></Card.Body></Card></Col>  
			</Row>
		</div>
	);  
};
 
export default ProductScreen;
