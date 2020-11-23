import React from "react"
import {Carousel} from "antd"

function ImageSlider({images}){
    return (
        <div>
            <Carousel autoplay>
                {images.map((image,index)=> (
                    <div key={index}>
                        <img style={{width: '100%',maxHeight: '140px'}} src={`https://mern-ecommerce-shop.herokuapp.com/uploads/thumbnail_${image}`} alt="ProductImage" />
                    </div>
                ))

                }
            </Carousel>
        </div>
    )
}

export default ImageSlider