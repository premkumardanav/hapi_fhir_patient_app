import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";

const OopsPage = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const handleRedirect = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h3" gutterBottom color="error">
        Oops! Page not found
      </Typography>
      <Typography variant="body1" mb={4}>
        The page you’re looking for doesn’t exist.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleRedirect}>
        {isLoggedIn ? "Go to Dashboard" : "Go to Login"}
      </Button>
    </Box>
  );
};

export default OopsPage;
