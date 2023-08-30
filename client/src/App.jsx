import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify'
import logo from './assets/logo.png'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { LinkContainer } from 'react-router-bootstrap';
import { Store } from './Store';
import PageLoadingScreen from './components/PageLoadingScreen';
import SearchBox from './components/SearchBox';

//Imports for non lazy loading screens
// import HomeScreen from './screens/HomeScreen';
// import ProductScreen from './screens/ProductScreen';
// import CartScreen from './screens/CartScreen';
// import SignInScreen from './screens/SignInScreen';
// import ShippingAddressScreen from './screens/ShippingAddressScreen';
// import SignUpScreen from './screens/SignUpScreen';
// import PaymentMethodScreen from './screens/PaymentMethodScreen';
// import PlaceOrderScreen from './screens/PlaceOrderScreen';
// import OrderScreen from './screens/OrderScreen';
// import OrderHistoryScreen from './screens/OrderHistoryScreen';
// import ProfileScreen from './components/ProfileScreen';
// import SearchScreen from './screens/SearchScreen';

//Imports for lazy loading screens
const LazyHomeScreen = React.lazy(()=> import ('./screens/HomeScreen'))
const LazyProductScreen = React.lazy(()=> import ('./screens/ProductScreen'))
const LazyCartScreen = React.lazy(()=> import ('./screens/CartScreen'))
const LazySignInScreen = React.lazy(()=> import ('./screens/SignInScreen'))
const LazyShippingAddressScreen = React.lazy(()=> import ('./screens/ShippingAddressScreen'))
const LazySignUpScreen = React.lazy(()=> import ('./screens/SignUpScreen'))
const LazyPaymentMethodScreen = React.lazy(()=> import ('./screens/PaymentMethodScreen'))
const LazyPlaceOrderScreen = React.lazy(()=> import ('./screens/PlaceOrderScreen'))
const LazyOrderScreen = React.lazy(()=> import ('./screens/OrderScreen'))
const LazyOrderHistoryScreen = React.lazy(()=> import ('./screens/OrderHistoryScreen'))
const LazyProfileScreen = React.lazy(()=> import ('./screens/ProfileScreen'))
const LazySearchScreen = React.lazy(()=> import ('./screens/SearchScreen'))

