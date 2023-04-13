import React, { useContext, useReducer, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Form from 'react-bootstrap/Form'
import {Store} from '../Store'
import Button from 'react-bootstrap/esm/Button'
import { toast } from 'react-toastify'

const reducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_REQUEST':
            return {...state, loadingUpdate: true};
        case 'UPDATE_SUCCESS':
            return {...state, loadingUpdate: false};
        case 'UPDATE_FAIL':
            return {...state, loadingUpdate: false};

        default:
            return state;
    }
}

const ProfileScreen = () => {
    const {state, dispatch: ctxDispatch} = useContext(Store)
    const {userInfo} = state
    const [name, setName] = useState(userInfo.name)
    const [email, setEmail] = useState(userInfo.name)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [{loadingUpdate}, dispatch]= useReducer(reducer, {
        loadingUpdate: false,
    })

    const submitHandler = async (e) => {
        e.preventDefault(); 
        console.log("entered submitHandler")
        if (password !== confirmPassword){
            toast.error('Passwords do not match')
            return;
        }
        try {
            console.log('attempting fetch...')

            // http://localhost:5000/api/users/profile for local server
            const response = await fetch("http://localhost:5000/api/users/profile", {
            method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        'authorization': `Bearer ${userInfo.token}`
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                    }),
                })
                if (response.ok){
                dispatch({type: 'UPDATE_SUCCESS,'})
                const data = await response.json(); //this means we got the response successfuly
                console.log("The response received was ...");
                console.log(data);
                ctxDispatch({type: 'USER_SIGNIN', payload: data});
               
                localStorage.setItem('userInfo', JSON.stringify(data))
                toast.success('User updated successfully')

                } else {
                    const result = await response.json();
                    //alert('Invalid email or password')
                    console.log(result)
                    toast.error(result.message)
                    console.log(result.message)
                    dispatch({type: 'FETCH_FAIL'})
                }
    
        } catch (error) {
            dispatch({
                type: 'FETCH_FAIL'
            })
            toast.error(error)
        }
    }

  return (
    <div className="container small-container">
    <Helmet>
        <title>User Profile</title>
        </Helmet>
        <h1 className = "my-3">User Profile</h1>
        <form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
                <Form.Label>email</Form.Label>
                <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
                <Form.Label>Password</Form.Label>
                <Form.Control
                type = "password"
                onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                type = "password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </Form.Group>
            <div className="mb-3">
                <Button type= "submit">Update</Button>
            </div>
        </form>
  </div>
  )
}

export default ProfileScreen