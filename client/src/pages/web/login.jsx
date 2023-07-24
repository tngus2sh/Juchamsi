import React from 'react';
import Container from '@mui/material/Container';
import styled from 'styled-components';
import Avatar from '@mui/material/Avatar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';


const theme = createTheme({
  palette: {
    mainColor: {
      main: '#B7C4CF',
    }
  },
});

const login = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ display: 'flex', justifyContent: 'center', marginTop: '130px' }}
      style={{ paddingLeft:'150px', paddingRight:'150px'  }}>
          <Paper elevation={3} style={{ borderRadius: 20 }}>
          <Grid container style={{ height: '450px', width: '840px' }}>
          <Grid item xs={5} style={{ backgroundColor: '#B7C4CF', borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }}>
              <div style={{marginTop:'50px'}}><img src={`${process.env.PUBLIC_URL}/images/logo.png`} style={{width:'250px', height:'250px'}} alt="Logo" /></div>
          </Grid>
          <Grid item xs={7}>
            <Container component="main" >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4">
            로그인
          </Typography>
          <Box component="form"  noValidate sx={{ mt: 4, pl: 6, pr: 6}}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="id"
              label="아이디"
              name="id"
              autoComplete="id"
              autoFocus
                      size='small'         
              />
                
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="current-password"
              size='small' 
              
            />
            <FormControlLabel
                      control={<Checkbox value="remember" color="mainColor" />}
                      label={<Typography style={{fontSize:13}}>아이디 저장</Typography>}
                      style={{display: 'flex', justifyContent: 'start' }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="mainColor"
              style={{ height: '40px', borderRadius: 50, color:"white",  fontWeight: "bold"}}
              sx={{ mt: 3, mb: 2 }}
            >
              로그인
            </Button>
                <Grid container >
                  <Grid item xs={3}></Grid>
              <Grid item style={{fontSize:12}} >
                회원이 아니신가요?
                  </Grid>
                <Grid item style={{ marginLeft: '10px'}}>    
                <Link to="/signup" variant="body2">
                <Typography style={{ fontSize: '12px' }}>회원가입</Typography>
                </Link>
                  </Grid>
                  <Grid item xs={2}></Grid>
            </Grid>
          </Box>
        </Box>
        
            </Container>
            </Grid>
            </Grid>
            </Paper>
      </Container>
      </ThemeProvider>
    );
};

export default login;