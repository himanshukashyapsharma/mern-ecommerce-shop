import React,{useState,useEffect} from 'react'
import {Row,Col} from "antd"
import ProductImage from './Sections/ProductImage'
import ProductInfo from './Sections/ProductInfo'
import Axios from 'axios'
import {addToCart} from '../../../_actions/user_actions'
import {useDispatch} from 'react-redux'


function DetailedProductPage(props) {

    const dispatch = useDispatch()
    const [Product, setProduct] = useState()
    const productId = props.match.params.productId

    useEffect(() => {
        console.log(Product)
        Axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
        .then(response =>{
            if(response.data.success){
                setProduct(response.data.product)
            }else{
                alert('failed to fetch product data')
            }
        })
    
    },[])

    const addToCartHandler = (productId) => {
        dispatch(addToCart(productId))
    }

    return (
        <React.Fragment>
            {Product !== undefined && 
                <div className="postPage" style={{width: '100%', padding: '3rem 4rem'}}>   
                    <div style={{display: 'flex', justifyContent: 'center'}} >
                        <h1>{Product.title}</h1>
                     </div>
                    <br />
                    <Row gutter={[16,16]}>
                        <Col lg={12} xs={24}>
                            <ProductImage detail={Product} />
                        </Col>
                        <Col lg={12} xs={24}>
                            <ProductInfo detail={Product} 
                                addToCartHandler={addToCartHandler}
                            />
                        </Col>
                    </Row>
                </div>
            }
        </React.Fragment>
        
    )
}

export default DetailedProductPage
