import React from 'react'

function UserCardBlock(props) {
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Product Image</th>
                        <th>Product Quantity</th>
                        <th>Product Price</th>
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
                                                    alt="product image"
                                                    src={`http://localhost:5000/${item.images[0]}`} 
                                                />
                                            </td>
                                            <td>{item.quantity}</td>
                                            <td>{item.price}$</td>
                                            <td><button>Remove</button></td>
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
