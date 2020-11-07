import React,{useState,useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {getCartItems, removeFromCart, onSuccessBuy} from '../../../_actions/user_actions'
import UserCardBlock from './Sections/UserCardBlock'
import {Result,Empty} from 'antd'
import Paypal from '../../utils/Paypal'
import Axios from 'axios'

function CartPage(props) {

    const dispatch = useDispatch()

    const [Total,setTotal] = useState(0)
    const [ShowTotal, setShowTotal] = useState(false)
    const [ShowSuccess, setShowSuccess] = useState(false)

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
        } else {
            setTotal(0)
            setShowTotal(false)
        }
    },[props.user.cartDetail])

    function calculateTotal(cartDetail){
        let total = 0
        cartDetail.forEach((item,index) => {
            console.log(index, item.price)
            total += item.price * item.quantity
        })
        setTotal(total)
        setShowTotal(true)
    }

    function handleRemoveFromCart(productId){
        dispatch(removeFromCart(productId))
    }

    function transactionSuccess(data){

        let variables = {
            cartDetail: props.user.cartDetail,
            paymentData: data
        }

        Axios.post('/api/users/successBuy', variables)
        .then(response => {
            console.log(response.data)
            if(response.data.success){
                setShowSuccess(true)
                setShowTotal(false)

                dispatch(onSuccessBuy({
                    cart: response.data.cart,
                    cartDetail: response.data.cartDetail
                }))

            } else {
                alert('Failed to register Payment to Database')
            }
        })
    }

    function transactionError(){
        console.log('paypal error')
    }

    function transactionCancelled(){
        console.log('Transaction cancelled')
    }

    return (
        <div style={{width: '85%', margin: '3rem auto'}}>
            <h1>My Cart</h1>
            <div>
                {props.user.cartDetail && props.user.cartDetail.length > 0 &&
                    <UserCardBlock 
                        cartItems={props.user.cartDetail}
                        handleRemoveFromCart={handleRemoveFromCart}
                    />
                }
                
                {ShowTotal ?
                    <div style={{marginTop: '3rem'}}>
                        <h2>Total amount: {Total}$</h2>
                    </div>
                    :   
                    ShowSuccess ?
                        <Result 
                            status="success" 
                            title="Successfully Purchased Items"
                        /> 
                        :
                        <div style={{
                            width: '100%', display: 'flex', flexDirection: 'column',
                            justifyContent: 'center', textAlign: 'center'
                        }}>
                            <br/>
                            <Empty description={false}/>
                            <p>No Items In The Cart</p>
                        </div>
                }

            </div>

            { ShowTotal && 
                <Paypal
                    toPay={Total}
                    onSuccess={transactionSuccess}
                    transactionError={transactionError}
                    transactionCancelled={transactionCancelled}
                />
            }
            

        </div>
    )
}

export default CartPage
