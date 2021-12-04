import {Box, CircularProgress} from "@mui/material";

const Spinner = ({message}) => {
    return (
        <Box sx={{ display: "flex" }}>
            <CircularProgress sx={{mr: 2}} /> <span style={{fontWeight: "bold"}}>{message}</span>
        </Box>
    );
};

export default Spinner;