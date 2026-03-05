# 🚀 PostHub - QUICK START CHEAT SHEET

## 1️⃣ INSTALACJA (5 minut)

### Linux/Mac
```bash
wget https://github.com/pocketbase/pocketbase/releases/download/v0.20.5/pocketbase_0.20.5_linux_amd64.zip
unzip pocketbase_0.20.5_linux_amd64.zip
chmod +x pocketbase
./pocketbase serve
```

### Windows
- Pobierz: https://github.com/pocketbase/pocketbase/releases
- Rozpakuj i kliknij `pocketbase.exe`

🔗 **Admin Panel:** http://localhost:8090/_/

---

## 2️⃣ BAZA DANYCH (2 minuty)

Wejdź w Admin Panel i utwórz:

### Kolekcja `users` (Type: Auth)
```
email       (Email, Required, Unique)
password    (Password, Required)
name        (Text, Required)
```

### Kolekcja `posts` (Type: Base)
```
content     (Text, Required)
author      (Relation to users, Required)
created     (Auto date)
```

### API Rules dla Users
```
List:   @request.auth.id != ""
View:   @request.auth.id != ""
Create: true
Update: @request.auth.id = id
Delete: @request.auth.id = id
```

### API Rules dla Posts
```
List:   true
View:   true
Create: @request.auth.id != ""
Update: @request.auth.id = author.id
Delete: @request.auth.id = author.id
```

---

## 3️⃣ WDROŻENIE (30 sekund)

Otwórz `index.html` w przeglądarce → **GOTOWE!**

```
http://localhost:3000 (jeśli masz http-server)
lub
file:///path/to/index.html
```

---

## 4️⃣ KONFIGURACJA (1 minuta)

W `index.html` zmień:
```javascript
const PB_URL = 'http://localhost:8090'; // ← Tutaj
```

---

## 📋 FUNKCJE

✅ Rejestracja i logowanie  
✅ Tworzenie postów  
✅ Feed postów (sortowanie po dacie)  
✅ Dark theme (jak Twitter)  
✅ Responsive (mobile + desktop)  

---

## 🔗 API ENDPOINTS

```bash
# Register
POST /api/collections/users/records
{
  "email": "test@example.com",
  "password": "password123",
  "passwordConfirm": "password123",
  "name": "Jan Kowalski"
}

# Login
POST /api/collections/users/auth-with-password
{
  "identity": "test@example.com",
  "password": "password123"
}

# Get Posts
GET /api/collections/posts/records?sort=-created&expand=author

# Create Post
POST /api/collections/posts/records
{
  "content": "Hello world!",
  "author": "user_id"
}
```

---

## 🎨 CUSTOMIZATION

### Zmiana kolorów
```css
:root {
    --primary: #1da1f2;        /* Niebieski */
    --bg-primary: #0f1419;     /* Tło */
    --text-primary: #e7e9ea;   /* Tekst */
}
```

### Zmiana nazwy
```html
<h1 class="text-3xl font-bold text-blue-400">
    PostHub  <!-- ← Zmień tutaj -->
</h1>
```

---

## 🐛 DEBUGGING

### Chrome DevTools (F12)
1. **Console** → Sprawdź błędy
2. **Network** → Sprawdź API calls
3. **Application** → Sprawdź local storage

### Czy PocketBase działa?
```bash
curl http://localhost:8090/api/health
# {"code":200,"message":"OK"}
```

### CORS Error?
```javascript
// W AdminPanelu > Settings > CORS:
// Dodaj: *
```

---

## 🚀 NEXT STEPS

- [ ] Dodaj Likes (kolekcja `likes`)
- [ ] Dodaj Comments (kolekcja `comments`)
- [ ] Dodaj Follow System (kolekcja `followers`)
- [ ] Implementuj Search
- [ ] Dodaj Image Uploads
- [ ] Dodaj Notifications
- [ ] Implementuj Hashtags
- [ ] Dodaj Dark/Light Toggle

---

## 📦 STRUKTURA PLIKÓW

```
posthub/
├── index.html                 # Główny plik (HTML+CSS+JS)
├── pocketbase                 # Executable PocketBase
├── pb_data/                   # Baza danych (auto-created)
└── pb_public/                 # Static files (opcjonalne)
```

---

## 🔐 SECURITY TIPS

✅ Zawsze używaj HTTPS w produkcji  
✅ Nie commituj .env z sekretami  
✅ Validator hasła (min 8 znaków)  
✅ Rate limiting na API  
✅ CORS configuration  
✅ Sanitize user input  

---

## 🌐 HOSTING

### Opcja 1: PocketBase + Static Files (EASIEST)
```bash
./pocketbase serve --http=0.0.0.0:8090
# Copy index.html to pb_public/
# Deploy to: https://your-domain.com
```

### Opcja 2: Separate Frontend + Backend
**Frontend:** Vercel, Netlify, GitHub Pages  
**Backend:** Railway, Heroku, DigitalOcean

### Opcja 3: Docker
```dockerfile
FROM node:18
COPY index.html /app/
EXPOSE 8000
CMD ["npx", "http-server", "/app"]
```

---

## 📞 TROUBLESHOOTING

| Problem | Rozwiązanie |
|---------|------------|
| PocketBase nie uruchamia się | Sprawdź czy port 8090 jest wolny: `lsof -i :8090` |
| CORS Error | Zmień PB_URL na pełny URL lub konfiguruj CORS |
| Posty się nie wysyłają | Sprawdź Console (F12), zweryfikuj API Rules |
| Baza danych reset | Usuń `pb_data/` folder i uruchom ponownie |
| Zapomniałem hasła do admina | Usuń `pb_data/data.db` i zacznij od nowa |

---

## 📚 DOKUMENTACJA

- **PocketBase:** https://pocketbase.io
- **Tailwind CSS:** https://tailwindcss.com
- **HTMX:** https://htmx.org
- **Font Awesome:** https://fontawesome.com

---

## 💻 System Requirements

- Node.js (opcjonalnie, tylko dla http-server)
- Przeglądarka nowoczesna (Chrome, Firefox, Safari, Edge)
- Port 8090 dostępny (dla PocketBase)

---

## ⚡ Performance Tips

- Lazy load images
- Paginate posts (zamiast all at once)
- Zakasze API responses
- Minify CSS/JS dla produkcji
- Use CDN dla Tailwind + Font Awesome

---

**🎉 Enjoy your new social media platform! 🎉**
