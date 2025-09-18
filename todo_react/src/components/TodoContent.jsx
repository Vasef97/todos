import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import "../styles/TodoContent.css";

const BASE = import.meta.env.VITE_API_BASE_URL;

export default function TodoContent({ selectedList, colorCode }) {
  const [listMeta, setListMeta] = useState(null);
  const [todos, setTodos] = useState([]);
  const [newText, setNewText] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editError, setEditError] = useState("");

  useEffect(() => {
    if (!selectedList) {
      setListMeta(null);
      setTodos([]);
      return;
    }

    axios
      .get(`${BASE}/todo-lists/${selectedList}`, { withCredentials: true })
      .then(res => setListMeta(res.data))
      .catch(() => setListMeta(null))
      .finally(fetchItems);
  }, [selectedList]);

  const fetchItems = () => {
    axios
      .get(`${BASE}/todo-lists/${selectedList}/items`, { withCredentials: true })
      .then(res => setTodos(res.data.data || []))
      .catch(() => setTodos([]));
  };

  const handleAdd = () => {
    if (!newText.trim()) return;
    axios
      .post(
        `${BASE}/todo-lists/${selectedList}/items`,
        { text: newText.trim() },
        { withCredentials: true }
      )
      .then(() => {
        setNewText("");
        fetchItems();
      })
      .catch(err => console.error("Add failed:", err));
  };

  const handleToggle = id => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    axios
      .put(
        `${BASE}/todo-lists/${selectedList}/items/${id}`,
        { text: todo.text, done: !todo.done },
        { withCredentials: true }
      )
      .then(fetchItems)
      .catch(err => console.error("Toggle failed:", err));
  };

  const handleEditOpen = (id, currentText) => {
    setEditId(id);
    setEditText(currentText);
    setEditError("");
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (!editText.trim()) {
      setEditError("Todo text cannot be empty.");
      return;
    }
    const todo = todos.find(t => t.id === editId);
    axios
      .put(
        `${BASE}/todo-lists/${selectedList}/items/${editId}`,
        { text: editText.trim(), done: todo?.done || false },
        { withCredentials: true }
      )
      .then(() => {
        setEditOpen(false);
        fetchItems();
      })
      .catch(err => {
        console.error("Edit failed:", err);
        setEditError("Something went wrong.");
      });
  };

  const handleEditClose = () => setEditOpen(false);

  const handleDelete = id => {
    axios
      .delete(`${BASE}/todo-lists/${selectedList}/items/${id}`, {
        withCredentials: true
      })
      .then(fetchItems)
      .catch(err => console.error("Delete failed:", err));
  };

  if (!selectedList || !listMeta) {
    return (
      <Box className="todo-container">
        <Typography variant="h6" color="textSecondary" sx={{ m: 10 }}>
          Choose a list or create a new one!
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="todo-content"
      style={{
        borderBottom: `5px solid ${colorCode || "#ccc"}`,
        borderRight: `5px solid ${colorCode || "#ccc"}`
      }}>
      <List className="todo-list">
        {todos.map(({ id, text, done }) => (
          <React.Fragment key={id}>
            <ListItem
              className="todo-item"
              onClick={() => handleToggle(id)}
              sx={{
                cursor: "pointer"
                  ? theme => theme.palette.action.selected
                  : "inherit",
                "&:hover": {
                  cursor: 'pointer',
                  backgroundColor: theme =>
                    done
                      ? theme.palette.action.selected
                      : theme.palette.action.hover
                }
              }}
            >
              <IconButton
                size="small"
                onClick={e => {
                  e.stopPropagation();
                  handleToggle(id);
                }}
              >
                <CheckCircleIcon
                  fontSize="small"
                  color={done ? "success" : "disabled"}
                />
              </IconButton>

              <ListItemText
                primary={text}
                sx={{
                  textDecoration: done ? "line-through" : "none",
                  color: done ? "text.disabled" : "text.primary"
                }}
              />

              <Tooltip title="Edit this todo" placement="left">
                <IconButton
                  size="small"
                  onClick={e => {
                    e.stopPropagation();
                    handleEditOpen(id, text);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete this todo" placement="left">
                <IconButton
                  size="small"
                  onClick={e => {
                    e.stopPropagation();
                    handleDelete(id);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </ListItem>

          </React.Fragment>
        ))}
      </List>

      <Box className="todo-form" sx={{ mt: 2, display: "flex", gap: 1 }}>
        <TextField
          variant="outlined"
          placeholder="Create new todo…"
          fullWidth
          size="small"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onKeyPress={e => e.key === "Enter" && handleAdd()}
        />
        <Tooltip title="Create new todo" placement="top">
          <IconButton onClick={handleAdd} color="primary" aria-label="Add todo">
            <SendIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Dialog
        open={editOpen}
        onClose={handleEditClose}
        sx={{
          "& .MuiDialog-paper": {
            width: "500px",
            maxWidth: "90%",
            borderBottom: `5px solid ${colorCode || "#ccc"}`,
            borderRight: `5px solid ${colorCode || "#ccc"}`,

          }
        }}
      >
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          <TextField
            value={editText}
            onChange={e => {
              setEditText(e.target.value);
              if (editError) setEditError("");
            }}
            autoFocus
            margin="dense"
            fullWidth
            error={!!editError}
            helperText={editError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
