# Sheetal Birthday Mission 🎂

A cinematic, interactive birthday mini-game made with **HTML + CSS + Vanilla JavaScript**.

## Run locally

Open `index.html` in a browser.

Or use a local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## GitHub Pages

1. Create a new GitHub repository.
2. Upload `index.html`, `style.css`, and `script.js`.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your main branch and `/ (root)`.
6. Save and open the generated GitHub Pages URL.

## Customize

### Name and messages
Open `script.js` and edit:

```js
const CONFIG = {
  name: "Sheetal",
  messages: {
    mission: "...",
    reveal: "...",
    high: "...",
    low: "..."
  }
};
```

The birthday message is also near the bottom of `script.js`.

### Colors
Edit the CSS variables/values in `style.css`. The main visual palette uses gold, purple, blue, black, and navy.

### Photos
To add photos later, put images in an `assets/` folder and reference them from HTML/CSS, for example:

```html
<img src="assets/sheetal-photo.jpg" alt="Sheetal">
```

No backend or build step is required.
