// src/components/technicians/AddTechnicianDialog.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControlLabel,
  Switch,
  Chip,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import technicianService from "../../services/technicianService";
import { colors } from "../../theme";

// Fields match CreateTechnicianRequest exactly (as used in
// TechnicianService.createTechnician): firstName, lastName, username,
// email, password, phoneNumber, region, availability, skills.
const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  phoneNumber: "",
  region: "",
  availability: true,
  skills: [],
};

export default function AddTechnicianDialog({ open, onClose, onCreated, onToast }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [skillInput, setSkillInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const setField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value || form.skills.includes(value)) return;
    setForm((f) => ({ ...f, skills: [...f.skills, value] }));
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));
  };

  const validate = () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "Required";
    if (!form.lastName.trim()) next.lastName = "Required";
    if (!form.username.trim()) next.username = "Required";
    if (!form.email.trim()) next.email = "Required";
    if (!form.password.trim() || form.password.length < 6) next.password = "Min 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleClose = () => {
    if (submitting) return;
    setForm(EMPTY_FORM);
    setSkillInput("");
    setErrors({});
    onClose();
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await technicianService.create(form);
      onToast && onToast({ type: "success", message: `${form.firstName} ${form.lastName} added` });
      setForm(EMPTY_FORM);
      setSkillInput("");
      onCreated && onCreated();
      onClose();
    } catch (error) {
      console.error("Create technician error:", error);
      // ASSUMPTION: backend throws RuntimeException("Username already exists.")
      // / "Email already exists." — adjust the message extraction below if
      // your error response shape is different.
      const message = error.response?.data?.message || error.response?.data || "Could not create technician.";
      onToast && onToast({ type: "error", message: typeof message === "string" ? message : "Could not create technician." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
      <DialogTitle sx={{ fontWeight: 700, fontSize: "1.1rem", color: colors.textPrimary }}>
        Add Technician
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 0.5 }}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="First name"
              fullWidth
              size="small"
              value={form.firstName}
              onChange={setField("firstName")}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
            <TextField
              label="Last name"
              fullWidth
              size="small"
              value={form.lastName}
              onChange={setField("lastName")}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Stack>

          <TextField
            label="Username"
            fullWidth
            size="small"
            value={form.username}
            onChange={setField("username")}
            error={!!errors.username}
            helperText={errors.username}
          />

          <TextField
            label="Email"
            type="email"
            fullWidth
            size="small"
            value={form.email}
            onChange={setField("email")}
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            size="small"
            value={form.password}
            onChange={setField("password")}
            error={!!errors.password}
            helperText={errors.password}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              label="Phone number"
              fullWidth
              size="small"
              value={form.phoneNumber}
              onChange={setField("phoneNumber")}
            />
            <TextField
              label="Region"
              fullWidth
              size="small"
              placeholder="e.g. Casablanca"
              value={form.region}
              onChange={setField("region")}
            />
          </Stack>

          <FormControlLabel
            control={
              <Switch
                checked={form.availability}
                onChange={(e) => setForm((f) => ({ ...f, availability: e.target.checked }))}
                color="success"
              />
            }
            label={form.availability ? "Available" : "Unavailable"}
          />

          <Box>
            <Typography fontSize="0.8rem" fontWeight={600} color={colors.textSecondary} mb={0.75}>
              Skills
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="e.g. Inverter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button onClick={addSkill} variant="outlined" sx={{ textTransform: "none", flexShrink: 0 }}>
                Add
              </Button>
            </Stack>
            <Box display="flex" flexWrap="wrap" gap={0.75}>
              {form.skills.map((skill) => (
                <Chip key={skill} label={skill} size="small" onDelete={() => removeSkill(skill)} />
              ))}
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={handleClose} disabled={submitting} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          variant="contained"
          sx={{
            textTransform: "none", fontWeight: 700, borderRadius: "8px",
            backgroundColor: colors.brand, "&:hover": { backgroundColor: colors.brandDark || colors.brand },
          }}
        >
          {submitting ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : "Add Technician"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
