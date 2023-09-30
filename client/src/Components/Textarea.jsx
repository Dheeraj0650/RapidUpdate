import React, {useEffect, useRef, useState} from "react";
import { useNavigate, redirect} from 'react-router-dom';
import { useSelector, useDispatch} from "react-redux";
import { io } from 'socket.io-client';
import axios from 'axios';
import Button from '@mui/material/Button';
import ConnectionList from './ConnectionList';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

const socket = io('http://localhost:3001');

function Textarea(){

    const [openNewModal, setNewOpenModal] = useState(false);

    const userField = useRef();
    const navigate = useNavigate();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const username = useSelector(state => state.auth.username);
    const [room, setRoom] = useState(""); 

    const Backdrop = (props) => {
        return <div className="backdrop"/>;
    };
    
    const ModalOverlay = (props) => {
        return (
            <div className='modal-card'>
                <header className="header">
                    <h2>Connect</h2>
                </header>
                <div className="content">
                    <ConnectionList username={username}/>
                </div>
                <footer className="actions">
                    <Button onClick={() => {setNewOpenModal(false)}}>Close</Button>
                </footer>
            </div>
        );
    };

    console.log(isLoggedIn);

    useEffect(() => {
        if(!isLoggedIn){
            navigate('/login');
        }

        socket.on("change_text_global",function(data){
            console.log("inside11")
            console.log(username)
            console.log(room);
            console.log("inside2")
            axios.post('http://localhost:3001/realtime-text', {type:'push' , username: username, realtimetext: data }  ,{
                withCredentials: true,
                credentials: 'include'
            }).then(function(response){
                console.log(response);
                document.getElementsByClassName('textarea is-large')[0].value = data;
            }).catch(function(error){
            })
        });

        socket.on("join_room_global",function(data){
            if(data.username.includes(username)){
                socket.emit("join_room", data.value);
            }
        });

        if(username !== ""){
            console.log("inside1")
            console.log(username)
            console.log("inside2")
            axios.post('http://localhost:3001/realtime-text', {type:'pull' , username: username} ,{
                withCredentials: true,
                credentials: 'include'
            }).then(function(response){
                console.log(response);
                document.getElementsByClassName('textarea is-large')[0].value = response.data.realtimetext;
            }).catch(function(error){
            })
        }

        axios.post('http://localhost:3001/get_room', {username: username} ,{
            withCredentials: true,
            credentials: 'include'
        }).then(function(response){
            console.log("hello 2");
            console.log(response.data);
            setRoom(response.data.room);
            socket.emit("join_room", response.data.room);
        }).catch(function(error){
        
        })

    }, []);

    function onTextAreaChange(event){
        if(username === ""){
            return
        }
        console.log("inside1")
        console.log(username)
        console.log(room)
        console.log("inside2")

        axios.post('http://localhost:3001/realtime-text', {type:'push' , username: username, realtimetext: event.target.value, room:room} ,{
            withCredentials: true,
            credentials: 'include'
        }).then(function(response){
            console.log(response.data);
            socket.emit("change_text", {realtimetext:event.target.value, room:room});
        }).catch(function(error){
        
        })
    }

    function handleConnect(){
        // setNewOpenModal(true);
        var tempRoom = userField.current.querySelectorAll('input')[0].value;
        setRoom(tempRoom);
        socket.emit("join_room", tempRoom);
    }

    function handleCreateRoom() {
        axios.post('http://localhost:3001/create_room', {username: username} ,{
            withCredentials: true,
            credentials: 'include'
        }).then(function(response){
            console.log("hello");
            console.log(response.data);
            setRoom(response.data);
            socket.emit("join_room", response.data);
        }).catch(function(error){
        })
    }

    function handleExitRoom() {
        axios.post('http://localhost:3001/exit_room', {username: username} ,{
            withCredentials: true,
            credentials: 'include'
        }).then(function(response){
            console.log(response.data);
            socket.emit("leave_room", room);
            setRoom(response.data);
        }).catch(function(error){

        })
    }

    return (
        <div class="control" style={{display:"flex", flexDirection:"column", justifyContent:"center", alignContent:"center", alignItems:"center", gap:"1rem", marginTop:"1rem"}}>
            <div className="container-fluid" style={{display:"flex", flexDirection:"row", justifyContent:"center", alignContent:"center", alignItems:"center", gap:"1rem"}}>
                {/* {openNewModal && ReactDOM.createPortal(
                    <Backdrop/>,
                    document.getElementById('backdrop-root')
                )}
                {openNewModal && ReactDOM.createPortal(
                    <ModalOverlay
                    name = "Connect to a user"
                    />,
                    document.getElementById('overlay-root')
                )} */}
                {room === "" && <TextField
                    label="Join a room"
                    id="filled-size-normal"
                    defaultValue=""
                    variant="filled"
                    ref = {userField}
                />}
                {room === "" && <Button variant="contained" onClick={handleConnect}>Connect</Button>}
                {room === "" && <Button variant="contained" onClick={handleCreateRoom}>Create Room</Button>}
                {room !== "" && <Chip label={"Room ID : " + room} color="success" variant="outlined" />}
                {room !== "" && <Button variant="contained" onClick={handleExitRoom}>exit room</Button>}
            </div>
            {isLoggedIn && <textarea class="textarea is-large" placeholder="Real Time Update" onChange={onTextAreaChange}></textarea>}
        </div>
    )
}

export default Textarea;