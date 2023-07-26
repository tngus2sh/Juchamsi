import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import { Grid } from '@mui/material';

const step = [<Step1 />, <Step2 />, <Step3 />];

const theme = createTheme({
  palette: {
    mainColor: {
      main: '#B7C4CF',
    }
  },
});

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ width: '100%', marginTop: '30px' }}>
      <Stepper activeStep={activeStep}>
        {step.map((component, index) => (
          <Step key={index}>
            <StepLabel>{`Step ${index + 1}`}</StepLabel>
          </Step>
        ))}
          </Stepper>

      {activeStep === step.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            모든 단계가 완료되었습니다. 작업을 마치셨습니다!
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>초기화</Button>
              </Box>
              
            </React.Fragment>
          
          ) : (
          <React.Fragment>
            <Box component="form"  noValidate sx={{ mt: 4, pl: 6, pr: 6}}>
              {step[activeStep]}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
              variant="outlined"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              이전
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
              <Button
                variant="outlined"
                onClick={handleNext} 
              >
              {activeStep === step.length - 1 ? '가입' : '다음'}
            </Button>
          </Box>
        </Box>    
          </React.Fragment>
          )}
      </Box>
      </ThemeProvider>
  );
}







