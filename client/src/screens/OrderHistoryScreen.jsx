import React, { useContext, useEffect, useReducer } from 'react'
import Button from 'react-bootstrap/esm/Button'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { Store } from '../Store'

const reducer = (state, action) => { 
    switch(action.type){
        case 'FETCH_REQUEST':
            return { ...state, loading: true};
        case 'FETCH_SUCCESS':
            return{...state, orders: action.payload, loading: false};
        case 'FETCH_FAIL': 
            return {...state, loading: false, error: action.payload};
        default:
            return state;
    }
};

const OrderHistoryScreen = () => {
    const {state} = useContext(Store);
    const {userInfo} = state;
    const navigate = useNavigate();

    const [{ loading, error, orders}, dispatch] = useReducer (reducer,{
        loading: true,
        error: '',
    })

    useEffect(() => {
        console.log("outside of order history try")

        const fetchData = async () =>{
            dispatch({type: 'FETCH_REQUEST'});
            {
                try {
                    console.log("inside of order history try")

                    // http://localhost:5000/api/orders/mine for local server
                    const response = await fetch(`http://localhost:5000/api/orders/mine`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': `Bearer ${userInfo.token}`,
                        },
                    });
    
                    //if there's a response back....
                    if (response){
                        console.log('got something back from fetch');
                        const data = await response.json(); //save the response (our posts) as 'result'
                        console.log(`we got back the following: ${data}`);
                    
    
                        if (response.ok) {
                            dispatch({ type: 'FETCH_SUCCESS', payload: data });
                            console.log(data);
                        }
                        else if (!response.ok){
                            dispatch({ type: 'FETCH_FAIL', payload: data });
                            console.log('retrieved some bulljive from fetch response')
                            console.log(data)
                        }
                    } 
                } catch (err) {
                    dispatch({ type: 'FETCH_FAIL', payload: err});
                    alert(err);
                    console.log('got no response back from fetch');
                    console.log(err);
                }
            }
        };
        fetchData();
    }, [userInfo]);

  return (
    <div>
        <Helmet>
            <title>Order History</title>
        </Helmet>
        <h1>Order History</h1>
        {loading ? (
            <LoadingBox></LoadingBox>
        ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
        ) : (
            <table className="table">
                <thread>
                    <tr>
                        <th>ID</th>
                        <th>DATE</th>
                        <th>TOTAL</th>
                        <th>PAID</th>
                        <th>DELIVERED</th>
                        <th>ACTIONS</th>  
                    </tr>
                </thread>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order._id}</td>
                            <td>{order.createdAt.substring(0, 10)}</td>
                            <td>{order.totalPrice.toFixed(2)}</td>
                            <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                            <td>{order.idDelivered ? order.deliveredAt.substring(0, 10) : 'No'}</td>
                            <td>
                                <Button 
                                    type= "button"
                                    variant= "light"
                                    onClick={() => {
                                        navigate(`/orders/${order._id}`);
                                    }}
                                        >Details
                                    </Button>    
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
  )
}

export default OrderHistoryScreen