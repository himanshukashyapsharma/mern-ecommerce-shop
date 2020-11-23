import React from 'react'
import {Button} from 'antd'

function UserCardBlock(props) {
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Location</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Remove from Cart</th>
                    </tr>
                        {props.cartItems && props.cartItems.length > 0 &&
                            props.cartItems.map((item,index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <tr key={item._id}>
                                            <td>
                                                <img 
                                                    style={{width: '70px'}} 
                                                    alt={`${item.title}`}
                                                    src={`https://mern-ecommerce-shop.herokuapp.com/uploads/thumbnail_${item.images[0]}`} 
                                                />
                                            </td>
                                            <td>{item.title}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.price}$</td>
                                            <td style={{textAlign: 'center'}}><Button 
                                                    onClick={() => { props.handleRemoveFromCart(item._id)}}
                                                    type="danger"
                                                >
                                                    Remove
                                                </Button>
                                            </td>
                                        </tr>
                                        
                                    </React.Fragment>
                                    
                        )
                    })
                
                }
                    
                </thead>
            </table>
        </div>
    )
}

export default UserCardBlock
