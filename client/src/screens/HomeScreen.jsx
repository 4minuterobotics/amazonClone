import React, { useEffect, useReducer, useState } from 'react';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

//import axios from 'axios';
//import data from '../data';

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return { ...state, products: action.payload, loading: false };
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		default:
			return state;
	}
};

const HomeScreen = () => {
	const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
		loading: true,
		error: '',
		products: [],
	});

	//this state is the old way to save the products from the back end
	//const [products, setProducts] = useState([]);

	useEffect(() => {
		console.log('beginning use effect');
		const fetchData = async () => {
			dispatch({ type: 'FETCH_REQUEST' });
			console.log('dispatched first useReducer action');
			try {
				console.log("fetching shit for home page")

				// http://localhost:5000/api/products for local server
				// https://amazon-clone-1zgp.onrender.com/api/products for remote server
				const response = await fetch('http://localhost:5000/api/products', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				//if there's a response back....
				if (response.ok) {
					console.log('got something back from fetch');
					const result = await response.json(); //save the response (our posts) as 'result'
					console.log(`we got back the following: ${result}`);
					dispatch({ type: 'FETCH_SUCCESS', payload: result });
					console.log(result);
					//setProducts(result);
					console.log(products);
				}
			} catch (error) {
				alert(error);
				console.log('got nothing back from fetch');
				console.log(error);
				dispatch({ type: 'FETCH_FAIL', payload: error.message });
			}
		};
		fetchData();
	}, []);

	return (
		<div>
		<Helmet>
			<title>Foo Amazon</title>
		</Helmet>
			<h1>Featured Products</h1>
			<div className='products'>
				{loading ? (
					<LoadingBox/>
				) : error ? (
					<MessageBox variant="danger">{error}</MessageBox>
				) : (
					<Row>
						{/* Row is a styled bootstrap component that puts things next to each other. 
						Col determines how many columns show up on differenc screen sizes. In this case,
						column size will be 6/12th on small sceens and 3/12th on large screens. */}
						{products.map((product) => (
							<Col key={product.slug} sm={6} md={4} lg={3} className='mb-3'>
								<Product product={product} />
							</Col>
						))}
					</Row>
				)}
			</div>
		</div>
	);
};

export default HomeScreen;
