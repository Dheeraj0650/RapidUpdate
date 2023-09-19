import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function MultilineTextFields(props) {
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '30ch' },
      }}
      noValidate
      autoComplete="off"
    >
        <TextField
          id="outlined-textarea"
          label={props.username}
          name={props.username}
          placeholder={"Enter the " + props.username}
          multiline
          onChange={props.onChange?props.onChange:null}
        />
    </Box>
  );
}