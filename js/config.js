/* =========================================================
   CONFIGURACIÓN — cambia aquí los textos sin tocar lo demás
   ========================================================= */
const CONFIG = {
  // La frase que se escribe sola dentro de la carta
  frase:
    "De todas las casualidades que el universo pudo inventar, tú eres mi favorita. " +
    "Si me dieran a elegir otra vez, volvería a encontrarte en el mismo lugar, " +
    "a la misma hora, sin cambiar absolutamente nada.",

  // Firma al final de la carta
  firma: "-Paty",

  // Petición "disimulada" de la fecha
  pregunta:
    "Antes de cerrar esta carta te pido algo pequeño: escríbeme una fecha. " +
    "No cualquiera, la que sientas más tuya, esa que nadie más tiene igual que tú.",

  // Mensaje que aparece sobre el cielo
  mensajeCielo:
    "Así estaba el cielo esa noche. Las estrellas ya sabían que algo bonito estaba por empezar.",

  // Desde dónde se calcula el cielo (por defecto Guaranda, Ecuador)
  lugar: {
    nombre: "Guaranda, Ecuador",
    lat: -1.5925,
    lon: -79.0011,
    utcOffset: -5 // hora de Ecuador
  },

  // Hora local de esa fecha que se muestra (21 = 9 de la noche)
  hora: 21,

  // Cuántos segundos de cielo avanzan por cada segundo real (0 = quieto)
  velocidadCielo: 40,

  // Canción desde YouTube: pega aquí el link del video (o déjalo vacío "")
  // Ejemplo: "https://www.youtube.com/watch?v=XXXXXXXXXXX"
  youtube: "https://youtu.be/OASOA4DludE?si=nwV-WmPIDkFMrDGF",

  // Segundo en el que empieza la canción (útil para saltar intros)
  youtubeInicio: 0,

  // Volumen de YouTube, de 0 a 100
  youtubeVolumen: 70,

  // Si no hay YouTube, se intenta este mp3. Si tampoco existe,
  // suena una melodía tipo cajita musical generada por el navegador
  musica: "assets/music/cancion.mp3"
};
