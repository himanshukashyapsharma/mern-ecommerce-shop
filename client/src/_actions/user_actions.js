import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART_USER,
    GET_CART_ITEMS_USER,
    REMOVE_CART_ITEM_USER,
    ON_SUCCESS_BUY_USER
} from './types';
import { USER_SERVER } from '../components/Config.js';

export function registerUser(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/register`,dataToSubmit)
        .then(response => response.data);
    
    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function loginUser(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/login`,dataToSubmit)
                .then(response => response.data);

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function auth(){
    const request = axios.get(`${USER_SERVER}/auth`)
    .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser(){
    const request = axios.get(`${USER_SERVER}/logout`)
    .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }
}


// Add an item to cart

export function addToCart(_id){
    const request = axios.post(`${USER_SERVER}/addToCart?productId=${_id}&type=single`)
    .then(response => response.data)

    return {
        type: ADD_TO_CART_USER,
        payload: request 
    }
}

// Remove an item from cart

export function removeFromCart(_id){
    const request = axios.get(`${USER_SERVER}/removeFromCart?productId=${_id}`)
    .then(response => {
        response.data.cart.forEach(item => {
            response.data.product.forEach((productItem,i) => {
                if(item.id == productItem._id){
                    response.data.product[i].quantity = item.quantity
                }
            })
        })
        return response.data
    })

    return {
        type: REMOVE_CART_ITEM_USER,
        payload: request
    }

}

export function getCartItems(cartItemIds, userCart){
    const request = axios.get(`/api/product/products_by_id?id=${cartItemIds}&type=array`)
    .then(response => {
        
        userCart.forEach(cartItem => {                               
            response.data.product.forEach((productDetail,i) => {              
                if(cartItem.id === productDetail._id){
                    response.data.product[i].quantity = cartItem.quantity
                }
            })
        })
        return response.data.product
    })



    return {
        type: GET_CART_ITEMS_USER,
        payload: request
    }
}

export function onSuccessBuy(data){
    return {
        type: ON_SUCCESS_BUY_USER,
        payload: data
    }
}