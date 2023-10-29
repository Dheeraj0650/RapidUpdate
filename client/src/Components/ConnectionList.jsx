import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://54.219.224.67:3001');

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

export default function TransferList(props) {
  
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  function handleRoom(usernames, type){
    axios.post('http://54.219.224.67:3001/update_room', {usernames: usernames, current_username: props.username, type: type})
    .then(function (response) {
      console.log(response.data);
      // if(response.data.type === "left"){
      //   socket.emit("join_room", response.data.room_id);
      // }
      // else if(response.data.type === "right"){
      //   socket.emit("leave_room", response.data.room_id);
      // }
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function(){
      
    });
  }

  if(left.length === 0 && right.length === 0){
    axios.get('http://54.219.224.67:3001/all_users')
      .then(function (response) {
        const all_users = response.data;
        console.log(all_users);
        var list_a = [];
        var list_b = [];
        
        for(var idx = 0; idx < all_users.length; idx++){
          console.log(all_users[idx]);
          console.log(props.username);
          console.log(all_users[idx].email !== props.username)
          if(all_users[idx].email !== props.username){
            if(all_users[idx].room === ""){
              list_a.push(all_users[idx].email);
              setLeft(list_a);
            }
            else{
              list_b.push(all_users[idx].email);
              setRight(list_b);
            }
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function(){

      });
  }

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
    handleRoom(left, "left");
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
    handleRoom(checked, "left");
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
    handleRoom(checked, "right");
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
    handleRoom(right, "right");
  };

  const customList = (items) => (
    <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
      <List dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-item-${value}-label`;

          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>{customList(left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllRight}
            disabled={left.length === 0}
            aria-label="move all right"
          >
            ≫
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllLeft}
            disabled={right.length === 0}
            aria-label="move all left"
          >
            ≪
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList(right)}</Grid>
    </Grid>
  );
}