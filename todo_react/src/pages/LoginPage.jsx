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
import "../styles/LoginPage.css";

const BASE = import.meta.env.VITE_API_BASE_URL;

export default function LoginPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async e => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            return toast.error("Please fill username & password");
        }

        try {
            const { data } = await axios.post(
                `${BASE}/auth/login`,
                { username, password },
                { withCredentials: true }
            );
            toast.success(data.message);
            navigate("/main");
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="login-container">
            <Box
                component="form"
                onSubmit={handleLogin}
                noValidate
                className="login-box"
            >
                <Typography variant="h5" gutterBottom>
                    Login
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
                    className="login-footer-text"
                >
                    or{" "}
                    <Link to="/register" className="login-signup-link">
                        signup
                    </Link>
                </Typography>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={!username.trim() || !password.trim()}
                >
                    Login
                </Button>
            </Box>
        </div>
    );
}
