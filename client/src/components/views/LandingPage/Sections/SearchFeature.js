import React,{useState} from 'react'
import { Input } from 'antd'

const {Search} = Input

function SearchFeature(props) {

    const [SearchTerms, setSearchTerms] = useState('')
    
    function onChangeSearch(event){
        setSearchTerms(event.currentTarget.value)
        props.refreshFunction(event.currentTarget.value)
    }

    return (
        <div>
            <Search
                value={SearchTerms}
                onChange={onChangeSearch}
                placeholder="Search here..."
            />
        </div>
    )
}

export default SearchFeature
