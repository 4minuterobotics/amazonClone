import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { Store } from '../Store';
function Product(props) {
	const { product } = props;

	const {state, dispatch: ctxDispatch} = useContext(Store);
    const {
        cart: {cartItems},
    } = state;

	const addToCartHandler = async (item) => {
		
		//check to see if the item  already exists in the cart
		const existItem = cartItems.find((x) => x._id === product._id)
		//if it exists, increase the quantity by 1, otherwise set the quantity to 1
		const quantity = existItem ? existItem.quantity + 1 : 1;
		console.log(quantity)
		
		try {
			console.log("pressing Add to cart button")

			// http://localhost:5000/api/products/${item._id} for local server
			// https://amazon-clone-1zgp.onrender.com/api/products/${item._id} for remote server
			const data = await fetch(`https://amazon-clone-1zgp.onrender.com/api/products/${item._id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});
				console.log("outside of fetch")
				console.log(data)
			//if there's a response back....
			if (data){
				console.log("got something back")
				const result = await data.json(); //save the response (our posts) as 'result'
				console.log(result) 
				if (data.ok) {
					console.log(data);
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

	return (
		<Card>
			<Link to={`/product/${product.slug}`}>
				<img src={product.image} className='card-img-top' alt={product.name} />
			</Link>
			<Card.Body>
				<Link to={`/product/${product.slug}`}>
					<Card.Title>{product.name}</Card.Title>
				</Link>
				<Rating rating={product.rating} numReviews={product.numReviews} />
				<Card.Text>${product.price}</Card.Text>
				{product.countInStock === 0 ? (<Button variant="light" disabled>Out of stock</Button>
				) : (
				<Button onClick={() => addToCartHandler(product)}>Add to cart</Button>)}
				
			</Card.Body>

			{console.log(product.slug)}
		</Card>
	);
}

export default Product;
