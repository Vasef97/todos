import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  CircularProgress,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import * as Icons from "@mui/icons-material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import { intensifyColor } from "../utils/colorUtils";
import "../styles/Sidebar.css";

const BASE = import.meta.env.VITE_API_BASE_URL;

export default function Sidebar({ selectedId, onSelect }) {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [optionsOpen, setOptionsOpen] = useState(false);

  useEffect(() => {
    setError("");
    setLoading(true);
    axios
      .get(`${BASE}/todo-lists`, { withCredentials: true })
      .then(res => {
        const arr = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
            ? res.data.data
            : [];
        setLists(arr);
      })
      .catch(err => {
        if (err.response?.status === 401) {
          navigate("/login");
          return;
        }
        setError(err.response?.data?.message || "Error loading lists");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleDeleteList = (e, id) => {
    e.stopPropagation();
    axios
      .delete(`${BASE}/todo-lists/${id}`, { withCredentials: true })
      .then(() => {
        setLists(current => current.filter(list => list.id !== id));
        if (selectedId === id) {
          onSelect(null, null);
        }
      })
      .catch(err => console.error("Delete list failed:", err));
  };

  const openOptions = () => setOptionsOpen(true);
  const closeOptions = () => setOptionsOpen(false);

  const handleDeleteAccount = () => {
    axios
      .delete(`${BASE}/auth/me`, { withCredentials: true })
      .then(() => {
        navigate("/register");
      })
      .catch(err => {
        console.error("Delete account failed:", err);
      });
  };

  if (loading) {
    return (
      <div className="sidebar-container" style={{ textAlign: "center", padding: "1rem" }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="sidebar-container" style={{ padding: "1rem" }}>
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  return (
    <Box
      className="sidebar-container"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%"
      }}
    >
      <List>
        {lists.map(list => {
          const IconComponent = Icons[list.iconCode] || Icons.List;
          return (
            <ListItemButton
              key={list.id}
              selected={list.id === selectedId}
              onClick={() => onSelect(list.id, list.color)}
            >
              <ListItemIcon>
                <IconComponent
                  style={{ color: intensifyColor(list.color, 0.8) || "#000" }}
                />
              </ListItemIcon>
              <ListItemText primary={list.name} />
              <Tooltip title="Remove this list" placement="left">
                <IconButton
                  size="small"
                  edge="end"
                  onClick={e => handleDeleteList(e, list.id)}
                  color="gray"
                  aria-label="delete list"
                >
                  <RemoveCircleOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </ListItemButton>
          );
        })}
      </List>


      <Box sx={{ flexGrow: 1 }} />
      <Box
        sx={{
          mb: 4,
          ml: 3,
          display: "flex",
          alignItems: "center",
          gap: 2
        }}
      >
        <Tooltip title="Account Settings" placement="top">
          <IconButton size="small" onClick={openOptions}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="About" placement="top">
          <IconButton size="small" onClick={() => navigate("/about")}>
            <InfoIcon />
          </IconButton>
        </Tooltip>

        <Typography
          variant="caption"
          color="textSecondary"
          sx={{
            mx: "auto", pt: 2
          }}
        >
          © 2025 Efstahiou Vasileios
        </Typography>
      </Box>

      <Dialog open={optionsOpen} onClose={closeOptions}>
        <DialogTitle>Account Settings</DialogTitle>
        <DialogContent>
          <Typography>
            Here you can delete your account. This action is irreversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeOptions}>Cancel</Button>
          <Button color="error" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
