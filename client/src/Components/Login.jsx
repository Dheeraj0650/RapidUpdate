import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Inputfield from "./Inputfields";
import Button from "./Button";
import axios from 'axios';
import Alert from './Alert';

export default function LabTabs() {
  const [value, setValue] = React.useState('1');
  const [credentials, setCredentials] = React.useState({"username":"", "password":"", "re-enter password":""});
  const [alert, setAlert] = React.useState({context:"error", text:"", show:false});

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleCredentialsChange = (event) => {
    var tempCredentials = JSON.parse(JSON.stringify(credentials));
    tempCredentials[event.target.name] = event.target.value;
    setCredentials(tempCredentials);
  };

  const handleRegister = (event) => {
    axios.post('http://localhost:3001/register', JSON.stringify(credentials) ,{headers: {
      'Content-Type': 'application/json'
    }})
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function(){

    });
  };


  const handleLogin = (event) => {
    console.log(credentials);
    axios.post('http://localhost:3001/login', JSON.stringify(credentials) ,{headers: {
      'Content-Type': 'application/json'
    }})
    .then(function (response) {
      console.log(response.data);
      if(response.data === "Invalid credentials"){
        var tempAlert = {
          context:"error",
          text:response.data,
          show:true
        }
        setAlert(tempAlert);
        setTimeout(function(){
          setAlert({
            context:"",
            text:"",
            show:false
          });
        }, 3000)
      }
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function(){

    });
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
                <Tab label="OAuth" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <div className='login-tab'>
                  <span style={{"marginLeft":"0.5rem"}}>Login</span>
                  <Inputfield username="username" onChange={handleCredentialsChange}></Inputfield>
                  <Inputfield username="password" onChange={handleCredentialsChange}></Inputfield>
                  {alert.show && <Alert context={alert.context} text={alert.text}></Alert>}
                  <Button type="submit" text="Login" onClick={handleLogin}></Button>
              </div>
            </TabPanel>
            <TabPanel value="2">          
              <div className='register-tab'>
                <span style={{"marginLeft":"0.5rem"}}>Sign up</span>
                    <Inputfield username="username" onChange={handleCredentialsChange}></Inputfield>
                    <Inputfield username="password" onChange={handleCredentialsChange}></Inputfield>
                    <Inputfield username="re-enter password" onChange={handleCredentialsChange}></Inputfield>
                    <Button type="submit" text="Register" onClick={handleRegister}></Button>
              </div>
            </TabPanel>
            <TabPanel value="3">
              <div className='oauth-tab'>
                <button type="button" class="btn btn-outline-primary"><i class="fa-brands fa-google"></i><span>google</span></button>
                <button type="button" class="btn btn-outline-info"><i class="fa-brands fa-linkedin"></i><span>LinkedIn</span></button>
                <button type="button" class="btn btn-outline-dark"><i class="fa-brands fa-github"></i><span>Github</span></button>
              </div>
            </TabPanel>
          </TabContext>
        </Box>
      </div>
    </div>
  );
}