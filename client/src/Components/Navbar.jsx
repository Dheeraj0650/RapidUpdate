import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch} from "react-redux";
import { authActions } from "../Store/index";

function Navbar(){
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const username = useSelector(state => state.auth.username);

  useEffect(() => {
    if(!isLoggedIn){
        navigate('/');
    }
  }, []);

  let logoutHandler = () => {
    dispatch(authActions.logout());
  };

  return (
    <div class="container-fluid">
        <nav class="navbar fixed-top navbar-expand-lg">
            <a class="navbar-brand" href="#"><img src="logo.png" style={{width:"3rem", marginBottom:"0.7rem", marginRight:"0.5rem", marginLeft:"0.5rem"}}></img><span style={{fontFamily: "'Amatic SC', cursive", fontSize:"2.3rem"}}>RAPID</span><span style={{fontFamily: "'Bree Serif', serif", fontSize:"1.5rem"}}>.update</span></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                <ul class="navbar-nav ml-auto" style={{textAlign:"center"}}>
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" onClick={() => {navigate('/')}}><button type="button" className="nav-button">Home</button></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" onClick={() => {navigate('/realtime-text')}}><button type="button" className="nav-button">Rapid Text</button></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#"><button type="button" className="nav-button">Rapid Board</button></a>
                    </li>
                    {!isLoggedIn && <a class="nav-link" onClick={() => {navigate('/login')}}><button type="button" className="nav-button">Login/Signup</button></a>}
                    {isLoggedIn  && <li class="nav-item dropdown">
                        <a class="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <button type="button" className="nav-button dropdown-toggle"><i class="fas fa-user" style={{paddingRight:"1rem"}}></i></button>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="#">{username}</a></li>
                            <li><hr class="dropdown-divider" /></li>
                            <li><a class="dropdown-item" onClick={logoutHandler}>Logout</a></li>
                        </ul>
                    </li>}
                    {/* <li class="nav-item">
                        {!isLoggedIn && <a class="nav-link" onClick={() => {navigate('/login')}}><button type="button" className="nav-button">Login/Signup</button></a>}
                        {isLoggedIn  && <div class="btn-group">
                            <a type="button" class="nav-link" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <button type="button" className="nav-button dropdown-toggle"><i class="fas fa-user" style={{paddingRight:"1rem"}}></i></button>
                            </a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item">{username}</a>
                                <a class="dropdown-item" >Another action</a>
                                <a class="dropdown-item" onClick={logoutHandler}>logout</a>
                            </div>
                        </div>
                        }
                    </li> */}
                </ul>
            </div>
        </nav>
    </div>);
}

export default Navbar;