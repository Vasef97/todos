import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
    Box,
    Typography,
    TextField,
    Button
} from "@mui/material";
import "../styles/RegisterPage.css";

const BASE = import.meta.env.VITE_API_BASE_URL;

export default function RegisterPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleRegister = async e => {
        e.preventDefault();
        if (!username.trim() || !email.trim() || !password.trim()) {
            return toast.error("Please fill all fields");
        }
        if (!emailPattern.test(email)) {
            return toast.error("Invalid email format");
        }
        try {
            const { data } = await axios.post(
                `${BASE}/auth/register`,
                { username, email, password },
                { withCredentials: true }
            );
            toast.success(data.message);
            navigate("/main");
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="register-container">
            <Box
                component="form"
                onSubmit={handleRegister}
                noValidate
                className="register-box"
            >
                <Typography variant="h5" gutterBottom>
                    Create Account
                </Typography>

                <TextField
                    label="Username"
                    required
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />

                <TextField
                    label="Email"
                    type="email"
                    required
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    error={email.length > 0 && !emailPattern.test(email)}
                    helperText={
                        email.length > 0 && !emailPattern.test(email)
                            ? "Enter a valid email"
                            : ""
                    }
                />

                <TextField
                    label="Password"
                    type="password"
                    required
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <Typography
                    variant="body2"
                    align="right"
                    className="register-footer-text"
                >
                    or{" "}
                    <Link to="/login" className="register-login-link">
                        login
                    </Link>
                </Typography>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={!username.trim() || !email.trim() || !password.trim()}
                >
                    Register
                </Button>
            </Box>
        </div>
    );
}
