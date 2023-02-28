//useContext is a state manager for values that can be seen and/or manipulated on multiple pages
//It acts just like a use state, accepting a initial state, and an action to update the state.
//

import {createContext, useReducer} from 'react'

//"Store" is the name of the state/value and function whos props will be used throughout the website using useContext
export const Store = createContext();

//this objet will store state/value of the useContext state manager
const initialState= {
    cart:{
        cartItems: localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [],
    },
}

//this function updates the state/value of the "Store" useContext
function reducer(state, action) {
    switch(action.type){

        //when the  
        case 'CART_ADD_ITEM':
            // add to cart
            console.log("useContext dispatch code")

            //set newItem to the value of the product item that just came in.
            const newItem = action.payload;
            console.log(newItem)

            //check to see if the product item that just came in exists in the cart already by setting "existItem equal to the value of the cart item who's _id paramater is equal to newItem._id
            const existItem = state.cart.cartItems.find(
                (item) => item._id === newItem._id
            )
            
            //if this product exists in the cart already, use map function on the cart items to update the current item with the new item that we get from the action.payload (this will update the quantity value, etc)
            //if the product doesn't exist, add the newItem to the end of the array.
            const cartItems = existItem ? state.cart.cartItems.map((item) => item._id === existItem._id ? newItem : item) : [...state.cart.cartItems, newItem]
            console.log({...state, cart: {...state.cart, cartItems}});

            //save the cart in the local storage so when the page rereshes, its still there. 
            localStorage.setItem('cartItems', JSON.stringify(cartItems))
            return {...state, cart: {...state.cart, cartItems}
        }

            // ------------------------------------------

            case 'CART_REMOVE_ITEM':{
                const cartItems = state.cart.cartItems.filter(
                    (item) => item._id !== action.payload._id
                )

                //save the cart in the local storage
                localStorage.setItem('cartItems', JSON.stringify(cartItems))
                return {...state, cart: {...state.cart, cartItems}
            }
             }
            default:
                return state;
    }  
}


//this HOF is used in App.js to wrap the entire code, allowing for the prop to be passed anywhere.
export function StoreProvider(props){
    const [state, dispatch] = useReducer (reducer, initialState);
    const value = {state, dispatch};
    return<Store.Provider value={value}>{props.children}</Store.Provider>
}