import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import themeReducer from './theme/themeSlice';
import scheduleReducer from './schedule/scheduleSlice';
import { persistReducer, persistStore } from 'redux-persist'
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
    user: userReducer,
    theme: themeReducer,
    schedule: scheduleReducer
})

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
}

const persistedReduser = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReduser,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
})

export const persistor = persistStore(store);