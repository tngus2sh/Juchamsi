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
        <div className="modal-flex-container" style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
          <div className="modal-title-container" style={{ marginTop: "2rem" }}>
            <span className="bold-text" style={{ fontSize: "1.3rem" }}>
              {props.title}
            </span>
          </div>
          <div className="modal-content-container" style={{ flex: "1" }}>
            <div className="modal-content-flex-container" style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
              <div className="modal-content-input-container" style={{ width: "70%" }}>
                <input required className="login-input" label={props.label} placeholder={props.label} name={props.name} value={props.value} onChange={props.onChange}></input>
                <Typography sx={{ marginTop: "0.4rem", fontSize: "0.8rem" }}>※ 관리자의 승인 이후 서비스 이용이 가능합니다</Typography>
                <button className="login-box" onClick={props.onClick} style={{ marginTop: "1.7rem", backgroundColor: "#006DD1", color: "white" }}>
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default UpdateModal;
