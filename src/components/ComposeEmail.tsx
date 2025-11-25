"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  Snackbar,
  Alert,
  Typography,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { sendEmail } from "@/services/emailService";

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "background.default",
  },
};

interface ComposeEmailProps {
  open: boolean;
  onClose: () => void;
}

export default function ComposeEmail({ open, onClose }: ComposeEmailProps) {
  const [form, setForm] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    content: "",
  });

  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  const [loading, setLoading] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await sendEmail(form);
      router.refresh();
      onClose();
      setForm({ to: "", cc: "", bcc: "", subject: "", content: "" });
      setShowCc(false);
      setShowBcc(false);
    } catch (err) {
      setSnackMessage("Failed to send email");
      setSnackOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>New Email</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>

            {/* TO + CC/BCC buttons (like Gmail) */}
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <TextField
                label="To"
                value={form.to}
                onChange={(e) => handleChange("to", e.target.value)}
                fullWidth
                size="small"
                variant="outlined"
                sx={textFieldStyle}
              />

              {/* CC / BCC clickable text */}
              <Box sx={{ ml: 1, display: "flex", gap: 1 }}>
                {!showCc && (
                  <Typography
                    sx={{ cursor: "pointer", color: "primary.main", userSelect: "none" }}
                    onClick={() => setShowCc(true)}
                    data-testid="compose-email-cc"
                  >
                    Cc
                  </Typography>
                )}
                {!showBcc && (
                  <Typography
                    sx={{ cursor: "pointer", color: "primary.main", userSelect: "none" }}
                    onClick={() => setShowBcc(true)}
                    data-testid="compose-email-bcc"
                  >
                    Bcc
                  </Typography>
                )}
              </Box>
            </Box>

            {showCc && (
              <TextField
                label="Cc"
                value={form.cc}
                onChange={(e) => handleChange("cc", e.target.value)}
                fullWidth
                size="small"
                variant="outlined"
                sx={textFieldStyle}
              />
            )}

            {showBcc && (
              <TextField
                label="Bcc"
                value={form.bcc}
                onChange={(e) => handleChange("bcc", e.target.value)}
                fullWidth
                size="small"
                variant="outlined"
                sx={textFieldStyle}
              />
            )}

            <TextField
              label="Subject"
              value={form.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              sx={textFieldStyle}
            />

            <TextField
              label="Content"
              value={form.content}
              onChange={(e) => handleChange("content", e.target.value)}
              multiline
              rows={6}
              fullWidth
              size="small"
              variant="outlined"
              sx={textFieldStyle}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3500}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
