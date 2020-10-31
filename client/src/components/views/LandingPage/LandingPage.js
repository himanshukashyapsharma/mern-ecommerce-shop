import React, {useEffect, useState} from 'react'
import Axios from "axios"
import {Link} from 'react-router-dom'
import {Icon,Row,Col,Card} from "antd"
import ImageSlider from "../../utils/ImageSlider"
import CheckBox from "./Sections/CheckBox"
import RadioBox from "./Sections/RadioBox"
import {continent, price} from "./Sections/data"
import SearchFeature from "./Sections/SearchFeature"

const {Meta} = Card

function LandingPage() {

    const [Products,setProducts] = useState([])
    const [Skip,setSkip] = useState(0)
    const [Limit,setLimit] = useState(4)
    const [PostSize, setPostSize] = useState(0)
    const [Filters, setFilters] = useState({
        continent: [],
        price: []
    })
    const [SearchTerms, setSearchTerms] = useState()
    
    useEffect(() => {
        const variables = {
            skip: Skip,
            limit: Limit
        }
        getProducts(variables)
    },[])

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
        newFilters[category] = filters

        if(category == "price"){
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
        <div style={{width: '75%',margin: '3rem auto'}}>
            <div style={{textAlign: 'center'}}>
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


            <div style={{display: 'flex', justifyContent: 'flex-end', margin: '1rem auto'}}>
                <SearchFeature
                    refreshFunction={updateSearchTerm}
                 />
            </div>
            

            {Products.length === 0 ?
            <div style={{display: 'flex', height: '300px',justifyContent: 'center',alignItems: 'center'}}>
                <h2>No Post yet...</h2>
            </div>:
            <div>
                <Row gutter={[16,16]}>
                    {Products.map((product,index)=>{
                        return <Link key={index} to={{pathname: `/product/${product._id}`}}>
                                    <Col key={index} lg={6} md={8} xs={24}>
                                        <Card
                                            hoverable={true}
                                            cover={<ImageSlider images={product.images} />}
                                        >
                                            <Meta
                                                title={product.title}
                                                description={`$${product.price}`}></Meta>
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
                <button
                    onClick={onLoadMore}
                >Load More</button>
            </div>
            }
        </div>
    )
}

export default LandingPage
