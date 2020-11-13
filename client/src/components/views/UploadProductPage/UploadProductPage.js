import React,{useState} from "react"
import {Typography,Button,Form,Input} from "antd"
import FileUpload from "../../utils/FileUpload"
import Axios from "axios"

const {Title} = Typography
const {TextArea} = Input

const Continents = [
    {key:1, value: "Africa"},
    {key:2, value: "Europe"},
    {key:3, value: "Asia"},
    {key:4, value: "North America"},
    {key:5, value: "South America"},
    {key:6, value: "Australia"},
    {key:7, value: "Antarctica"}
]

function UploadProductPage(props){
    
    const [titleValue,setTitleValue] = useState("")
    const [descriptionValue,setDescriptionValue] = useState("")
    const [priceValue,setPriceValue] = useState(0)
    const [continentValue,setContinentValue] = useState(1)
    const [images,setImages] = useState()  // used to show images on client side only while uploading product
    const [imagesName, setImagesName] = useState() // name goes to database


    function onTitleChange (event){
        setTitleValue(event.target.value)
    }
    
    function onDescriptionChange(event){
        setDescriptionValue(event.target.value)
    }

    function onPriceChange(event){
        setPriceValue(event.target.value)
    }

    function onContinentSelectChange(event){
        setContinentValue(event.target.value)
    }

    function updateImages(newImages){
        setImages(newImages)
    }

    function updateImagesName(newImagesName){
        setImagesName(newImagesName)
    }

    function onSubmit(event){
        event.preventDefault()

        if(!titleValue || !descriptionValue || !priceValue ||
            !continentValue || !images) return alert('fields cannot be empty!')

        const variables = {
            writer: props.user.userData._id,
            title: titleValue,
            description: descriptionValue,
            price: priceValue,
            images: imagesName,
            continents: continentValue
         }

        Axios.post('/api/product/uploadProduct',variables)
        .then(response => {
            if(response.data.success){
                alert("Product Successfully Uploaded")
                props.history.push('/') // part of react router - loads page at route '/'

            }else{
                alert('Failed to upload Product')
            }

        })
    }
    
    
    return (
        <div style={{maxWidth: "700px", margin: "2rem auto"}}>
            <div style={{ textAlign: "center", marginBottom:"2rem"}}>
                <Title level={2}>Upload Travel Product</Title>
            </div>
            <Form onSubmit={onSubmit}>
                {/*Dropzone */}
                <FileUpload refreshFunction={updateImages} nameRefreshFunction={updateImagesName}/><br /><br />
                <label>Title</label><br /><br />
                <Input 
                    onChange={onTitleChange}
                    value={titleValue}
                /><br /><br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={descriptionValue}
                 /><br /><br />
                 <label>Price($)</label>
                 <Input
                    onChange={onPriceChange}
                    value={priceValue}
                 type="number"
                 />
                 <select onChange={onContinentSelectChange}>
                    {Continents.map(item => (<option key={item.key} value={item.key}>{item.value}</option>))}
                 </select><br /><br />
                 <Button onClick={onSubmit}
                 >
                     Submit
                 </Button>
            </Form>            
        </div>
    )
}

export default UploadProductPage