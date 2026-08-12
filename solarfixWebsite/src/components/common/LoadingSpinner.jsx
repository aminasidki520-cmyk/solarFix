import { Box, CircularProgress } from "@mui/material";

function LoadingSpinner() {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress color="primary" />
        </Box>
    );
}

export default LoadingSpinner;