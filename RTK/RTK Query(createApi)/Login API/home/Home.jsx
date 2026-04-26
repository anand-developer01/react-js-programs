import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAccountBalanceQuery, useTransactionsQuery } from "../login/userLoginApi";
import AddDeposit from "../bank/AddDeposit";
import UserTransactions from "../bank/UserTransactions"

function Home() {
  const [isDeposit, setIsDeposit] = useState(false)
  const { data: getAccountBalance } = useGetAccountBalanceQuery()
  const { data: transactions } = useTransactionsQuery()
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Welcome to {getAccountBalance && getAccountBalance.username} 🎉</h1>
      <p>your account balance is : {getAccountBalance && getAccountBalance.balance}</p>

      <div onClick={() => setIsDeposit(p => !p)} style={{ width: '200px', padding: '15px', borderRadius: '10px', background: '#cafca9' }}> deposit </div>
      {isDeposit ? (<AddDeposit />) : ''}
      <UserTransactions transactions = {transactions}/>
    </div>
  );
}

export default Home;
