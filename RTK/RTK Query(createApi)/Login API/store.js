import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userLoginApi } from '../components/login/userLoginApi'

export const store = configureStore({
    reducer : {
        [userLoginApi.reducerPath]: userLoginApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userLoginApi.middleware)
})

setupListeners(store.dispatch)
