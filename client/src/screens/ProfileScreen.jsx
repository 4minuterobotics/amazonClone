import React, { useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import PageAnimation from '../components/PageAnimation';

const reducer = (state, action) => {
	switch (action.type) {
		case 'UPDATE_REQUEST':
			return { ...state, loadingUpdate: true };
		case 'UPDATE_SUCCESS':
			return { ...state, loadingUpdate: false };
		case 'UPDATE_FAIL':
			return { ...state, loadingUpdate: false };

		default:
			return state;
	}
};

const ProfileScreen = () => {
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { userInfo } = state;
	const [name, setName] = useState(userInfo.name);
	const [email, setEmail] = useState(userInfo.email);
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
		loadingUpdate: false,
	});

	const submitHandler = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			toast.error('Passwords do not match');
			return;
		}
		try {
			dispatch({ type: 'UPDATE_REQUEST' });
			console.log('editing user profile');
			const requestOptions = {
				method: 'PUT',
				headers: { Authorization: `Bearer ${userInfo.token}` },
				body: JSON.stringify({
					name: name,
					email: email,
					password: password,
				}),
			};
			console.log(requestOptions.body);
			// http://localhost:5000/api/users/profile for local server
			// https://amazon-clone-1zgp.onrender.com/api/users/profile for remote server
			const response = await fetch(
				`${import.meta.env.VITE_APP_CURRENT_SERVER}/api/users/profile`,
				requestOptions
			);

			//if there's a response back....
			if (response.ok) {
				console.log('got something back from fetch');
				const result = await response.json(); //save the response (our posts) as 'result'
				console.log(`we got back the following: ${result}`);
				dispatch({ type: 'UPDATE_SUCCESS' });
				console.log(result);

				ctxDispatch({ type: 'USER_SIGNIN', payload: result });
				localStorage.setItem('userInfo', JSON.stringify(result));
				toast.success('User updated successfully');
			}
		} catch (error) {
			toast.error(error);
			console.log('got nothing back from fetch');
			console.log(error);
			dispatch({ type: 'FETCH_FAIL' });
		}
	};

	return (
		<PageAnimation>
			<div className="container small-container">
				<Helmet>
					<title>User Profile</title>
				</Helmet>
				<h1 className="my-3">User Profile</h1>
				<form onSubmit={submitHandler}>
					<Form.Group
						className="mb-3"
						controlId="name"
					>
						<Form.Label>Name</Form.Label>
						<Form.Control
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</Form.Group>
					<Form.Group
						className="mb-3"
						controlId="name"
					>
						<Form.Label>Email</Form.Label>
						<Form.Control
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</Form.Group>
					<Form.Group
						className="mb-3"
						controlId="password"
					>
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							onChange={(e) => setPassword(e.target.value)}
						/>
					</Form.Group>
					<Form.Group
						className="mb-3"
						controlId="password"
					>
						<Form.Label>Confirm Password</Form.Label>
						<Form.Control
							type="password"
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</Form.Group>
					<div className="mb-3">
						<Button type="submit">Update</Button>
					</div>
				</form>
			</div>
		</PageAnimation>
	);
};

export default ProfileScreen;
