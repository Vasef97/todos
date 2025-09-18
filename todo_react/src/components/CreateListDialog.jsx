import { useState, useMemo } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Box,
  Button,
  Typography
} from "@mui/material";
import * as Icons from "@mui/icons-material";

const BASE = import.meta.env.VITE_API_BASE_URL;

const PASTEL_COLORS = [
  "#FFA3B9",
  "#99D0FF",
  "#C4E199",
  "#FFE983",
  "#E0B3FF",
  "#A0E1FB",
  "#FFC766",
  "#C0FFC0",
  "#FBC4C4",
  "#B9A5E3"
];

export default function CreateListDialog({ open, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [iconSearch, setIconSearch] = useState("");
  const [selectedIcon, setIcon] = useState("List");
  const [selectedColor, setColor] = useState(PASTEL_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const iconOptions = useMemo(() => {
    return Object.keys(Icons)
      .filter(n => n.toLowerCase().includes(iconSearch.trim().toLowerCase()))
      .slice(0, 20);
  }, [iconSearch]);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Insert a list name please");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const payload = {
        name: name.trim(),
        iconCode: selectedIcon,
        color: selectedColor
      };
      const { data: createdList } = await axios.post(
        `${BASE}/todo-lists`,
        payload,
        { withCredentials: true }
      );
      onCreated(createdList);
      onClose();
      setName("");
      setIcon("List");
      setColor(PASTEL_COLORS[0]);
    } catch (err) {
      console.error("Create list failed:", err);
      setError(err.response?.data?.message || "Σφάλμα δημιουργίας");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      disableRestoreFocus
      PaperProps={{
        sx: {
          borderRadius: "1%"
        }
      }}
    >
      <DialogTitle>Create New List</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="List Name"
          fullWidth
          value={name}
          onChange={e => setName(e.target.value)}
          margin="normal"
        />

        <TextField
          label="Icon Search"
          fullWidth
          value={iconSearch}
          onChange={e => setIconSearch(e.target.value)}
          margin="normal"
        />

        <Grid
          container
          spacing={1}
          sx={{ maxHeight: 200, overflowY: "auto", mb: 2 }}
        >
          {iconOptions.map(iconName => {
            const IconComp = Icons[iconName];
            return (
              <Grid key={iconName}>
                <IconButton
                  onClick={() => setIcon(iconName)}
                  color={iconName === selectedIcon ? "primary" : "default"}
                >
                  <IconComp />
                </IconButton>
              </Grid>
            );
          })}
        </Grid>

        <Typography variant="subtitle1" gutterBottom>
          Choose Color
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {PASTEL_COLORS.map(col => (
            <Box
              key={col}
              onClick={() => setColor(col)}
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                bgcolor: col,
                cursor: "pointer",
                border:
                  col === selectedColor
                    ? "2px solid rgb(109,106,98)"
                    : "1px solid #ccc"
              }}
            />
          ))}
        </Box>

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          CANCEL
        </Button>
        <Button onClick={handleCreate} disabled={loading} variant="contained">
          CREATE
        </Button>
      </DialogActions>
    </Dialog>
  );
}
