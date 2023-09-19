import * as React from 'react';
import Button from '@mui/material/Button';

export default function BasicButtons(props) {
  return (
      <Button variant="contained" color="success" type={props.type?props.type:null} onClick={props.onClick?props.onClick:null}>{props.text}</Button>
  );
}