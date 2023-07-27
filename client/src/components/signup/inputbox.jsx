import React from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

function Inputbox(props) {
  return (
    <React.Fragment>
      <Typography style={{ fontSize: 12, textAlign: "left", fontWeight: "bold" }}>
        {props.tag}
      </Typography>
      <TextField
        margin="normal"
        fullWidth
        name={props.name}
        type={props.type}
        id={props.name}
        autoComplete={props.name}
        size="small"
        variant="outlined"
        style={{ marginTop: 0 }}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        inputProps={{
          style: {
            height: props.height,
          },
        }}
      />
    </React.Fragment>
  );
}

export default Inputbox;
