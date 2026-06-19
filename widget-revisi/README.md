# Altius Chat Widget

Widget chat yang dapat diintegrasikan ke website dengan mudah. Widget ini menggunakan API untuk berkomunikasi dengan AI assistant.

## Struktur File

```
widget-revisi/
├── altius-chat-widget.min.js    # File JavaScript utama widget
├── css/
│   └── chat-widget.css          # File CSS untuk styling widget
├── index.html                   # File demo untuk testing
└── README.md                    # Dokumentasi ini
```

## Cara Integrasi

### 1. Tambahkan Konfigurasi

Tambahkan script konfigurasi sebelum memuat widget:

```html
<script>
  window.session_id = ""; // Optional - ID session (kosong untuk auto-generate)
  window.chat_api_key = "YOUR_API_KEY"; // Required - API key untuk autentikasi
  window.personal_data = "Data Personal"; // Required - Data personal user
</script>
```

### 2. Load Widget

Tambahkan script widget setelah konfigurasi:

```html
<script src="altius-chat-widget.min.js"></script>
```

## Fitur

- ✅ Widget chat yang responsif
- ✅ Auto-session management
- ✅ Loading indicator
- ✅ Animasi smooth
- ✅ CSS terpisah untuk kemudahan maintenance
- ✅ Error handling
- ✅ Keyboard support (Enter untuk kirim)

## API Endpoints

Widget menggunakan endpoint berikut:

- **Create Session**: `https://aionegml-dev-c3aqcqg7abhhb2ag.southeastasia-01.azurewebsites.net/create_session`
- **Chat**: `https://aionegml-dev-c3aqcqg7abhhb2ag.southeastasia-01.azurewebsites.net/chat`

## Styling

CSS widget berada di file `css/chat-widget.css` dan akan otomatis di-load oleh widget. Anda dapat mengkustomisasi styling dengan mengedit file CSS tersebut.

## Testing

Untuk testing lokal:

1. Jalankan server HTTP:

   ```bash
   python -m http.server 8000
   ```

2. Buka browser dan akses `http://localhost:8000`

3. Widget akan muncul di pojok kanan bawah halaman

## Troubleshooting

- Pastikan `window.chat_api_key` dan `window.personal_data` sudah diset
- Periksa console browser untuk error messages
- Pastikan file CSS dapat diakses di path `css/chat-widget.css`
