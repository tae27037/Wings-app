# Maison Wigs — сайт, приложение для телефона и exe

Один и тот же код (React + Vite) работает везде, поэтому стиль везде **одинаковый**.

| Что | Для чего | Как получить |
|---|---|---|
| **PWA** | iPhone и Android прямо из браузера | выложить `dist/` на https-хостинг |
| **APK** | установка на Android | облачная сборка (ниже) или Android Studio |
| **EXE** | Windows (установщик + portable) | облачная сборка (ниже) или `npm run exe` |

> `.exe` — это формат Windows, на телефоне он не запустится. Для телефона — APK (Android) или PWA (iPhone и Android).

## Самый простой путь: собрать в облаке (ничего не ставить)

1. Положите проект в репозиторий GitHub (`git push`).
2. GitHub → вкладка **Actions** → **Build apps (APK + EXE)** → **Run workflow**.
3. Через ~10 минут внизу страницы запуска появятся файлы:
   - `Maison-Wigs-android-apk` → `app-debug.apk` (отправьте на телефон и установите, разрешив «установку из неизвестных источников»);
   - `Maison-Wigs-windows-exe` → установщик `.exe` и portable `.exe`.

## Локально

Нужен Node.js 20+. Один раз: `npm install`.

**Windows exe**
```
npm run exe:dev     # посмотреть приложение в окне
npm run exe         # собрать установщик -> папка release/
```

**Android APK** (нужны Android Studio и JDK 17)
```
npm run android:add     # один раз: создаёт папку android/ и иконки
npm run android:sync    # после каждого изменения сайта
npm run android:open    # откроется Android Studio -> Build -> Build APK(s)
```

**PWA (iPhone / Android без магазина)**
`npm run build`, выложите папку `dist/` на любой https-хостинг (Netlify, Vercel, GitHub Pages в корне домена).
Откройте сайт на телефоне → «Добавить на главный экран» (iPhone: Safari → Поделиться; Android: Chrome → меню).

## Важно знать

- **Чат с ИИ (Wiggy).** `VITE_CHAT_API_URL=http://localhost:8787` в приложении не работает. Если нужен настоящий ИИ, разверните `server/proxy.mjs` на сервере с https и укажите его адрес при сборке. Без этого работает встроенный бот, как сейчас.
- **Шрифты.** Подгружаются с Google Fonts, поэтому при первом запуске нужен интернет. Без сети будут запасные шрифты.
- **APK из облака — отладочный** (debug), для установки на свои устройства подходит. Для Google Play нужна подпись release-ключом.
- **iPhone-приложение (IPA)** собирается только на Mac с аккаунтом Apple Developer. Для iPhone используйте PWA.
- `package-lock.json` после добавления пакетов нужно обновить командой `npm install`.
