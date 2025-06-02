import { Box, Paper, Typography } from "@mui/material";
import "./App.css";

// Import langsung komponen ChatWidget
import ChatWidget from "./components/chat-widget";

// Konfigurasi widget
const widgetConfig = {
  botName: "altiuspeople",
  position: "bottom-right",
  buttonColor: "#d32f2f",
  buttonHoverColor: "#b71c1c",
  chatBackground: "#e3e9ef",
  headerBackground: "#f5f5f5",
  userMessageColor: "primary.main",
  botMessageColor: "grey.200",
  placeholderText: "Ketikkan pesanmu...",
  width: 360,
  height: 500,
};

// Inisialisasi React Query

function App() {
  // Simulasi props yang biasa dikirim saat embed
  const props = {
    token: "your-auth-token",
    user_profile: {
      name: "Fani Adi Frihandoko",
      nip: "012",
      gender: "Laki-laki",
      birthdate: "01/01/1990",
    },
    cakra_chat_api_key: "ba166318-3de1-4e48-9d52-7f3075acb142",
    ...widgetConfig, // Menggabungkan konfigurasi widget dengan props
  };

  return (
    <>
      <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          AI Chatbot Widget Demo
        </Typography>
        <Typography color="text.secondary" mb={2}>
          Ini adalah demonstrasi widget chatbot AI yang bisa di-embed. Widget
          akan muncul sebagai tombol mengambang di pojok layar Anda.
        </Typography>
        <Typography variant="h6" gutterBottom>
          Konfigurasi Saat Ini:
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: "#f7fafd" }}>
          <pre style={{ margin: 0 }}>
            {`{
  "botName": "altiuspeople",
  "position": "bottom-right",
  "buttonColor": "#d32f2f",
  "buttonHoverColor": "#b71c1c",
  "chatBackground": "#e3e9ef",
  "headerBackground": "#f5f5f5",
  "userMessageColor": "primary.main",
  "botMessageColor": "grey.200",
  "placeholderText": "Ketikkan pesanmu...",
  "width": 360,
  "height": 500
}`}
          </pre>
        </Paper>
        <Typography gutterBottom>
          Untuk embed widget ini di website Anda, tambahkan script berikut:
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: "#f7fafd" }}>
          <pre style={{ margin: 0 }}>
            {`<script src="https://yourdomain.com/widget.js"></script>
<script>
  window.renderChatWidget("root", {
    token: "xxx",
    user_profile: {
      name: "Fani",
      nip: "012",
      gender: "Laki-laki",
      birthdate: "01/01/1990"
    },
    cakra_chat_api_key: "your-api-key"
  });
</script>`}
          </pre>
        </Paper>
      </Box>
      {/* 🧠 Chatbot widget tampil langsung di pojok kanan bawah */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}>
        <ChatWidget {...props} />
      </div>
    </>
  );
}

export default App;
