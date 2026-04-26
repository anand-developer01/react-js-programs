import React, { useState } from 'react'
import { useAddDepositMutation } from '../login/userLoginApi'

function AddDeposit() {
    const [amount, setAmount] = useState(0)

    const [ AddDeposit, { isLoading, error } ] = useAddDepositMutation()  

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const data = await AddDeposit(amount).unwrap();
            console.log(data)
        }
        catch(err){
            console.log(err)
        }

    }

    return (
        <>
            <form className="deposit-form" onSubmit={handleSubmit}>
                <input type='number' value={amount} onChange={e => setAmount(e.target.value)} />
                <button type='submit'> Deposit </button>
            </form>
        </>
    )
}

export default AddDeposit