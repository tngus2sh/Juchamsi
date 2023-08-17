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
import http from "../../axios/http";
import { useDispatch, useSelector } from "react-redux";
import KeyboardDoubleArrowUpRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowUpRounded";

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
  const parking = [{ carNumber: 1 }, { carNumber: 2 }, { carNumber: 3 }, { carNumber: 4 }];
  const [cars, setCars] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [carNumberInfo, setCarNumberInfo] = React.useState("");
  const [userNameInfo, setUserNameInfo] = React.useState("");
  const [villaNumberInfo, setVillaNumberInfo] = React.useState("");
  const [phoneNumberInfo, setPhoneNumberInfo] = React.useState("");
  const [timeInfo, setTimeInfo] = React.useState("");

  const handleModalOpen = (userId) => async () => {
    try {
      const response = await http.get(`/tenant/${userId}`);
      setCarNumberInfo(response.data.response.carNumber);
      setUserNameInfo(response.data.response.name);
      setVillaNumberInfo(response.data.response.villaNumber);
      setPhoneNumberInfo(response.data.response.phoneNumber);
      setTimeInfo(response.data.response.inTime);
      setOpen(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleModalClose = () => setOpen(false);
  const identification = useSelector((state) => state.webInfo.identification);

  useEffect(() => {
    http({
      method: "get",
      url: `/parking/lot/${identification}`,
    })
      .then((response) => {
        console.log(response.data);
        setCars(response.data.response);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
            flexFlow: "column",
          }}
        >
          <KeyboardDoubleArrowUpRoundedIcon />
          <Typography sx={{ fontSize: "1.4rem" }}>입출구</Typography>
          <Box
            sx={{
              height: "30rem",
              width: "380px",
              borderBottom: "40px solid #2D4356",
              borderLeft: "40px solid #2D4356",
              borderRight: "40px solid #2D4356",
              pl: "1.6rem",
              pr: "1.6rem",
              mt: "1rem",
            }}
          >
            <Grid container spacing={3} sx={{ mb: ".1rem" }}>
              {parking.map((park) => {
                const matchingCars = cars.filter(
                  (car) => car.seatNumber === park.carNumber && car.active === "ACTIVE"
                );
                console.log(matchingCars);
                return (
                  <Grid item key={park.carNumber} xs={6} sm={6} md={6}>
                    <Card
                      sx={{
                        height: "13.5rem",
                        width: "11rem",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "rgb(204, 204, 204, 0.3)",
                      }}
                    >
                      <CardContent sx={{ flexGrow: 2 }}>
                        {matchingCars.length > 0 ? (
                          <Box onClick={handleModalOpen(matchingCars[0].userId)}>
                            <img
                              src={`${process.env.PUBLIC_URL}/images/car.png`}
                              style={{
                                width: "7.9rem",
                                height: "10rem",
                                transform: "rotate(150deg)",
                              }}
                              alt="Logo"
                            />
                            <Typography sx={{ mt: ".8rem" }}>
                              {matchingCars[0].carNumber}
                            </Typography>
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
                );
              })}
              ;
            </Grid>
          </Box>
        </Container>

        <Modal open={open} onClose={handleModalClose}>
          <Box sx={style} onMouseLeave={handleModalClose}>
            <Typography variant="h4" component="h2" sx={{ mb: "3.1rem" }}>
              주차된 차량 정보
            </Typography>
            <ParkingList title="차량번호" content={carNumberInfo} />
            <ParkingList title="이름" content={userNameInfo} />
            <ParkingList title="호수" content={villaNumberInfo} />
            <ParkingList title="전화번호" content={phoneNumberInfo} />
            <ParkingList title="입차일시" content={timeInfo} />
          </Box>
        </Modal>
      </Grid>
    </React.Fragment>
  );
};

export default ParkingLotInfo;
