import logo from './logo.svg';
import './CSS/App.css';
import Header from './Component/Header'
import Router from './Router'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const navigate = useNavigate();
    if (error.response && error.response.status >= 400) {
      const currentUrl = window.location.pathname + window.location.search;
      navigate(`/error?redirectUrl=${encodeURIComponent(currentUrl)}&type=api`);
    }
    return Promise.reject(error);
  }
);

function App() {
  return (
    <>
      <Header/>
      <Router />    
    </>
  )

}

export default App;
