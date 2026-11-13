import React from 'react';import {createRoot} from 'react-dom/client';import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './index.css';import App from './App';import Admin from './Admin';import Delivery from './Delivery';import QR from './QR';import {Toasts} from './lib'
createRoot(document.getElementById('root')).render(<BrowserRouter><Routes><Route path="/" element={<App/>}/><Route path="/admin" element={<Admin/>}/><Route path="/delivery" element={<Delivery/>}/><Route path="/qr" element={<QR/>}/></Routes><Toasts/></BrowserRouter>)
