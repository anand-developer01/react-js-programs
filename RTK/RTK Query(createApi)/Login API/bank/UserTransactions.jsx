import React from "react";


const UserTransactions = React.memo(({transactions}) => {
    console.log(transactions)
    return (
        <div style={{ padding: "40px", textAlign: "center" }}>
            <table style={{ margin: "0 auto", width: "80%" }}>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions && transactions.map((t, index) => (
                        <tr key={t.id || index}>
                            <td>{t.type}</td>
                            <td>{t.amount}</td>
                            <td>{new Date(t.date).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
})

export default UserTransactions;
