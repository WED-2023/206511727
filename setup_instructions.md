# הוראות הקמה מהירה

## 1. צור תיקיית פרויקט חדשה
```bash
npx create-react-app vocabulary-game
cd vocabulary-game
```

## 2. התקן תלויות
```bash
npm install lucide-react xlsx
npm install -D tailwindcss postcss autoprefixer gh-pages
npx tailwindcss init -p
```

## 3. מבנה תיקיות
צור את המבנה הבא:
```
vocabulary-game/
├── public/
│   ├── index.html
│   └── word.xlsx ← שים את הקובץ שלך כאן
├── src/
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
└── README.md
```

## 4. העתק את הקבצים
העתק את התוכן מכל קובץ לקובץ המתאים בפרויקט שלך.

## 5. הוסף את קובץ המילים
שים את `word.xlsx` בתיקיית `public/` (לא בתיקיית `src/`!)

## 6. בדוק מקומית
```bash
npm start
```

## 7. הגדר Git
```bash
git init
git add .
git commit -m "Initial commit"
```

## 8. צור repository ב-GitHub
1. לך ל-GitHub.com
2. צור repository חדש בשם `vocabulary-game`
3. אל תוסיף README, .gitignore או license (כבר יש לך)

## 9. חבר לגיט
```bash
git remote add origin https://github.com/YOUR_USERNAME/vocabulary-game.git
git branch -M main
git push -u origin main
```
**החלף `YOUR_USERNAME` בשם המשתמש שלך!**

## 10. עדכן את package.json
ב-`package.json`, החלף:
```json
"homepage": "https://YOUR_USERNAME.github.io/vocabulary-game"
```

## 11. פרוס ל-GitHub Pages
```bash
npm run deploy
```

## 12. בדוק את האתר
לאחר דקה או שתיים, האתר יהיה זמין ב:
`https://YOUR_USERNAME.github.io/vocabulary-game`

---

## פתרון בעיות נפוצות

**🔸 הקובץ לא נטען**: ודא ש-`word.xlsx` נמצא בתיקיית `public/`

**🔸 סגנון לא נטען**: הפעל `npm start` מחדש אחרי הוספת Tailwind

**🔸 שגיאה בפריסה**: ודא שהחלפת את שם המשתמש ב-`package.json`

**🔸 עברית לא מוצגת נכון**: הקובץ `index.html` מוגדר עם `dir="rtl"`