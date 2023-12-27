import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AuthButtons = () => {
    const navigate = useNavigate();

    const signUp = () => {
        navigate({ SIGNUP_URL });
    }

    const signIn = () => {
        navigate({ SIGNIN_URL });
    }
    return (
        <><Button onClick={signUp} fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2, bgcolor: '#172c05', '&:hover': { bgcolor: '#b6ca6e' } }}>
            Sign up
        </Button>
            <Button onClick={signIn} fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2, bgcolor: '#172c05', '&:hover': { bgcolor: '#b6ca6e' } }}>
                Sign in
            </Button></>
    );
};

export default AuthButtons;