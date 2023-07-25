import DaumPostCode from 'react-daum-postcode';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setOpen, setClose } from '../../redux/addressOpen';
import { setStep3Data } from '../../redux/formslice';

const DaumPost = () => {
    const dispatch = useDispatch(); 

    const handleClose = () => {
        dispatch(setClose()); 
    };

    const handleComplete = (data) => {
        const { zonecode, address, jibunAddress } = data;
        dispatch(setStep3Data({ zipCode: zonecode, address, jibunAddress }));
        handleClose();
        
    }
    return (
        <DaumPostCode onComplete={handleComplete} className="post-code" />
    
    );
}
export default DaumPost;