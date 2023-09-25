import React, {useEffect} from "react";
import Navbar from "./Components/Navbar";
import Homepage from "./Components/Home";
import Textarea from "./Components/Textarea";
import Login from "./Components/Login";
import Cookies from 'js-cookie';
import { authActions } from "./Store/index";
import { useSelector, useDispatch} from "react-redux";
import {createBrowserRouter, BrowserRouter as Router, Routes , Route, Outlet, RouterProvider, redirect} from 'react-router-dom';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
      let state = Cookies.get('rapidupdate-text');
      console.log(state);
      if(state){
        var stateParse = JSON.parse(state);
        if(stateParse.isLoggedIn){
          let username = stateParse.username;
          console.log(username);
          dispatch(authActions.login(username));
        }
      }
  }, []);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <div className="App container-fluid"><Navbar></Navbar><Outlet/></div>,
      children : [
        {path:'/', element:<Homepage />},
        {path:'/login', element: <div className="container-fluid main-container"><Login></Login></div>},
        {path:'/realtime-text', element:  <Textarea></Textarea>}
      ]
    }
  ])

  return (
    // <Router>
    //     <div className="App container-fluid">
    //       <Routes>
    //         <Route path = "/*" element={<Navbar></Navbar>}/>
    //       </Routes>
    //       <div className="container-fluid main-container">
    //         <Routes>
    //           <Route path = "/login" element={<Login></Login>} />
    //         </Routes>
    //         <Routes>
    //           <Route path = "/realtime-text" element={<Textarea></Textarea>} />
    //         </Routes>
    //       </div>
    //     </div>
    // </Router>
    <RouterProvider router={router} />
  );
}

export default App;
