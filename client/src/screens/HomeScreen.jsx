import React, { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import logger from 'use-reducer-logger';
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
				const response = await fetch('http://localhost:5000/api/products', {
					method: 'GET',
					headers: {
						'Content-Type': 'appplication.json',
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
					console.log(result);
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
			<h1>Featured Products</h1>
			<div className='products'>
				{loading ? (
					<div> Loading... </div>
				) : error ? (
					<div>{error}</div>
				) : (
					products.map((product) => (
						<div className='product' key={product.slug}>
							<Link to={`/product/${product.slug}`}>
								<img src={product.image} alt={product.name} />
							</Link>
							<div className='product-info'>
								<Link to={`/product/${product.slug}`}>
									<p>{product.name}</p>
								</Link>
								<p>
									<strong>${product.price}</strong>
								</p>
								<button>Add to cart</button>
							</div>
							{console.log('rendering home page')}
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default HomeScreen;
