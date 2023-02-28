import React, { useContext } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SignInScreen from './screens/SignInScreen';

const App = () => {
	const {state} = useContext(Store);	
	const {cart}=state;


	return (
		<BrowserRouter>
			<div className='d-flex flex-column site-container'>
				<header>
					<Navbar bg='dark' variant='dark'>
						{/* container is the bootstrap styled component to make stuff appear on 1 line. */}
						<Container>
						<LinkContainer to='/'>
								<Navbar.Brand>Foo Amazon Clone</Navbar.Brand>
							</LinkContainer>
						<Nav className ="me-auto">
							<Link to = "/cart" className="nav-link">
								Cart	
								{cart.cartItems.length >0 && (
									<Badge pill bg="danger">
										{cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
									</Badge>
								)}
							</Link>
						</Nav>							
						</Container>
					</Navbar>
					{/* <Link to='/'>Amazon Clone</Link> */}
				</header>
				<main>
					<Container className = "mt-3">
						<Routes>
							<Route path='/product/:slug' element={<ProductScreen />} />
							<Route path='/cart' element={<CartScreen />} />
							<Route path='/signin' element={<SignInScreen />} />
							<Route path='/' element={<HomeScreen />} />
						</Routes>
					</Container>
				</main>
				<footer>
					<div className='text-center'>All rights reserved</div>
				</footer>
			</div>
		</BrowserRouter>
	);
};

export default App;
