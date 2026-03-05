# PostHub - Social Media Template (Twitter Clone)

Pełny, działający template strony social media z logowaniem, bazą danych i funkcją postowania.

## 🚀 Szybki Start

### 1. Pobierz i uruchom PocketBase

PocketBase to backend All-in-One z wbudowaną bazą danych SQLite i adminpanelem.

**Linux/Mac:**
```bash
# Pobierz
wget https://github.com/pocketbase/pocketbase/releases/download/v0.20.5/pocketbase_0.20.5_linux_amd64.zip
unzip pocketbase_0.20.5_linux_amd64.zip

# Uruchom
./pocketbase serve
```

**Windows:**
- Pobierz z: https://github.com/pocketbase/pocketbase/releases
- Rozpakuj i kliknij `pocketbase.exe`

PocketBase uruchomi się na `http://localhost:8090`

---

## 🔧 Konfiguracja Bazy Danych

### AdminPanel PocketBase: http://localhost:8090/_/

**1. Zaloguj się lub utwórz account adminisratora**

**2. Utwórz kolekcję `users`:**
- Kolumny:
  - `email` (text, required, unique) 
  - `password` (password, required)
  - `name` (text, required)
  - `avatar_url` (text, optional)

**3. Utwórz kolekcję `posts`:**
- Kolumny:
  - `content` (text, required) - treść posta
  - `author` (relation to users, required)
  - `created` (datetime, auto)
  - `updated` (datetime, auto)

**4. (Opcjonalne) Utwórz kolekcję `likes`:**
- Kolumny:
  - `user` (relation to users, required)
  - `post` (relation to posts, required)

### Ustawienia Security

W AdminPanelu > Kolekcja `users` > API Rules:
```
List:    @request.auth.id != ''
View:    @request.auth.id != ''
Create:  true (dla rejestracji)
Update:  @request.auth.id = id
Delete:  @request.auth.id = id
```

W AdminPanelu > Kolekcja `posts` > API Rules:
```
List:    true (wszyscy mogą czytać)
View:    true
Create:  @request.auth.id != ''
Update:  @request.auth.id = author.id
Delete:  @request.auth.id = author.id
```

---

## 📁 Struktura Projektu

```
project/
├── index.html          # Główna aplikacja (wszystko w jednym pliku)
├── pocketbase/         # Folder PocketBase (jeśli instalujesz lokalnie)
└── pb_data/            # Baza danych PocketBase (auto-tworzona)
```

---

## 🎨 Stack Techniczny

- **Frontend:** Vanilla HTML/CSS/JS
- **Styling:** Tailwind CSS 3
- **Interaktywność:** HTMX (dla dynamicznych aktualizacji)
- **Backend:** PocketBase (SQLite + Auth + REST API)
- **Icons:** Font Awesome 6
- **Typography:** Google Fonts (Outfit + Inter)

---

## 🔑 Główne Funkcje

✅ **Rejestracja i Logowanie**
- Tworzenie nowych kont
- Bezpieczne hasła
- Sesje użytkownika

✅ **Tworzenie Postów**
- Tylko zalogowani użytkownicy mogą pisać
- Walidacja zawartości
- Real-time update feedu

✅ **Feed Postów**
- Sortowanie po dacie (najnowsze najpierw)
- Informacje o autorze
- Responsive design

✅ **Interfejs User-Friendly**
- Dark theme (jak Twitter/X)
- Mobile-friendly
- Smooth animations

---

## 🔗 API Endpoints (PocketBase)

### Authentication
```
POST /api/collections/users/auth-with-password
{
  "identity": "email@example.com",
  "password": "password123"
}
```

### Posts
```
GET /api/collections/posts/records?sort=-created&expand=author
POST /api/collections/posts/records
{
  "content": "Hello world!",
  "author": "user_id"
}
```

---

## ⚙️ Zmienne Konfiguracyjne

W pliku `index.html` zmień URL PocketBase:

```javascript
const PB_URL = 'http://localhost:8090'; // Zmień na swój URL
```

Jeśli hostujesz na produkcji:
```javascript
const PB_URL = 'https://twoja-domena.com'; // Twój PocketBase server
```

---

## 🚀 Deployment

### Opcja 1: PocketBase + Static Files

```bash
# 1. Uruchom PocketBase z CORS enabled
./pocketbase serve --http=0.0.0.0:8090

# 2. Skopiuj index.html do folderu pb_public
cp index.html ./pb_public/index.html

# Otwórz: https://twoja-domena.com
```

### Opcja 2: Separate Frontend

**Frontend na Vercel/Netlify:**
```bash
netlify deploy --prod --dir=.
```

**Backend na Railway/Heroku:**
```bash
heroku create my-app
heroku config:set POCKETBASE_URL=...
git push heroku main
```

### Opcja 3: Docker

```dockerfile
FROM node:18
WORKDIR /app
COPY index.html .
EXPOSE 8000
CMD ["npx", "http-server", "."]
```

---

## 📝 Customization

### Zmiana Kolorów

W `<style>`:
```css
:root {
    --primary: #1da1f2;           /* Główny kolor (niebieski) */
    --bg-primary: #0f1419;        /* Tło */
    --text-primary: #e7e9ea;      /* Tekst */
}
```

### Zmiana Logo/Nazwy

W sidebarze:
```html
<h1 class="text-3xl font-bold text-blue-400">
    <i class="fas fa-feather"></i> PostHub  <!-- Zmień tutaj -->
</h1>
```

### Dodanie Nowych Funkcji

Struktura kodu:
```javascript
// 1. Dodaj endpoint API
async function newFeature() {
    const data = await pb.collection('...').create({...});
}

// 2. Dodaj UI
<button onclick="newFeature()">Kliknij</button>

// 3. Testuj w przeglądarce (F12)
```

---

## 🐛 Troubleshooting

**Problem:** "CORS Error"
```
Rozwiązanie: Wyłącz CORS na PocketBase lub użyj proxy
```

**Problem:** "PocketBase nie conecta"
```
1. Sprawdź czy jest uruchomiony: lsof -i :8090
2. Zmień URL w index.html
3. Sprawdź firewall
```

**Problem:** "Posty się nie wysyłają"
```
1. Otwórz DevTools (F12)
2. Sprawdź Network i Console
3. Zweryfikuj API Rules w AdminPanelu
```

---

## 📚 Dokumentacja

- **PocketBase:** https://pocketbase.io/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **HTMX:** https://htmx.org/
- **Font Awesome:** https://fontawesome.com/

---

## 📄 Licencja

MIT - Free to use and modify

---

## 💡 Wskazówki

- Dodaj avatar user uploadem (File field w PocketBase)
- Implementuj likes/dislikes z kolekcją `likes`
- Dodaj replies/comments z kolekcją `comments`
- Implementuj hashtags z wyszukiwaniem full-text
- Dodaj email notifications dla replies
- Zrób follow system (relation `followers`)

Powodzenia! 🚀
