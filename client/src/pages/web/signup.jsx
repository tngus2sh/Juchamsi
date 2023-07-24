import React from 'react';
import Container from '@mui/material/Container';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import HorizontalLinearStepper from '../../components/signup/Stepper';


const theme = createTheme({
    palette: {
      mainColor: {
        main: '#B7C4CF',
      }
    },
  });

const SignUpPage = () => {
    return (
      <ThemeProvider theme={theme}>
        <Container
          sx={{ display: 'flex', justifyContent: 'center', marginTop: '130px' }}
          style={{ paddingLeft: '150px', paddingRight: '150px' }}
        >
          <Paper elevation={3} style={{ borderRadius: 20 }}>
          <Grid container style={{ height: '450px', width: '840px' }}>
          <Grid item xs={7}>
            <Container component="main" >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            회원가입
          </Typography>
            <HorizontalLinearStepper />                        
        </Box>
        </Container>
        </Grid>
        <Grid item xs={5} style={{ backgroundColor: '#B7C4CF', borderTopRightRadius: 20, borderBottomRightRadius:20 }}>
              <div style={{marginTop:'50px'}}><img src={`${process.env.PUBLIC_URL}/images/logo.png`} style={{width:'250px', height:'250px'}} alt="Logo" /></div>
          </Grid>
            </Grid>
          </Paper>
        </Container>
      </ThemeProvider>
    );
};

export default SignUpPage;