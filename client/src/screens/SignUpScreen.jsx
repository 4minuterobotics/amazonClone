import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import PageAnimation from '../components/PageAnimation';
import { toast } from 'react-toastify';

const SignUpScreen = () => {
	const navigate = useNavigate();
	const { search } = useLocation();
	const redirectInUrl = new URLSearchParams(search).get('redirect');
	const redirect = redirectInUrl ? redirectInUrl : '/';

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { userInfo } = state;

	const submitHandler = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			toast.error('Passwords do not match');
			return;
		}
		try {
			// http://localhost:5000/api/users/signup for local server
			// https://amazon-clone-1zgp.onrender.com/api/users/signup for remote server
			const response = await fetch(
				`${import.meta.env.VITE_APP_CURRENT_SERVER}/api/users/signup`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: name,
						email: email,
						password: password,
					}),
				}
			);
			if (response.ok) {
				const data = await response.json(); //this means we got the response successfuly
				console.log('The response received by handle submit was ...');
				console.log(data);

				ctxDispatch({ type: 'USER_SIGNIN', payload: data });
				localStorage.setItem('userInfo', JSON.stringify(data));
				navigate(redirect || '/');
			} else {
				const result = await response.json();
				//alert('Invalid email or password')
				console.log(result);
				toast.error(result.message);

				console.log(result.message);
			}
		} catch (err) {
			console.log('the error was');
			console.log(err);
		}
	};

	//this useEffect will prevent me from seeing the sign in page if i'm aleady logged in
	useEffect(() => {
		if (userInfo) {
			navigate(redirect);
		}
	}, [navigate, redirect, userInfo]);

	return (
		<Container className="small-container">
			<Helmet>
				<title>Sign Up</title>
			</Helmet>
			<PageAnimation>
				<h1 className="my-3">Sign Up</h1>
				<Form onSubmit={submitHandler}>
					<Form.Group
						className="mb-3"
						controlId="name"
					>
						<Form.Label>Name</Form.Label>
						<Form.Control
							required
							onChange={(e) => setName(e.target.value)}
						/>
					</Form.Group>
					<Form.Group
						className="mb-3"
						controlId="email"
					>
						<Form.Label>Email</Form.Label>
						<Form.Control
							type="email"
							required
							onChange={(e) => setEmail(e.target.value)}
						/>
					</Form.Group>
					<Form.Group
						className="mb-3"
						controlId="password"
					>
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							required
							onChange={(e) => setPassword(e.target.value)}
						/>
					</Form.Group>
					<Form.Group
						className="mb-3"
						controlId="confirmPassword"
					>
						<Form.Label>Confirm Password</Form.Label>
						<Form.Control
							type="password"
							required
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</Form.Group>
					<div className="mb-3">
						<Button type="submit">Sign Up</Button>
					</div>
					<div className="mb-3">
						Already have an account?{' '}
						<Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
					</div>
				</Form>
			</PageAnimation>
		</Container>
	);
};

export default SignUpScreen;
