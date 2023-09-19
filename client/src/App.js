import React from "react";
import Navbar from "./Components/Navbar";
import Textarea from "./Components/Textarea";
import Login from "./Components/Login";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  return (
    <div className="App container-fluid">
      <Navbar></Navbar>
      <div className="container-fluid main-container">
        <Login></Login>
        <Textarea></Textarea>
      </div>
    </div>
  );
}

export default App;
