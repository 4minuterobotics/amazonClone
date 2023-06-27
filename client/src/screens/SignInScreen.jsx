import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import { toast } from 'react-toastify';


const SignInScreen = () => {    
    console.log('signin screen starts here')

    const navigate=useNavigate();
    const {search} = useLocation();//sets a variable named "search"equal to the search key and value parameters in the long object contaning url info

    //this breaks down the key and values of search paramaters in a URL, then sets the variable "redirectInUrl" equal to the value of the "redirect" key inside the search parameters
    const redirectInUrl = new URLSearchParams(search).get('redirect') 

    //if such a key named 'redirect' exists in the search paramaters, set a new vaiable named 'redirect' equal to that value, otherwise, set 'redirect' to /
    const redirect = redirectInUrl ? redirectInUrl : '/'

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const {state, dispatch: ctxDispatch} = useContext(Store)
    const {userInfo} = state;

    const submitHandler = async(e) => {
        e.preventDefault();
        try{

            // http://localhost:5000/api/users/signin for local server
            // https://amazon-clone-1zgp.onrender.com/api/users/signin for remote server
            const response = await fetch("https://amazon-clone-1zgp.onrender.com/api/users/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            })
            if (response.ok){
            const data = await response.json(); //this means we got the response successfuly
            console.log("The response received by handle submit was ...");
            console.log(data);
            
            ctxDispatch({type: 'USER_SIGNIN', payload: data})
            localStorage.setItem('userInfo', JSON.stringify(data))
            navigate(redirect || '/')
            } else {
                const result = await response.json();
                //alert('Invalid email or password')
                toast.error(result.message)
                console.log(result)
                console.log(result.message)
            }
        } catch(err){
            console.log("the error was")
            console.log(err)
        }
    }

    //this useEffect will prevent me from seeing the sign in page if i'm aleady logged in
    useEffect(() => {
      if(userInfo){
        navigate(redirect)
      }
    }, [navigate, redirect, userInfo]);
    
    

  return (
   <Container className = "small-container">
        <Helmet>
            <title>Sign In</title></Helmet>
        <h1 className="my-3">Sign In</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" required     onChange={(e) => setEmail(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" required  onChange={(e) => setPassword(e.target.value)}/>
            </Form.Group>
            <div className="mb-3">
                <Button type="submit">Sign In</Button>
            </div>
            <div className="mb-3">New customer? {' '}
            <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
            </div>
        </Form>
   </Container>
  )
}

export default SignInScreen