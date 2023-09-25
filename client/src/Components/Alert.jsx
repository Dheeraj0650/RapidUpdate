import * as React from 'react';
import Alert from '@mui/material/Alert';

export default function FilledAlerts(props) {
  return (
    <div className='container-fluid' style={{position:"fixed",top:"5rem",left:"35%", zIndex:40, width:"30%"}}>
      {props.context === "error" && <Alert variant="outlined" severity="error">
        {props.text}
      </Alert>}

      {props.context === "success" && <Alert variant="outlined" severity="success">
        {props.text}
      </Alert>}
    </div>
  );
}