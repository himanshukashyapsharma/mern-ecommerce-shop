import React,{useEffect,useState} from 'react'
import HistoryInfo from "./Sections/HistoryInfo"

function HistoryPage(props) {

    const [History,setHistory] = useState([])

    useEffect(() => {        
        if(props.user.userData){
            setHistory(props.user.userData.history)
        }
    },[props.user.userData])

    return (
        <div style={{width: '80%', margin: '80px auto', textAlign: 'center'}}>
            <div style={{textAlign: 'center'}}>
                <h1>History</h1>
            </div>
            {History !== null &&
                <HistoryInfo
                    list={History}
                />
            }
        </div>
    )
}

export default HistoryPage
