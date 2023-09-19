import React from 'react';

function Navbar(){
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
                        <a class="nav-link active" aria-current="page" href="#"><button type="button" className="nav-button">Home</button></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#"><button type="button" className="nav-button">About</button></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#"><button type="button" className="nav-button">Projects</button></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#"><button type="button" className="nav-button">Contact</button></a>
                    </li>
                </ul>
            </div>
        </nav>
    </div>);
}

export default Navbar;