import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
//import axios from 'axios';
//import data from '../data';

const HomeScreen = () => {
	//this state will save the products from the back end
	const [products, setProducts] = useState([]);
	useEffect(() => {
		console.log('beginning use effect');
		const fetchData = async () => {
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

					console.log(result);
					setProducts(result);
					console.log(result);
					console.log(products);
				}
			} catch (error) {
				alert(error);
				console.log('got nothing back from fetch');
				console.log(error);
			}
		};
		fetchData();
	}, []);

	return (
		<div>
			<h1>Featured Products</h1>
			<div className='products'>
				{products.map((product) => (
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
				))}
			</div>
		</div>
	);
};

export default HomeScreen;
