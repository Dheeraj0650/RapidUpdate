import {useState, useEffect, useReducer} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Inputfield from "./Inputfields";
import Button from "./Button";
import axios from 'axios';
import Alert from './Alert';
import { string } from 'prop-types';
import { authActions } from "../Store/index";
import { useSelector, useDispatch} from "react-redux";
import { useNavigate } from 'react-router-dom';

export default function LabTabs() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  useEffect(() => {
    if(isLoggedIn){
        navigate('/');
    }
  }, []);

  const emailReducer = (state, action) => {
    if(action.type === "set"){
      return {
        value: action.value, isValid:action.value.trim() === ''? null:checkEmailValid(action.value)
      }
    }
  }

  const passwordReducer = (state, action) => {
    if(action.type === "set"){
      return {
        value: action.value, isValid:action.value.trim() === ''? null:checkPasswordValid(action.value)
      }
    }
  }

  const [value, setValue] = useState('1');

  useEffect(()=>{
    dispatchEmail({type:"set", value: ""});
    dispatchPassword({type:"set", value:""});
  }, [value])
    
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value:'',
    isValid: null
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value:'',
    isValid: null
  });

  // const [credentials, setCredentials] = useState({"username":"", "password":"", "re-enter password":""});
  const [alert, setAlert] = useState({context:"error", text:"", show:false});

  function checkEmailValid(email){
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Test the email against the regex pattern
    return emailRegex.test(email);
  }

  function checkPasswordValid(password){
      if (password.length < 8) {
        return false;
      }
    
      // Check if the password contains at least one uppercase letter
      if (!/[A-Z]/.test(password)) {
        return false;
      }

      // Check if the password contains at least one lowercase letter
      if (!/[a-z]/.test(password)) {
        return false;
      }
    
      // Check if the password contains at least one number
      if (!/[0-9]/.test(password)) {
        return false;
      }
    
      // Check if the password contains at least one special character (e.g., !@#$%^&*)
      if (!/[!@#$%^&*]/.test(password)) {
        return false;
      }

      return true;
  }

  function getAlert(tempAlert){
    setAlert(tempAlert);
    setTimeout(function(){
      setAlert({
        context:"",
        text:"",
        show:false
      });
    }, 3000);
  }


  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handlePasswordChange = (event) => {
    dispatchPassword({type:"set", value: event.target.value.trim()});
  }

  const handleEmailChange = (event) => {
    dispatchEmail({type:"set", value: event.target.value.trim()});
  }

  const handleRegister = (event) => {
    if(emailState.isValid && passwordState.isValid){
      axios.post('http://54.176.90.137:3001/register', {username: emailState.value.toLowerCase().trim(), password: passwordState.value.trim()} ,{
        withCredentials: true,
        credentials: 'include'
      })
      .then(function (response) {
        console.log(response.data);
        console.log(typeof response.data !== String)
        if(typeof response.data !== String && response.data.message === "A user with the given username is already registered"){
          var tempAlert = {
            context:"error",
            text:response.data.message,
            show:true
          }
          getAlert(tempAlert);
        }
        else if(response.data === "authenticated successfully"){
          dispatch(authActions.login(emailState.value.toLowerCase().trim()));
          navigate("/");
        }
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function(){

      });
    }
  };

  const handleLogin = (event) => {
    console.log(emailState);
      console.log(passwordState);
    if(emailState.isValid && passwordState.isValid){
        axios.post('http://54.176.90.137:3001/login', {username: emailState.value, password: passwordState.value}, {
          withCredentials: true, 
          credentials: 'include'
        })
        .then(function (response) {
          console.log(response.data);
          if(typeof response.data !== string && response.data.message === "A user with the given username is already registered"){
            var tempAlert = {
              context:"error",
              text:response.data.message,
              show:true
            }
            getAlert(tempAlert);
          }
          else if(typeof response.data === string && response.data === "Unauthorized"){
            tempAlert = {
              context:"error",
              text:response.data,
              show:true
            }
            getAlert(tempAlert);
          }
          else if(response.data === "authenticated successfully"){
            dispatch(authActions.login(emailState.value.toLowerCase().trim()));
            navigate("/");
          }
        })
        .catch(function (error) {
          console.log(error.response.data);
          console.log(typeof error.response.data === string && error.response.data === "Unauthorized");
          if(typeof error.response.data === "string" && error.response.data === "Unauthorized"){
            var tempAlert = {
              context:"error",
              text:error.response.data,
              show:true
            }
            getAlert(tempAlert);
          }
        })
        .finally(function(){

        });
    }
  };

  return (
    <div className='container-fluid'>
      <div className='login-container'>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Login" value="1" />
                <Tab label="Sign up" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <div className='login-tab'>
                  <span style={{"marginLeft":"0.5rem"}}>Login</span>
                  <Inputfield username="username" onChange={handleEmailChange}></Inputfield>
                  {emailState.isValid === false && <span style={{fontSize:"0.8rem", marginLeft:"0.5rem", color:'red'}}>Invalid username</span>}
                  <Inputfield username="password" onChange={handlePasswordChange} type="password"></Inputfield>
                  {passwordState.isValid === false && <span style={{fontSize:"0.8rem", marginLeft:"0.5rem", textAlign:"fill", width:"16rem", color:'red'}}>Invalid password. password should include 1. length greater than or equal to 8, 2. least one uppercase letter, 3. at least one lowercase letter, 4. at least one number, 5. at least one special character</span>}
                  {alert.show && <Alert context={alert.context} text={alert.text}></Alert>}
                  <Button type="submit" text="Login" onClick={handleLogin}></Button>
              </div>
            </TabPanel>
            <TabPanel value="2">          
              <div className='register-tab'>
                <span style={{"marginLeft":"0.5rem"}}>Sign up</span>
                    <Inputfield username="username" onChange={handleEmailChange}></Inputfield>
                    {emailState.isValid === false && <span style={{fontSize:"0.8rem", marginLeft:"0.5rem", color:'red'}}>Invalid username</span>}
                    <Inputfield username="password" onChange={handlePasswordChange} type="password"></Inputfield>
                    {passwordState.isValid === false && <span style={{fontSize:"0.8rem", marginLeft:"0.5rem", textAlign:"fill", width:"16rem", color:'red'}}>Invalid password. password should include 1. length greater than or equal to 8, 2. least one uppercase letter, 3. at least one lowercase letter, 4. at least one number, 5. at least one special character</span>}
                    {alert.show && <Alert context={alert.context} text={alert.text}></Alert>}
                    <Button type="submit" text="Register" onClick={handleRegister}></Button>
              </div>
            </TabPanel>
          </TabContext>
        </Box>
      </div>
    </div>
  );
}