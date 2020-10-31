import React,{useState,useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {getCartItems} from '../../../_actions/user_actions'
import UserCardBlock from './Sections/UserCardBlock'
import {Result,Empty} from 'antd'

function CartPage(props) {

    const [Total,setTotal] = useState(0)
    const dispatch = useDispatch()

    // to fetch data of all the items in cart
    useEffect(() => {

        let cartItems = []
        if(props.user.userData && props.user.userData.cart){
            if(props.user.userData.cart.length > 0){
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id)
                });
            dispatch(getCartItems(cartItems,props.user.userData.cart))
            }
        }
    },[props.user.userData])

    useEffect(() => {
        if(props.user.cartDetail && props.user.cartDetail.length > 0) {
            calculateTotal(props.user.cartDetail)   
        } 
    },[props.user.cartDetail])

    function calculateTotal(cartDetail){
        let total = 0
        cartDetail.forEach((item,index) => {
            console.log(index, item.price)
            total += item.price * item.quantity
        })
        setTotal(total)
    }

    return (
        <div style={{widht: '85%', margin: '3rem auto'}}>
            <h1>My Cart</h1>
            <div>
                {props.user.cartDetail && props.user.cartDetail.length > 0 &&
                    <UserCardBlock 
                        cartItems={props.user.cartDetail}
                    />
                }
                <div style={{marginTop: '3rem'}}>
                    <h2>Total amount: {Total}$</h2>
                </div>

                <Result 
                    status="success" 
                    title="Successfully Purchased Items"
                />

                <div style={{
                    width: '100%', display: 'flex', flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <br/>
                    <Empty description={false}/>
                    <p>No Items In The Cart</p>
                </div>


                 

            </div>
        </div>
    )
}

export default CartPage
