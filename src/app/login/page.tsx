"use client";

import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Alert,
  Box,
  InputAdornment,
  IconButton,
  FormLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useRouter } from "next/navigation";


export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/users/login`,
        { email, password }
      );
      if (response.data.success) {
        localStorage.setItem("token", response.data.data.accessToken);
        router.push("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.log("object not found", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm" sx={{height: "90vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"}}>
      <Box >
        <Typography variant="h4" component="h1" gutterBottom sx={{display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>
          Sign In
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
        <FormLabel>Email</FormLabel>
          <TextField
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
           <FormLabel>Password</FormLabel>
          <TextField
            variant="outlined"
            fullWidth
            margin="normal"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" color="primary" type="submit" fullWidth sx={{mt:"20px"}}>
          Sign In
          </Button>
        </form>
      </Box>
    </Container>
  );
}
