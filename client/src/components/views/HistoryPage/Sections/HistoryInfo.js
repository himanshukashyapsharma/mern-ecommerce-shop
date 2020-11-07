import React from 'react'

function HistoryInfo(props) {

    function GetFormattedDate(timeString) {
        var time = new Date(timeString)
        var month = time.getMonth() + 1
        var day = time.getDate()
        var year = time.getFullYear()
        return month + "/" + day + "/" + year
    }

    return (
        <React.Fragment>
            <table>
                <thead>
                    <tr>
                        <th>Payment Id</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Date of Purchase</th>
                    </tr>
                </thead>
                <tbody>
                    { props.list && props.list.length > 0 && props.list.map((item,i) => {
                        return (
                            <tr key={i}>
                                <td>{item.paymentId}</td>
                                <td>{item.name}</td>
                                <td>{item.price}</td>
                                <td>{item.quantity}</td>
                                <td>{GetFormattedDate(item.dateOfPurchase)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </React.Fragment>
    )
}

export default HistoryInfo