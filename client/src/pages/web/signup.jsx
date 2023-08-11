import React, { useEffect } from "react";
import Container from "@mui/material/Container";
import styled from "styled-components";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import HorizontalLinearStepper from "../../components/signup/Stepper";
import { resetForm } from "../../redux/formslice";
import { useDispatch } from "react-redux";

const theme = createTheme({
  palette: {
    mainColor: {
      main: "#B7C4CF",
    },
  },
});

const SignUpPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetForm());
  });
  return (
    <ThemeProvider theme={theme}>
      <Container
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <Paper elevation={3} sx={{ borderRadius: "3rem", height: "30rem", width: "52rem" }}>
          <Grid container>
            <Grid item xs={7}>
              <Container component="main">
                <CssBaseline />
                <Box
                  sx={{
                    marginTop: "1.3rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography component="h1" variant="h5">
                    회원가입
                  </Typography>
                  <HorizontalLinearStepper />
                </Box>
              </Container>
            </Grid>
            <Grid
              item
              xs={5}
              sx={{
                backgroundColor: "#B7C4CF",
                borderTopRightRadius: "3rem",
                borderBottomRightRadius: "3rem",
                height: "30rem",
              }}
            >
              <img
                src={`${process.env.PUBLIC_URL}/images/logo.png`}
                style={{ marginTop: "3.5rem", width: "250px", height: "250px" }}
                alt="Logo"
              />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default SignUpPage;
