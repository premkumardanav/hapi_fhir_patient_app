import { useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { login } from "../../redux/slices/auth";
import {
  Box,
  Button,
  Container,
  Stack,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

const LoginPage = () => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const dispatch = useAppDispatch();
  const handleLogin = () => {
    if (emailInput === "premdanav@gmail.com" && passwordInput === "prem") {
      dispatch(login());
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <>
            <Typography variant="h5" gutterBottom>
              Sign In
            </Typography>
            <Stack spacing={2} mt={2}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <TextField
                fullWidth
                type="password"
                label="Password"
                variant="outlined"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleLogin}
              >
                Login
              </Button>
            </Stack>
          </>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
