import Box from '@mui/material/Box';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setStep3Data } from '../../redux/formslice';
import { setOpen, setClose } from '../../redux/addressOpen'; 
import DaumPost from './DaumPost';

const Step3 = () => {
    const dispatch = useDispatch();
    const step3Data = useSelector((state) => state.form.step3Data);   
    const open = useSelector((state) => state.addressOpen.open); 
    
    const handleVillaNameChange = (e) => {
    dispatch(setStep3Data({ villaName: e.target.value }));
    };

    const handleOpen = () => {
        dispatch(setOpen()); 
    };

    const handleClose = () => {
        dispatch(setClose()); 
    };

    return (
        <React.Fragment>
           <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>   
                <Grid container>
                    <Grid item xs={7}>
                        <Typography style={{fontSize:12, textAlign: 'left', fontWeight: "bold" }} >
                            빌라 주소
                        </Typography>    
                        <TextField
                            disabled
                            margin="normal"
                            fullWidth
                            name="zipcode"
                            id="zipcode"
                            autoComplete="zipcode"
                            size='small'
                            variant="outlined"
                            style={{ marginTop: 0 }}
                            value={step3Data.zipCode}            
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
                marginTop: '24px'
                }}
                onClick={handleOpen}
            >
              우편번호로 찾기
            </Button>
          </Grid>
            </Grid>
          </Box>
            <TextField
                disabled
              margin="normal"
              fullWidth
              name="address"
              id="address"
              autoComplete="address"
              size='small'
                variant="outlined"
                value={step3Data.address}      
            />
            <Box>
            <Typography style={{fontSize:12, textAlign: 'left', fontWeight: "bold" }} >
                빌라 이름
            </Typography>
            <TextField
              margin="normal"
              fullWidth
              name="villaName"
              id="villaName"
              autoComplete="id"
              size='small'
            variant="outlined"
            style={{ marginTop: 0 }}
                />
            </Box>
            <Box>
            <Typography style={{fontSize:12, textAlign: 'left', fontWeight: "bold" }} >
                총 주차대수
                </Typography>
                <Grid container>
                    <Grid item xs={2}>
                        <TextField
                        margin="normal"
                        fullWidth
                        name="left-count"
                        id="left-count"
                        autoComplete="left-count"
                        size='small'
                        variant="outlined"
                        type='number'    
                        style={{ marginTop: 0 }}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        X
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                        margin="normal"
                        fullWidth
                        name="left-count"
                        id="left-count"
                        autoComplete="left-count"
                        size='small'
                        variant="outlined"
                        type='number'
                        style={{ marginTop: 0 }}
                        />
                    </Grid>
                </Grid>
                <FormControlLabel required control={<Checkbox />} label="개인정보 수집 및 이용에 동의합니다." />
            </Box>




            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>주소 찾기</DialogTitle>
                <DialogContent>
                    <DaumPost/>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color="primary">
                    닫기
                </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default Step3;