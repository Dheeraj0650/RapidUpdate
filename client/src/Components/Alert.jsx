import * as React from 'react';
import Alert from '@mui/material/Alert';

export default function FilledAlerts(props) {
  return (
    <div className='container-fluid'>
      {props.context === "error" && <Alert variant="outlined" severity="error">
        {props.text}
      </Alert>}

      {props.context === "success" && <Alert variant="outlined" severity="success">
        {props.text}
      </Alert>}
    </div>
  );
}