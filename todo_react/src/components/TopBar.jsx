import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import "../styles/TopBar.css";

const BASE = import.meta.env.VITE_API_BASE_URL;

export default function TopBar({ onAddClick }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE}/auth/logout`, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
    navigate("/login");
  };

  return (
    <Box component="header" className="topbar-header">
      <Typography className="topbar-title">todos</Typography>

      <div className="topbar-actions">
        <Tooltip title="Create a new List" placement="bottom-end">
          <IconButton onClick={onAddClick} aria-label="Add" className="topbar-button">
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Logout" placement="bottom-end">
          <IconButton onClick={handleLogout} aria-label="Logout" className="topbar-button">
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </div>
    </Box>
  );
}
