import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";

interface Message {
  from: "user" | "bot";
  text: string;
}

interface ChatWidgetProps {
  user_profile: Record<string, any>;
  token: string;
  cakra_chat_api_key: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  user_profile,
  token,
  cakra_chat_api_key,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const { mutate, status } = useMutation({
    mutationFn: async (prompt: string) => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await axios.post(
        "https://agiqubisaai-api-dev-fhf0cwfdbnhqcfda.southeastasia-01.azurewebsites.net/chat",
        {
          prompt,
          user_profile,
          chat_history: messages.map((msg) => ({
            role: msg.from === "user" ? "user" : "assistant",
            content: msg.text,
          })),
        },
        {
          headers: {
            "Content-Type": "application/json",
            "qubisa-token-key": cakra_chat_api_key,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      const reply = data?.response || "Maaf, terjadi kesalahan.";
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "❌ Gagal mengirim pesan. Coba lagi." },
      ]);
    },
  });

  const handleSend = () => {
    if (!input.trim()) return;
    const message: Message = { from: "user", text: input };
    setMessages((prev) => [...prev, message]);
    mutate(input);
    setInput("");
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1300,
      }}
    >
      {open ? (
        <Paper
          elevation={8}
          sx={{
            width: 360,
            height: 500,
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              bgcolor: "#f5f5f5",
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              altiuspeople
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: "auto",
              bgcolor: "#e3e9ef",
            }}
          >
            {messages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  mb: 1.5,
                  display: "flex",
                  justifyContent:
                    msg.from === "user" ? "flex-end" : "flex-start",
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 1.5,
                    maxWidth: "75%",
                    bgcolor: msg.from === "user" ? "primary.main" : "grey.200",
                    color: msg.from === "user" ? "white" : "black",
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                </Paper>
              </Box>
            ))}
            {status === "pending" && (
              <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                <CircularProgress size={20} />
              </Box>
            )}
          </Box>
          <Box sx={{ display: "flex", p: 1.5, borderTop: "1px solid #ccc" }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Ketikkan pesanmu..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <IconButton color="primary" onClick={handleSend} sx={{ ml: 1 }}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      ) : (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            bgcolor: "#d32f2f",
            color: "white",
            "&:hover": { bgcolor: "#b71c1c" },
          }}
          size="large"
        >
          <ChatIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default ChatWidget;
