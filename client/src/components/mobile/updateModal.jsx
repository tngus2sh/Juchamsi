import React from "react";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Grid } from "@mui/material";
import { PropaneSharp } from "@mui/icons-material";

const UpdateModal = (props) => {
  return (
    <Modal open={props.open} onClose={props.onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={props.style}>
        <div className="modal-flex-container" style={{ display: "flex", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
          <div className="modal-content-container">
            <input required className="login-input" label={props.label} placeholder={props.label} name={props.name} value={props.value} onChange={props.onChange}></input>
            <Typography sx={{ marginTop: "0.4rem", fontSize: "0.6rem" }}>관리자의 승인 이후 서비스 이용이 가능합니다</Typography>
            <button className="login-box" onClick={props.onClick} style={{ marginTop: "1rem", backgroundColor: "#2d4356", color: "white" }}>
              확인
            </button>
          </div>
        </div>

        {/* <Typography sx={{ fontSize: ".1rem", mt: ".3rem", ml: ".2rem" }}>
          관리자의 승인 이후 서비스 이용이 가능합니다.
        </Typography> */}
        {/* <Grid container sx={{ justifyContent: "center", mt: "1.4rem" }}>
          <Button sx={{ backgroundColor: "#112D4E" }} onClick={props.onClick}>
            <Typography sx={{ color: "white" }}>확인</Typography>
          </Button>
        </Grid> */}
      </Box>
    </Modal>
  );
};

export default UpdateModal;
