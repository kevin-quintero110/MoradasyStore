import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import  Provider   from "./context/Provider.jsx";
import { BrowserRouter as Router } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <Router>
        <App />
      </Router>
    </Provider>
  </StrictMode>,
)
