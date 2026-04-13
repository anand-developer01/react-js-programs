# React JS Programs
```jsx
// HOC.jsx
import React, { useState } from 'react';
const HOC = (HocComp) => {
    return function NewComp(props) {
        const [count, setCount] = useState(0)

        const { loading } = props

        const incrementCount = () => {
            setCount(c => c + 1)
        }

        return (
            <>
                {loading ? 'loading...' : <HocComp {...props} incrementCount={incrementCount} count={count} />}
            </>
        )
    }
}
export default HOC



// ButtonCounter.jsx
import React from 'react';
import HOC from './HOC'
const ButtonCounter = ({incrementCount, count}) => {
    return (
        <>
            <button onClick={incrementCount}>{count}</button>
        </>
    )
}
export default HOC(ButtonCounter)



// HocApp.jsx
import React, { useState } from 'react';
import ButtonCounter from './ButtonCounter.jsx'

const HocApp = () => {
    const [loading, setLoading] = useState(false)

    return (
        <>
            <ButtonCounter loading={loading} />
            <button onClick={() => setLoading(p => !p)}> {loading ? 'loading' : 'stopped' }</button>
            {/* <HoverCounter/> */}
        </>
    )
}

export default HocApp
```
