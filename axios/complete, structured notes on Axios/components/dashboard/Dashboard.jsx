
// import React, { useState } from "react";
// import { useUserService } from "../../services/userService";
// import { useEffect } from "react";
// const Dashboard = () => {
//   // 💰 Balance state
//   const [balance, setBalance] = useState(null);

//   const { getTransactions, getBalance, loading, error } = useUserService()


//   // 📄 Transactions state
//   const [transactions, setTransactions] = useState([]);

//   // ➕ Deposit amount state
//   const [amount, setAmount] = useState("");

//   // 💰 Handle deposit
//   const handleDeposit = (e) => {
//     e.preventDefault();

//     if (!amount || Number(amount) <= 0) return;

//     const depositAmount = Number(amount);

//     // update balance
//     setBalance((prev) => prev + depositAmount);

//     // add transaction
//     setTransactions((prev) => [
//       {
//         id: Date.now(),
//         type: "DEPOSIT",
//         amount: depositAmount,
//       },
//       ...prev,
//     ]);

//     setAmount("");
//   };


//   useEffect(() => {
//     const callUserData = async () => {
//       try {
//         const [balanceRes, transactionsRes] = await Promise.allSettled([
//           getBalance(),
//           getTransactions(),
//         ]);

//         const balance =
//           balanceRes.status === "fulfilled"
//             ? balanceRes.value
//             : null;

//         const transactions =
//           transactionsRes.status === "fulfilled"
//             ? transactionsRes.value
//             : [];

//         console.log("Balance:", balance);
//         console.log("Transactions:", transactions);

//         setBalance(balance);
//         setTransactions(transactions);
//       } catch (err) {
//         console.log("Unexpected error:", err);
//       }
//     };

//     callUserData();
//   }, []);

//   return (
//     <div style={styles.container}>
//       <h2>Bank Dashboard</h2>

//       {/* 💰 Balance */}
//       <div style={styles.card}>
//         <h3>Current Balance</h3>
//         <h1>₹ {balance?.balance}</h1>
//       </div>

//       {/* ➕ Deposit Form */}
//       <form onSubmit={handleDeposit} style={styles.form}>
//         <input
//           type="number"
//           placeholder="Enter deposit amount"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           style={styles.input}
//         />

//         <button type="submit" style={styles.button}>
//           Deposit
//         </button>
//       </form>

//       {/* 📄 Transactions */}
//       <div style={styles.card}>
//         <h3>Transactions</h3>

//         {transactions && transactions?.length === 0 ? (
//           <p>No transactions found</p>
//         ) : (
//           transactions && transactions?.map((tx) => (
//             <div key={tx.date} style={styles.txRow}>
//               <span>{tx.type}</span>
//               <span style={{ color: tx.type === "DEPOSIT" ? "green" : "red" }}>
//                 ₹ {tx.amount}
//               </span>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// // 🎨 Basic styling
// const styles = {
//   container: {
//     maxWidth: "500px",
//     margin: "40px auto",
//     fontFamily: "Arial",
//   },
//   card: {
//     padding: "15px",
//     borderRadius: "8px",
//     background: "#f5f5f5",
//     marginBottom: "15px",
//   },
//   form: {
//     display: "flex",
//     gap: "10px",
//     marginBottom: "15px",
//   },
//   input: {
//     flex: 1,
//     padding: "10px",
//   },
//   button: {
//     padding: "10px 15px",
//     cursor: "pointer",
//   },
//   txRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: "8px 0",
//     borderBottom: "1px solid #ddd",
//   },
// };

// export default Dashboard;


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



/// Final Updated Dashboard (Multiple Loaders + Safe UI)
// --------------- No Promise.all --------------------
// Promise.all
// Individual loaders	❌ Hard	
// UI control	❌ Limited
//------------
// Separate calls
// Individual loaders	✅ Easy
// UI control	✅ Flexible

import React, { useState, useEffect } from "react";
import { useUserService } from "../../services/userService";

const Dashboard = () => {
  const { getTransactions, getBalance } = useUserService();

  // 💰 Balance state
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState(null);

  // 📄 Transactions state
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState(null);

  // ➕ Deposit state
  const [amount, setAmount] = useState("");

  // 💰 Handle deposit (UI only)
  const handleDeposit = (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) return;

    const depositAmount = Number(amount);

    setBalance((prev) => ({
      ...prev,
      balance: (prev?.balance || 0) + depositAmount,
    }));

    setTransactions((prev) => [
      {
        id: Date.now(),
        type: "DEPOSIT",
        amount: depositAmount,
        date: new Date().toISOString(),
      },
      ...prev,
    ]);

    setAmount("");
  };

  // 🔄 Fetch balance
  const fetchBalance = async () => {
    try {
      setBalanceLoading(true);
      setBalanceError(null);

      const data = await getBalance();
      setBalance(data);
    } catch (err) {
      console.log(err);
      setBalanceError("Failed to load balance");
    } finally {
      setBalanceLoading(false);
    }
  };

  // 🔄 Fetch transactions
  const fetchTransactions = async () => {
    try {
      setTransactionsLoading(true);
      setTransactionsError(null);

      const data = await getTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setTransactionsError("Failed to load transactions");
    } finally {
      setTransactionsLoading(false);
    }
  };

  // 🚀 Load data on mount (parallel)
  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Bank Dashboard</h2>

      {/* 💰 Balance */}
      <div style={styles.card}>
        <h3>Current Balance</h3>

        {balanceLoading ? (
          <p>Loading balance...</p>
        ) : balanceError ? (
          <p style={styles.error}>{balanceError}</p>
        ) : (
          <h1>₹ {balance?.balance ?? 0}</h1>
        )}
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

        {transactionsLoading ? (
          <p>Loading transactions...</p>
        ) : transactionsError ? (
          <p style={styles.error}>{transactionsError}</p>
        ) : transactions.length === 0 ? (
          <p>No transactions found</p>
        ) : (
          transactions.map((tx) => (
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

// 🎨 Styles
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
  error: {
    color: "red",
  },
};

export default Dashboard;
