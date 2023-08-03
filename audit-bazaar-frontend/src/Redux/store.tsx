import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import userDataSlice from "./userData/userData";
import authenticationDataSlice from "./authenticationData/authenticationData";
import loaderSlice  from "./loader/loader";

const rootReducer = combineReducers({
  userDataSlice: userDataSlice,
  authenticationDataSlice: authenticationDataSlice,
  loaderSlice:loaderSlice,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store: any = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
