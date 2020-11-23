import React, {useEffect, useState} from 'react'
import Axios from "axios"
import {Link} from 'react-router-dom'
import {Icon,Row,Col,Card,Button} from "antd"
import ImageSlider from "../../utils/ImageSlider"
import CheckBox from "./Sections/CheckBox"
import RadioBox from "./Sections/RadioBox"
import {continent, price} from "./Sections/data"
import SearchFeature from "./Sections/SearchFeature"

const {Meta} = Card

function LandingPage() {

    const [Products,setProducts] = useState([])
    const [Skip,setSkip] = useState(0)
    const [Limit] = useState(8)
    const [PostSize, setPostSize] = useState(0)
    const [Filters, setFilters] = useState({
        continent: [],
        price: []
    })
    const [SearchTerms, setSearchTerms] = useState()

    const customCardStyle = {
        boxShadow: "2px 2px 5px #E8E8E8",
        maxWidth: "247px",
        margin: '0 auto'
    }
    
    useEffect(() => {
        const variables = {
            skip: Skip,
            limit: Limit
        }
        getProducts(variables)
    },[Skip,Limit])

    function getProducts(variables,loadMore = false){
        Axios.post('/api/product/getProducts', variables)
        .then(response =>{
            if(response.data.success){
                if(loadMore){
                    setProducts(Products => [...Products, ...response.data.products])
                } else {
                    setProducts(response.data.products)
                }
                
                setPostSize(response.data.postSize)
            }else{
                alert('failed to fetch product data')
            }
        })
    }

    function onLoadMore(){
        let skip = Skip + Limit
        const variables = {
            skip: skip,
            limit: Limit
        }
        let loadMore = true
        getProducts(variables,loadMore)
        setSkip(skip)
    }

    function showFilteredResults(filters){

        const variables = {
            skip: 0,
            limit: Limit,
            filters: filters
        }
        getProducts(variables)
        setSkip(0)
    }

    function handlePrice(value){
        const data = price;
        let array = []

        for(let key in data){
            if(data[key]._id === parseInt(value, 10)){
                array = data[key].array
            }
        }
        return array
    }

    function handleFilters(filters, category){
        const newFilters = {...Filters}

        if(category === "continent"){
            newFilters[category] = filters
        }

        if(category === "price"){
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues
        }
        showFilteredResults(newFilters)
        setFilters(newFilters)      
    }

    function updateSearchTerm(newSearchTerm){
        
        const variables = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm
        }
        
        setSkip(0)
        setSearchTerms(newSearchTerm)
        getProducts(variables)
    }
    
    return (
        <div style={{width: '100%',margin: '0 auto'}}>

            <div style={{backgroundColor: "#F3EED9", margin: '0 auto', padding: '0 12.5%'}}>

                <div style={{textAlign: 'center', padding: '32px 0 0 16px'}}>
                    <h2>Let's Travel The World <Icon type="rocket" /></h2>
                </div>
                <Row gutter={[16,16]}>
                    <Col lg={12} xs={24}>
                        <CheckBox 
                        list={continent}
                        handleFilters={filters => handleFilters(filters, "continent")}/>
                    </Col>
                    <Col lg={12} xs={24}>
                        <RadioBox 
                        list={price}
                        handleFilters={filters => handleFilters(filters, "price")}/>
                    </Col>
                </Row>

                <div style={{display: 'flex', justifyContent: 'flex-end', margin: '1rem auto',backgroundColor: "#F3EED9",paddingBottom: "16px"}}>
                    <SearchFeature
                        refreshFunction={updateSearchTerm}
                    />
                </div>
            </div>
            

            {Products.length === 0 ?
            <div style={{display: 'flex',width: '75%', height: '300px',justifyContent: 'center',alignItems: 'center',margin: '0 auto'}}>
                <h2>No Post yet...</h2>
            </div>:
            <div style={{width: '75%', margin: '0 auto'}}>
                <Row gutter={[8,24]} justify="center">
                    {Products.map((product,index)=>{
                        return <Link key={index} to={{pathname: `/product/${product._id}`}}>
                                    <Col key={index} xl={6} lg={8} md={12} sm={12} xs={24}>
                                        <Card
                                            style={customCardStyle}
                                            hoverable={true}
                                            cover={<ImageSlider images={product.images} />}
                                        >
                                            <Meta
                                                title={product.title}
                                                description={`$${product.price}`}
                                            >
                                            </Meta>
                                            <Button style={{float: "right" ,backgroundColor:"#ff4d4f",borderColor:"#ff4d4f"}} type="primary" shape="round">View</Button>
                                        </Card>
                                    </Col>
                                </Link>
                    })}
                </Row>
            </div>
            }
            <br />
            <br />
            {
            PostSize >= Limit &&
            <div style={{display: 'flex',justifyContent: 'center'}}>
                <Button style={{backgroundColor:"#ff4d4f",borderColor:"#ff4d4f"}} type="primary" shape="round"
                    onClick={onLoadMore}
                >Load More</Button>
            </div>
            }
        </div>
    )
}

export default LandingPage
