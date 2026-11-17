"use strict";

/**
 * Duelos a distancia, sin servidor.
 *
 * Los dos jugadores no están conectados: lo que viaja entre ellos son enlaces
 * y códigos que llevan la partida adentro, y que se mandan por WhatsApp o por
 * donde sea. Cada uno juega cuando quiere, en paralelo, sin esperar al otro.
 *
 * Como todo viaja en el enlace, alguien que sepa leerlo puede ver lo que trae.
 * Es un juego entre amigos y no hay nada que proteger, pero conviene saberlo:
 * esto no aguanta a un tramposo decidido.
 */

// --- Empaquetado -----------------------------------------------------------

/** Texto a base64 que se pueda meter en una URL sin que se rompa. */
function aCodigo(obj) {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  let binario = "";
  for (const b of bytes) binario += String.fromCharCode(b);
  return btoa(binario).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Saca el código de un texto que puede venir con cualquier cosa alrededor.
 *
 * Al copiar un mensaje de WhatsApp se arrastra lo que venga antes y después
 * —el saludo, la hora, el nombre de quien lo mandó—, así que en vez de exigir
 * que peguen el código pelado se busca dentro: se prueban los trozos que
 * tienen pinta de código, del más largo al más corto, y vale el primero que
 * se deje leer.
 *
 * @return el objeto leído, o null si ahí no hay ningún código.
 */
function extraerCodigo(texto, tipoEsperado) {
  const trozos = String(texto).match(/[A-Za-z0-9_-]{12,}/g) || [];
  for (const trozo of trozos.sort((a, b) => b.length - a.length)) {
    const datos = deCodigo(trozo);
    if (datos && (!tipoEsperado || datos.t === tipoEsperado)) return datos;
  }
  return null;
}

/** Lo contrario de aCodigo. Devuelve null si viene cortado o cambiado. */
function deCodigo(texto) {
  try {
    const limpio = String(texto).trim().replace(/-/g, "+").replace(/_/g, "/");
    const binario = atob(limpio + "=".repeat((4 - (limpio.length % 4)) % 4));
    const bytes = Uint8Array.from(binario, (c) => c.charCodeAt(0));
    const obj = JSON.parse(new TextDecoder().decode(bytes));
    return obj && typeof obj === "object" ? obj : null;
  } catch (e) {
    // Un código pegado a medias o de otra versión: se avisa, no se revienta.
    return null;
  }
}

/** El enlace que se le manda al rival, con la partida colgando del #. */
function enlaceCon(pagina, datos) {
  const base = location.href.split("#")[0].replace(/[^/]*$/, "") + pagina;
  return `${base}#d=${aCodigo(datos)}`;
}

/** Lo que venga en el # de la dirección, si es que viene algo. */
function datosDelEnlace() {
  const hash = location.hash || "";
  if (!hash.startsWith("#d=")) return null;
  return deCodigo(hash.slice(3));
}

/** Saca el # de la barra de direcciones sin recargar ni dejar rastro atrás. */
function limpiarEnlace() {
  history.replaceState(null, "", location.pathname + location.search);
}

// --- Compartir -------------------------------------------------------------

/**
 * Ofrece el texto por donde el aparato permita: el menú de compartir del
 * teléfono si lo hay, el portapapeles si no.
 *
 * @return "compartido", "copiado" o "falló", para avisarle al jugador.
 */
async function compartir(texto, titulo) {
  if (navigator.share) {
    try {
      await navigator.share({ title: titulo, text: texto });
      return "compartido";
    } catch (e) {
      // El jugador cerró el menú de compartir: no es un error que valga avisar.
      if (e && e.name === "AbortError") return "cancelado";
    }
  }
  try {
    await navigator.clipboard.writeText(texto);
    return "copiado";
  } catch (e) {
    return "falló";
  }
}

/** Enlace a WhatsApp con el mensaje ya escrito. */
const enlaceWhatsapp = (texto) => `https://wa.me/?text=${encodeURIComponent(texto)}`;

// --- Resultados ------------------------------------------------------------

const promedio = (lista) => (lista.length ? lista.reduce((a, b) => a + b, 0) / lista.length : 0);

/**
 * Quién ganó el duelo.
 *
 * Primero el promedio de intentos y, a igual cantidad, el de tiempo: el mismo
 * criterio con que se ordena el ranking de un jugador solo. En el sudoku no
 * hay intentos, así que [intentos] viene en cero para los dos y decide el
 * tiempo.
 *
 * @return "yo", "rival" o "empate", más los promedios de cada uno.
 */
function compararDuelo(mios, suyos) {
  const resumen = (rondas) => ({
    intentos: promedio(rondas.map((r) => r.intentos)),
    tiempoMs: promedio(rondas.map((r) => r.tiempoMs)),
    rondas: rondas.length,
  });

  const yo = resumen(mios);
  const rival = resumen(suyos);

  let ganador = "empate";
  if (yo.intentos !== rival.intentos) ganador = yo.intentos < rival.intentos ? "yo" : "rival";
  else if (yo.tiempoMs !== rival.tiempoMs) ganador = yo.tiempoMs < rival.tiempoMs ? "yo" : "rival";

  return { ganador, yo, rival };
}

/** Un promedio de intentos con un decimal, o el número pelado si es redondo. */
const formatearPromedio = (n) =>
  Number.isInteger(n) ? String(n) : n.toFixed(1).replace(".", ",");
