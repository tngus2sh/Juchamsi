import React from 'react';
import Container from '@mui/material/Container';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useDispatch } from 'react-redux';
import { setStep1Data } from '../../redux/formslice';


const Step1 = () => {
    const dispatch = useDispatch();

  const handleNameChange = (e) => {
        
        dispatch(setStep1Data({ name: e.target.value }));
      };
    
      const handlePhoneNumberChange = (e) => {
        dispatch(setStep1Data({ phoneNumber: e.target.value }));
      };
    

    return (
      <React.Fragment>
        <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="이름"
            name="name"
            autoComplete="name"
            autoFocus
            size='small'
            variant='standard'  
            onChange={handleNameChange}    
        />
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>   
        <Grid container>
      <Grid item xs={7}>
        <TextField
          margin="normal"
          required
          fullWidth
          name="tel"
          label="휴대폰 번호"
          type="tel"
          id="tel"
          autoComplete="tel"
          size='small'
        variant="standard"
        onChange={handlePhoneNumberChange}
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
          인증하기
        </Button>
      </Grid>
    </Grid>
      </Box>
        
                                
    </React.Fragment>
    );
};

export default Step1;