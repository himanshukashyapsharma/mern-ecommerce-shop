import React,{useState} from 'react'
import {Collapse, Radio} from 'antd'
const {Panel} = Collapse

function RadioBox(props) {

    const[Value,setValue] = useState('0')

    function handleChange(event){
        setValue(event.target.value)
        props.handleFilters(event.target.value)
    }

    return (
        <div>
            <Collapse defaultActiveKey={['0']}>
                <Panel header="price" key="1">
                    <Radio.Group onChange={handleChange} value={Value}>
                        {props.list && props.list.map((value) => (
                            <Radio key={value._id} value={`${value._id}`}>{value.name}</Radio>
                        ))}
                    </Radio.Group>
                </Panel>
            </Collapse>
        </div>
    )
}

export default RadioBox
