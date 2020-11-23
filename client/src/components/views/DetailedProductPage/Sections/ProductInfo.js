import React from 'react'
import {Button, Descriptions} from 'antd'
import '../detailedProductPage.css' 

function ProductInfo(props) {

    return (
        <div className="product-info">
            <Descriptions title={props.detail.title}>
                <Descriptions.Item label="Price">{props.detail.price} $</Descriptions.Item>
                <Descriptions.Item label="Sold">{props.detail.sold}</Descriptions.Item>
                <Descriptions.Item label="Views">{props.detail.views}</Descriptions.Item>
                <Descriptions.Item label="Description">{props.detail.description}</Descriptions.Item>
            </Descriptions>
                <br />
                <br />
                <br />
                <div style={{display: 'flex', justifyContent: 'flex-end', borderRadius: '0px 0px 10px 10px', padding: '20px'}}>
                    <Button size="large" shape="round" type="danger"
                        onClick={() => {props.addToCartHandler(props.detail._id)}}
                    >
                        Add to Cart
                    </Button>
                </div>
        </div>
    )
}

export default ProductInfo
