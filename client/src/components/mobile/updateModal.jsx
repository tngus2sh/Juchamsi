import React from "react";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Grid } from "@mui/material";

const UpdateModal = (props) => {
  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={props.style}>
        <TextField
          required
          id="outlined-phonenumber-input"
          label={props.label}
          name={props.name}
          value={props.value}
          onChange={props.onChange}
          sx={{ "& input": { textAlign: "center" }, mt: ".6rem" }}
        />
        <Typography sx={{ fontSize: ".1rem", mt: ".3rem", ml: ".2rem" }}>
          관리자의 승인 이후 서비스 이용이 가능합니다.
        </Typography>
        <Grid container sx={{ justifyContent: "center", mt: "1.4rem" }}>
          <Button sx={{ backgroundColor: "#112D4E" }} onClick={props.onClick}>
            <Typography sx={{ color: "white" }}>확인</Typography>
          </Button>
        </Grid>
      </Box>
    </Modal>
  );
};

export default UpdateModal;
