import React,{useState,useEffect} from 'react'
import ImageGallery from 'react-image-gallery'


function ProductImage(props) {

    const [Images,setImages] = useState([])

    useEffect(() => {
        if(props.detail.images && props.detail.images.length > 0){
            const images = []
    
            props.detail.images.map((image) => {
                return (
                    images.push({
                        original: `https://mern-ecommerce-shop.herokuapp.com/uploads/${image}`,
                        thumbnail: `https://mern-ecommerce-shop.herokuapp.com/uploads/thumbnail_${image}`
                      })
                )
                
            })
            setImages(images)
        }  
    },[props.detail.images])
    

    return (
        <div>
            <ImageGallery items={Images}/>
        </div>
    )
}

export default ProductImage
