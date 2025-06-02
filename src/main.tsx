import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import ChatWidget from "./components/chat-widget";

const queryClient = new QueryClient();

const containerId = "cakra-chat-widget-container";

let container = document.getElementById(containerId);
if (!container) {
  container = document.createElement("div");
  container.id = containerId;
  document.body.appendChild(container);
}

// ✅ Ambil data dari window global
const user_profile = window.cakra_personal_data || {};
const token = window.cakra_chat_api_id || "";
const cakra_chat_api_key = window.cakra_chat_api_key || "";

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChatWidget
        user_profile={user_profile}
        token={token}
        cakra_chat_api_key={cakra_chat_api_key}
      />
    </QueryClientProvider>
  </React.StrictMode>
);
