import {Box, CircularProgress, Typography} from "@mui/material";

const Spinner = ({message}) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress size={40} /> <Typography sx={{ml: 2, fontWeight: "bold", fontSize: 18}}>{message}</Typography>
        </Box>
    );
};

export default Spinner;