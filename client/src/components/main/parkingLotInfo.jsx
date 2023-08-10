import React, { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CameraIcon from "@mui/icons-material/PhotoCamera";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "60%",
  transform: "translate(-50%, -50%)",
  width: "20rem",
  height: "30rem",
  border: "1px solid #000",
  p: 4,
  backgroundColor: "white",
  textAlign: "center",
};

const ParkingList = (props) => {
  return (
    <Grid container sx={{ mt: "2.7rem" }}>
      <Grid item xs={5}>
        <Typography sx={{ fontSize: "1.3rem" }}>{props.title}</Typography>
      </Grid>
      <Grid item xs={7}>
        <Typography sx={{ fontSize: "1.3rem" }}>{props.content}</Typography>
      </Grid>
    </Grid>
  );
};

const ParkingLotInfo = () => {
  const cars = [
    { carNumber: 1, macAdress: "B0:A7:32:DB:C8:46", parkingState: false },
    { carNumber: 2, macAdress: "CC:DB:A7:69:74:4a", parkingState: false },
    { carNumber: 3, macAdress: "CC:DB:A7:69:19:7a", parkingState: false },
    { carNumber: 4, macAdress: "B0:A7:32:DB:C3:52", parkingState: false },
  ];

  const [open, setOpen] = React.useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);

  return (
    <React.Fragment>
      <Grid container>
        <Container
          sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "1300px",
          }}
        >
          <Box
            sx={{
              height: "30rem",
              width: "380px",
              borderTop: "40px solid #2D4356",
              borderLeft: "40px solid #2D4356",
              borderRight: "40px solid #2D4356",
              pl: "1.6rem",
              pr: "1.6rem",
            }}
          >
            <Grid container spacing={3} sx={{ mt: ".1rem" }}>
              {cars.map((car) => (
                <Grid item key={car.carNumber} xs={6} sm={6} md={6}>
                  <Card
                    sx={{
                      height: "13.5rem",
                      width: "11rem",
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "rgb(204, 204,204, 0.3)",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 2 }}>
                      {car.carNumber === 2 ? (
                        <Box onClick={handleModalOpen}>
                          <img
                            src={`${process.env.PUBLIC_URL}/images/car.png`}
                            style={{
                              width: "7.9rem",
                              height: "10rem",
                              transform: "rotate(-30deg)",
                            }}
                            alt="Logo"
                          />
                          <Typography sx={{ mt: ".8rem" }}>26보 3736</Typography>
                        </Box>
                      ) : (
                        <Box>
                          <img
                            src={`${process.env.PUBLIC_URL}/images/parking.png`}
                            style={{
                              width: "6rem",
                              height: "5rem",
                              opacity: "0.13",
                            }}
                            alt="Logo"
                          />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>

        <Modal open={open} onClose={handleModalClose}>
          <Box sx={style} onMouseLeave={handleModalClose}>
            <Typography variant="h4" component="h2" sx={{ mb: "3.1rem" }}>
              주차된 차량 정보
            </Typography>
            <ParkingList title="차량번호" content="26보 3736" />
            <ParkingList title="이름" content="홍길동" />
            <ParkingList title="호수" content="101호" />
            <ParkingList title="전화번호" content="010-3333-3333" />
            <ParkingList title="입차일시" content="2023-07-19 19:30:10" />
          </Box>
        </Modal>
      </Grid>
    </React.Fragment>
  );
};

export default ParkingLotInfo;
