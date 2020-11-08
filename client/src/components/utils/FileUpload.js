import React,{useState} from "react"
import Dropzone from "react-dropzone"
import Axios from "axios"
// import {Icon} from "antd"

function FileUpload(props) {

    const [images,setImages] = useState([])

    function onDrop(files){
        let formData = new FormData()
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append("file",files[0])

        Axios.post('/api/product/uploadImage',formData ,config)
        .then(response => {
            if(response.data.success){
                setImages([...images, response.data.image])
                props.refreshFunction([...images, response.data.image])

            }else{
                alert('Failed to save the Image in Server')
            }
        })
    }

    function onDelete(index){
        setImages(images.filter((image,i) => i !== index))
        props.refreshFunction(images.filter((image,i) => i !== index)) 
    }

    return (
        <div style={{display: 'flex'}}>
            <Dropzone
                onDrop={onDrop}
                multiple={false}
                maxSize={8000000000}
            >
            {({getRootProps,getInputProps}) => (
                <div style={{
                    display: 'flex', width: '300px',height: '240px',
                    border: '1px solid lightgrey', justifyContent: 'center', alignItems: 'center'
                    }}{...getRootProps()}>
                    <input {...getInputProps()}/>
                    <p>add images here</p>
                </div>
            )}
            </Dropzone>
            
            <div style={{display: 'flex',width: '300px',height: '240px', overflowX: 'scroll'}}>
                {images.map((image,index) => (
                    <div key={index} onClick={()=> onDelete(index)}>
                        <img style={{winWidth: '300px',width: '300px',height: '240px' }} src={`https://mern-ecommerce-shop.herokuapp.com/${image}`} alt={`${index}`} />
                    </div>
                )
                )}
            </div>

        </div>
    )
}

export default FileUpload