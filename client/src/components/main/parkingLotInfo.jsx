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

const ParkingLotInfo = () => {
  const cars = [
    { carNumber: 1, macAdress: "B0:A7:32:DB:C8:46", parkingState: false },
    { carNumber: 2, macAdress: "CC:DB:A7:69:74:4a", parkingState: false },
    { carNumber: 3, macAdress: "CC:DB:A7:69:19:7a", parkingState: false },
    { carNumber: 4, macAdress: "B0:A7:32:DB:C3:52", parkingState: false },
  ];

  return (
    <React.Fragment>
      <Container sx={{ height: "100vh" }} maxWidth="md">
        <Box
          sx={{
            height: "30rem",
            borderTop: "40px solid brown",
            borderLeft: "40px solid brown",
            borderRight: "40px solid brown",
            pl: "1.7rem",
            pr: "1.7rem",
            ml: "10rem",
            mr: "10rem",
          }}
        >
          <Grid container spacing={3} sx={{ mt: ".1rem" }}>
            {cars.map((card) => (
              <Grid item key={card} xs={6} sm={6} md={6}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "gray",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Heading
                    </Typography>
                    <Typography>
                      This is a media card. You can use this section to describe the content.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View</Button>
                    <Button size="small">Edit</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default ParkingLotInfo;
