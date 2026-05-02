// import React from "react";
// import { useNavigate } from "react-router-dom";

// function Dashboard() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token"); // clear login
//     navigate("/login"); // back to login
//   };

//   return (
//     <div>

//     </div>
//   );
// }

// export default Dashboard;


import React, { useState } from "react";
import { useUserService } from "../../services/userService";
import { useEffect } from "react";
const Dashboard = () => {
  // 💰 Balance state
  const [balance, setBalance] = useState(null);

  const { getTransactions, getBalance, loading, error } = useUserService()


  // 📄 Transactions state
  const [transactions, setTransactions] = useState([
    { date: 1, type: "DEPOSIT", amount: 500 },
    { date: 2, type: "WITHDRAW", amount: 200 },
  ]);

  // ➕ Deposit amount state
  const [amount, setAmount] = useState("");

  // 💰 Handle deposit
  const handleDeposit = (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) return;

    const depositAmount = Number(amount);

    // update balance
    setBalance((prev) => prev + depositAmount);

    // add transaction
    setTransactions((prev) => [
      {
        id: Date.now(),
        type: "DEPOSIT",
        amount: depositAmount,
      },
      ...prev,
    ]);

    setAmount("");
  };


  useEffect(() => {
    const callUserData = async () => {
      try {
        const [balanceRes, transactionsRes] = await Promise.allSettled([
          getBalance(),
          getTransactions(),
        ]);

        const balance =
          balanceRes.status === "fulfilled"
            ? balanceRes.value
            : null;

        const transactions =
          transactionsRes.status === "fulfilled"
            ? transactionsRes.value
            : [];

        console.log("Balance:", balance);
        console.log("Transactions:", transactions);

        setBalance(balance);
        setTransactions(transactions);
      } catch (err) {
        console.log("Unexpected error:", err);
      }
    };

    callUserData();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Bank Dashboard</h2>

      {/* 💰 Balance */}
      <div style={styles.card}>
        <h3>Current Balance</h3>
        <h1>₹ {balance?.balance}</h1>
      </div>

      {/* ➕ Deposit Form */}
      <form onSubmit={handleDeposit} style={styles.form}>
        <input
          type="number"
          placeholder="Enter deposit amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Deposit
        </button>
      </form>

      {/* 📄 Transactions */}
      <div style={styles.card}>
        <h3>Transactions</h3>

        {transactions && transactions?.length === 0 ? (
          <p>No transactions found</p>
        ) : (
          transactions && transactions?.map((tx) => (
            <div key={tx.date} style={styles.txRow}>
              <span>{tx.type}</span>
              <span style={{ color: tx.type === "DEPOSIT" ? "green" : "red" }}>
                ₹ {tx.amount}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// 🎨 Basic styling
const styles = {
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    fontFamily: "Arial",
  },
  card: {
    padding: "15px",
    borderRadius: "8px",
    background: "#f5f5f5",
    marginBottom: "15px",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },
  input: {
    flex: 1,
    padding: "10px",
  },
  button: {
    padding: "10px 15px",
    cursor: "pointer",
  },
  txRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #ddd",
  },
};

export default Dashboard;