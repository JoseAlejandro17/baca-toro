# Juegos numéricos

Dos juegos de lápiz y papel para el navegador. Al entrar se elige cuál jugar.

No hay compilación ni dependencias: son tres páginas HTML, una hoja de estilos
y dos imágenes.

| Archivo | Qué es |
| --- | --- |
| `index.html` | La portada, donde se elige el juego. |
| `baca-toro.html` | Baca Toro. |
| `sudoku.html` | Sudoku. |
| `comun.css` | Paleta, marco, barra, botones, diálogos y ranking, compartidos. |
| `fondo.jpg` | La lámina de la vaca y el toro, de telón de fondo. |
| `icono-192.png` | Ícono de la portada, favicon y pantalla de inicio. |

---

## Baca Toro

Hay que descubrir un número secreto de **4 dígitos distintos** (puede empezar
con 0) en **10 intentos**. Cada intento devuelve dos pistas:

- **Toros** (verde ✓): dígitos correctos que además están en la posición correcta.
- **Vacas** (ámbar ?): dígitos correctos que están en otra posición.

El intento se escribe en la **misma fila de la tabla** donde después se marcan
los colores: se toca la celda, se elige el dígito en el selector de abajo y la
selección corre sola a la derecha. En el selector se apagan los dígitos que ya
están en otra celda, porque el número secreto nunca repite.

Tocar un dígito ya jugado le da vuelta el color, como anotar en papel: verde,
amarillo, rojo y de vuelta a sin marcar. Son anotaciones del jugador; el juego
no las corrige ni las usa. Arriba hay una tira del 0 al 9 con las mismas marcas.

Desde el octavo intento la pantalla se tiñe de rojo y avisa cuántos quedan.

**Ranking:** menos intentos primero y, a igual cantidad, menos tiempo.

---

## Sudoku

Completar la cuadrícula sin repetir números en ninguna fila, columna ni caja.

- **Tres tamaños:** 4×4 (cajas de 2×2), 6×6 (cajas de 2 de alto por 3 de ancho)
  y 9×9 (cajas de 3×3).
- **Cuatro niveles:** fácil, medio, difícil y experto, que cambian cuántas
  casillas vienen vacías.
- **Tres pistas por partida.** Cada una rellena una casilla y queda registrada.
- **Notas:** con el modo encendido los números quedan chiquititos en la casilla,
  para anotar candidatos. Al fijar un número, deja de ser candidato en todo lo
  que esa casilla ve.
- Los números repetidos se marcan en rojo apenas aparecen, y el contador de
  cada tecla muestra cuántos faltan por colocar.

**Ranking:** una tabla por cada combinación de tamaño y nivel. Va primero quien
usó menos pistas y, a igual cantidad, quien demoró menos.

### Cómo se arma el tablero

Primero se rellena una cuadrícula entera válida al azar. Después se van sacando
casillas de a una, y cada vez se comprueba que el tablero **siga teniendo una
sola solución**; la casilla que abriría una segunda respuesta se devuelve a su
lugar. Por eso un tablero de experto puede quedar con una o dos casillas menos
de las que pide el nivel: ahí ya no se puede sacar más sin que deje de ser un
sudoku.

El contador de soluciones se detiene apenas encuentra la segunda, y ataca
siempre la casilla con menos candidatos. Con eso el 9×9 de experto se arma en
unos 30 ms.

---

## Teclado

Las dos páginas se juegan con el dedo o con el teclado.

| Tecla | Baca Toro | Sudoku |
| --- | --- | --- |
| `0`–`9` | escribe el dígito | escribe el número |
| `←` `→` | cambia de celda | mueve por la fila |
| `↑` `↓` | — | mueve por la columna |
| `Enter` | prueba el intento | — |
| `⌫` | borra la celda | borra la casilla |
| `N` | — | enciende y apaga las notas |
| `H` | — | usa una pista |

## Dónde se guardan los récords

En el navegador de cada persona (`localStorage`), así que no se comparten entre
aparatos ni entre personas. El nombre del jugador se recuerda entre los dos
juegos.

## Cómo correrlo

Conviene levantar un servidor: abriendo el archivo con doble clic, el navegador
no carga la hoja de estilos ni las imágenes.

```bash
npx serve .
```

## De dónde viene

Baca Toro es la versión web de una app Android escrita en Kotlin + Jetpack
Compose. La lógica se portó entera a JavaScript y se verificó contra los mismos
casos de prueba del proyecto original.
