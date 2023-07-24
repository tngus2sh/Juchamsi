import React from 'react';
import Container from '@mui/material/Container';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useDispatch } from 'react-redux';
import { setStep2Data } from '../../redux/formslice';

const Step2 = () => {
    const dispatch = useDispatch();

  const handleIdChange = (e) => {
        dispatch(setStep2Data({ id: e.target.value }));
      };
    
      const handlePasswordChange = (e) => {
        dispatch(setStep2Data({ password: e.target.value }));
      };
    return (
      <React.Fragment>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>   
            <Grid container>
          <Grid item xs={7}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="id"
              label="아이디"
              type="id"
              id="id"
              autoComplete="id"
              size='small'
                variant="standard"
                onChange={handleIdChange}  
            />
          </Grid>
          <Grid item xs={5}>
            <Button
              variant="contained"
              color="mainColor"
              sx={{
                height: '30px',
                borderRadius: 10,
                color: "white",
                fontWeight: "bold",
                fontSize: '12px',
                marginTop: '30px'
              }}
            >
              중복체크
            </Button>
          </Grid>
        </Grid>
          </Box>
              <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="비밀번호"
              name="password"
              autoComplete="password"
              size='small'
          variant='standard'
          onChange={handlePasswordChange}  
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password2"
              label="비밀번호확인"
              name="password2"
              autoComplete="password2"
              size='small'
              variant='standard'                              
            />
                                    
          </React.Fragment>
    );
};

export default Step2;