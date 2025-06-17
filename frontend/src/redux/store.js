import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import postSlice from "./postSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage

// 1. Combine reducers (only here — no need to import rootReducer)
const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
});

// 2. Configure persist
const persistConfig = {
  key: "root",
  storage,
};

// 3. Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Create and export store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// 5. Create and export persistor
export const persistor = persistStore(store);