const App = () => {
	const {state, dispatch: ctxDispatch} = useContext(Store);	
	const {cart, userInfo}=state;

	const signoutHandler = ()=>{
		ctxDispatch({type: 'USER_SIGNOUT'})
		localStorage.removeItem('userInfo')
		localStorage.removeItem('shippingAddress')
		localStorage.removeItem('paymentMethod')
		localStorage.removeItem('cartItems')
		window.location.href = '/signin';
	}

	const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		const fetchCategories = async () => {
		try {
			// const { data } = await axios.get(`/api/products/categories`);
			// setCategories(data);

			console.log("fetching categories") 

				// http://localhost:5000/api/products/categories for local server
				// https://amazon-clone-1zgp.onrender.com/api/products/categories for remote server
				const response = await fetch('https://amazon-clone-1zgp.onrender.com/api/products/categories', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				//if there's a response back....
				if (response.ok) {
					const result = await response.json(); //save the response (our posts) as 'result'
					console.log(`we got back the following: ${result}`);
					console.log(result);
					setCategories(result)
				}


		} catch (err) {
			toast.error(err);
		}
		};
		fetchCategories();
	}, []);


	return (
		<BrowserRouter>
			<div className={ sidebarIsOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        		}
      	>
				<ToastContainer position ="bottom-center" limit={1}/>
				<header>
					<Navbar bg='dark' variant='dark' expand="lg">
						{/* container is the bootstrap styled component to make stuff appear on 1 line. */}
						<Container>
						<Button
                			variant="dark"
                			onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              			>
                			<i className="fas fa-bars"></i>
              			</Button>
							<LinkContainer to='/'>
								<Navbar.Brand>
									<img
									alt=""
									src={logo}
									width="30"
									height="30"
									className="d-inline-block align-top"
									/>
									{' '}Shop at Will's
								</Navbar.Brand>
							</LinkContainer>
							<Navbar.Toggle aria-controls="basic-navbar-nav" />
							<Navbar.Collapse id="basic-navbar-nav">
								<SearchBox />
								<Nav className ="me-auto w-100 justify-content-end">
									<Link to = "/cart" className="nav-link">
										Cart	
										{cart.cartItems.length >0 && (
											<Badge pill bg="danger">
												{cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
											</Badge>
										)}
									</Link>
									{userInfo ? (
										<NavDropdown title={userInfo.name} id="basic-nav-dropdown">
											<LinkContainer to="/profile">
												<NavDropdown.Item>User Profile</NavDropdown.Item>
											</LinkContainer>
											<LinkContainer to="/orderhistory">
												<NavDropdown.Item>Order History</NavDropdown.Item>
											</LinkContainer>
											<NavDropdown.Divider />
											<Link 
												className="dropdown-item"
												to="#signout"
												onClick={signoutHandler}
											>
												Sign Out
											</Link>
										</NavDropdown>
									):(
										<Link className ="nav-link" to="/signin">
										Sign In
										</Link>
									)}
								</Nav>		
							</Navbar.Collapse>			
						</Container>
					</Navbar>
					{/* <Link to='/'>Amazon Clone</Link> */}
				</header>
				<div
					className={
						sidebarIsOpen
						? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
						: 'side-navbar d-flex justify-content-between flex-wrap flex-column'
					}
					>
					<Nav className="flex-column text-white w-100 p-2">
						<Nav.Item>
						<strong>Categories</strong>
						</Nav.Item>
						{categories.map((category) => (
						<Nav.Item key={category}>
							<LinkContainer
							to={{pathname: '/search', search: `category=${category}`}}
							onClick={() => setSidebarIsOpen(false)}
							>
							<Nav.Link>{category}</Nav.Link>
							</LinkContainer>
						</Nav.Item>
						))}
					</Nav>
				</div>
				<main>
					<Container className = "mt-3">
						<Routes key={location.pathname} location={location}>

							<Route path="/product/:slug" element={<React.Suspense fallback= {<PageLoadingScreen/>} > <LazyProductScreen/> </React.Suspense>} />
							<Route path="/cart" element={<React.Suspense fallback= {<PageLoadingScreen/>} > <LazyCartScreen/> </React.Suspense>} />
							<Route path="/search" element={<React.Suspense fallback= {<PageLoadingScreen/>} > <LazySearchScreen/> </React.Suspense>} />
							<Route path="/signin" element={<React.Suspense fallback= {<PageLoadingScreen/>} > <LazySignInScreen/> </React.Suspense>} />
							<Route path="/signup" element={<React.Suspense fallback= {<PageLoadingScreen/>} > <LazySignUpScreen/> </React.Suspense>} />
							<Route path="/profile" element={<React.Suspense fallback= {<PageLoadingScreen/>} > <LazyProfileScreen/> </React.Suspense>} />
							<Route path="/shipping" element={<React.Suspense fallback= {<PageLoadingScreen/>} > <LazyShippingAddressScreen/> </React.Suspense>} />
							<Route path="/payment" element={<React.Suspense fallback= {<PageLoadingScreen/>} > <LazyPaymentMethodScreen/> </React.Suspense>} />
							<Route path="/placeorder" element={<React.Suspense fallback= {<PageLoadingScreen/>} > <LazyPlaceOrderScreen/> </React.Suspense>} />
							<Route path="/order/:id" element={<React.Suspense fallback= {<PageLoadingScreen/>} > <LazyOrderScreen/> </React.Suspense>} />
							<Route path="/orderhistory" element={<React.Suspense fallback= {<PageLoadingScreen/>} > <LazyOrderHistoryScreen/> </React.Suspense>} />
							<Route path="/" element={<React.Suspense fallback= {<PageLoadingScreen/>} > <LazyHomeScreen/> </React.Suspense>} />
							
							{/* non lazy loading Routing method */}
							{/* 
							<Route path='/product/:slug' element={<ProductScreen />} />
							<Route path='/cart' element={<CartScreen />} />
							<Route path='/search' element={<SearchScreen />} />
							<Route path='/signin' element={<SignInScreen />} />
							<Route path='/signup' element={<SignUpScreen />} />
							<Route path='/profile' element={<ProfileScreen />} />
							<Route path='/shipping' element={<ShippingAddressScreen />} />
							<Route path='/payment' element={<PaymentMethodScreen />} />
							<Route path='/placeorder' element={<PlaceOrderScreen />} />
							<Route path='/order/:id' element={<OrderScreen />} />
							<Route path='/orderhistory' element={<OrderHistoryScreen />} />
							<Route path='/' element={<HomeScreen />} /> */}
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
