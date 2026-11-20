# Una carta ♡

Página romántica: un sobre cerrado que se abre, una frase que se escribe sola, la firma de Paty y, al final, el cielo real con las constelaciones de la fecha que ella escriba.

## Estructura

```
carta-paty/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── config.js       ← textos, firma, lugar y hora (edita aquí)
│   ├── stars-data.js   ← estrellas y líneas de constelaciones
│   ├── sky.js          ← cálculo astronómico y dibujo del cielo
│   ├── music.js        ← música (mp3 o melodía generada)
│   └── main.js         ← flujo: sobre → carta → fecha → cielo
└── assets/
    └── music/
        └── cancion.mp3 ← tu canción (opcional)
```

## Subirlo a GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `carta`), público.
2. Sube todo el contenido de esta carpeta (que `index.html` quede en la raíz del repo).
3. En el repo: **Settings → Pages → Build and deployment**, en *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guarda.
4. En uno o dos minutos el link queda en `https://TU-USUARIO.github.io/carta/`.

Con Git desde la terminal:

```bash
cd carta-paty
git init
git add .
git commit -m "Carta"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/carta.git
git push -u origin main
```

## Música desde YouTube

En `js/config.js` pega el link del video en `youtube`:

```js
youtube: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
youtubeInicio: 0,     // segundo donde empieza (para saltar intros)
youtubeVolumen: 70,
```

El video se reproduce oculto y en bucle desde que se abre el sobre; el botón de arriba a la derecha lo pausa. Si el video no permite incrustarse o no carga, la página usa `assets/music/cancion.mp3` y, si tampoco existe, una melodía generada por el navegador.

Ojo: la música de YouTube solo funciona con la página publicada (GitHub Pages). Abriendo el `index.html` directo desde tu computadora, YouTube no la deja sonar y escucharás el respaldo.

## Personalizar

Todo lo editable está en `js/config.js`: la frase, la firma, el texto con el que se pide la fecha, el mensaje del cielo, la ciudad (latitud/longitud) y la hora de la noche que se dibuja.

## Cómo se calcula el cielo

Con la fecha elegida, a la hora configurada y desde el lugar configurado, se calcula la posición real (altura y acimut) de unas 110 estrellas brillantes y se dibujan las líneas de 20 constelaciones. El cielo sigue girando despacio, como lo haría esa noche. Las estrellas tenues del fondo son decorativas.
