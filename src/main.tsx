import ReactDOM from 'react-dom/client'
import React from 'react';
import {
  RouterProvider,
} from "react-router-dom";
import './index.css'
import router from './router/routes';
import { AuthContextProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider >
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>
);
