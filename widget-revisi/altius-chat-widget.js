(() => {
  // Configuration
  const API_BASE_URL =
    "https://aionegml-dev-c3aqcqg7abhhb2ag.southeastasia-01.azurewebsites.net";

  // Widget state
  let isWidgetOpen = false;
  let isLoading = false;
  const messages = [];

  // DOM elements
  let widget,
    chatContainer,
    messagesContainer,
    inputField,
    sendButton,
    toggleButton;

  // Initialize widget when DOM is ready
  function init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", createWidget);
    } else {
      createWidget();
    }
  }

  // Create widget HTML structure
  function createWidget() {
    // Check required variables
    if (
      !window.chat_api_key ||
      !window.personal_data ||
      !window.chat_api_tenant
    ) {
      console.error("Altius Chat Widget: Required variables missing");
      return;
    }

    // Create widget container
    widget = document.createElement("div");
    widget.id = "chat-widget";
    widget.innerHTML = `
            <div id="chat-toggle" class="chat-toggle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="white"/>
                    <path d="M7 9H17V11H7V9ZM7 12H15V14H7V12Z" fill="white"/>
                </svg>
                <span class="chat-badge">1</span>
            </div>
            <div id="chat-container" class="chat-container">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <div class="chat-title">Altius Assistant</div>
                        <div class="chat-status">Online</div>
                    </div>
                    <button id="chat-close" class="chat-close">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.25 4.81L13.19 3.75L9 7.94L4.81 3.75L3.75 4.81L7.94 9L3.75 13.19L4.81 14.25L9 10.06L13.19 14.25L14.25 13.19L10.06 9L14.25 4.81Z" fill="white"/>
                        </svg>
                    </button>
                </div>
                <div id="chat-messages" class="chat-messages">
                    <div class="message bot-message">
                        <div class="message-content">
                            <div class="message-text">Halo! Saya Altius Assistant. Ada yang bisa saya bantu?</div>
                            <div class="message-time">${getCurrentTime()}</div>
                        </div>
                    </div>
                </div>
                <div class="chat-input-container">
                    <div class="chat-input-wrapper">
                        <input type="text" id="chat-input" class="chat-input" placeholder="Ketik pesan Anda..." maxlength="500">
                        <button id="chat-send" class="chat-send">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 10L17.5 2.5L15 10L17.5 17.5L2.5 10Z" fill="white"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

    // Add CSS styles
    addStyles();

    // Append to body
    document.body.appendChild(widget);

    // Get DOM references
    toggleButton = document.getElementById("chat-toggle");
    chatContainer = document.getElementById("chat-container");
    messagesContainer = document.getElementById("chat-messages");
    inputField = document.getElementById("chat-input");
    sendButton = document.getElementById("chat-send");

    // Add event listeners
    addEventListeners();

    // Initialize session
    initializeSession();
  }

  // Add CSS styles
  function addStyles() {
    const styles = `
            #chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            }
            
            .chat-toggle {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
                transition: all 0.3s ease;
                position: relative;
            }
            
            .chat-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
            }
            
            .chat-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ff4757;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
            }
            
            .chat-container {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                display: none;
                flex-direction: column;
                overflow: hidden;
                animation: slideUp 0.3s ease;
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .chat-container.open {
                display: flex;
            }
            
            .chat-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 16px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .chat-header-info {
                flex: 1;
            }
            
            .chat-title {
                font-weight: 600;
                font-size: 16px;
                margin-bottom: 2px;
            }
            
            .chat-status {
                font-size: 12px;
                opacity: 0.9;
            }
            
            .chat-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: background 0.2s ease;
            }
            
            .chat-close:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                background: #f8f9fa;
            }
            
            .chat-messages::-webkit-scrollbar {
                width: 4px;
            }
            
            .chat-messages::-webkit-scrollbar-track {
                background: transparent;
            }
            
            .chat-messages::-webkit-scrollbar-thumb {
                background: #ddd;
                border-radius: 2px;
            }
            
            .message {
                margin-bottom: 16px;
                display: flex;
                align-items: flex-end;
            }
            
            .user-message {
                justify-content: flex-end;
            }
            
            .message-content {
                max-width: 80%;
                position: relative;
            }
            
            .message-text {
                padding: 12px 16px;
                border-radius: 18px;
                font-size: 14px;
                line-height: 1.4;
                word-wrap: break-word;
            }
            
            .bot-message .message-text {
                background: white;
                color: #333;
                border-bottom-left-radius: 4px;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            }
            
            .user-message .message-text {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-bottom-right-radius: 4px;
            }
            
            .message-time {
                font-size: 11px;
                color: #999;
                margin-top: 4px;
                text-align: right;
            }
            
            .user-message .message-time {
                text-align: left;
            }
            
            .chat-input-container {
                padding: 16px;
                background: white;
                border-top: 1px solid #eee;
            }
            
            .chat-input-wrapper {
                display: flex;
                align-items: center;
                background: #f5f5f5;
                border-radius: 25px;
                padding: 4px;
            }
            
            .chat-input {
                flex: 1;
                border: none;
                background: none;
                padding: 12px 16px;
                font-size: 14px;
                outline: none;
                border-radius: 25px;
            }
            
            .chat-input::placeholder {
                color: #999;
            }
            
            .chat-send {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .chat-send:hover:not(:disabled) {
                transform: scale(1.05);
            }
            
            .chat-send:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            .loading-dots {
                display: inline-block;
            }
            
            .loading-dots::after {
                content: '';
                animation: dots 1.5s infinite;
            }
            
            @keyframes dots {
                0%, 20% { content: ''; }
                40% { content: '.'; }
                60% { content: '..'; }
                80%, 100% { content: '...'; }
            }
            
            @media (max-width: 480px) {
                .chat-container {
                    width: calc(100vw - 40px);
                    height: calc(100vh - 120px);
                    bottom: 80px;
                    right: 20px;
                }
            }
        `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  // Add event listeners
  function addEventListeners() {
    toggleButton.addEventListener("click", toggleWidget);
    document
      .getElementById("chat-close")
      .addEventListener("click", closeWidget);
    sendButton.addEventListener("click", sendMessage);
    inputField.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Close widget when clicking outside
    document.addEventListener("click", (e) => {
      if (isWidgetOpen && !widget.contains(e.target)) {
        closeWidget();
      }
    });
  }

  // Toggle widget visibility
  function toggleWidget() {
    if (isWidgetOpen) {
      closeWidget();
    } else {
      openWidget();
    }
  }

  // Open widget
  function openWidget() {
    isWidgetOpen = true;
    chatContainer.classList.add("open");
    document.querySelector(".chat-badge").style.display = "none";
    inputField.focus();
  }

  // Close widget
  function closeWidget() {
    isWidgetOpen = false;
    chatContainer.classList.remove("open");
  }

  // Initialize session
  async function initializeSession() {
    if (!window.session_id) {
      try {
        const response = await fetch(`${API_BASE_URL}/create_session`, {
          method: "GET",
          headers: {
            "qubisa-token-key": window.chat_api_key,
          },
        });

        if (response.ok) {
          const data = await response.json();
          window.session_id = data.session_id;
        } else {
          console.error("Failed to create session:", response.statusText);
        }
      } catch (error) {
        console.error("Error creating session:", error);
      }
    }
  }

  // Send message
  async function sendMessage() {
    const message = inputField.value.trim();
    if (!message || isLoading) return;

    // Add user message to chat
    addMessage(message, "user");
    inputField.value = "";

    // Show loading
    setLoading(true);
    const loadingMessage = addMessage(
      'Sedang mengetik<span class="loading-dots"></span>',
      "bot",
      true
    );

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "qubisa-token-key": window.chat_api_key,
        },
        body: JSON.stringify({
          session_id: window.session_id,
          prompt: message,
          user_profile: window.personal_data,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Remove loading message
        loadingMessage.remove();
        // Add bot response
        addMessage(data.response, "bot");
      } else {
        loadingMessage.remove();
        addMessage("Maaf, terjadi kesalahan. Silakan coba lagi.", "bot");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      loadingMessage.remove();
      addMessage("Maaf, terjadi kesalahan koneksi. Silakan coba lagi.", "bot");
    } finally {
      setLoading(false);
    }
  }

  // Add message to chat
  function addMessage(text, sender, isLoading = false) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}-message`;

    messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${text}</div>
                ${
                  !isLoading
                    ? `<div class="message-time">${getCurrentTime()}</div>`
                    : ""
                }
            </div>
        `;

    messagesContainer.appendChild(messageDiv);
    scrollToBottom();

    return messageDiv;
  }

  // Set loading state
  function setLoading(loading) {
    isLoading = loading;
    sendButton.disabled = loading;
    inputField.disabled = loading;
  }

  // Scroll to bottom
  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Get current time
  function getCurrentTime() {
    return new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Initialize widget
  init();
})();
