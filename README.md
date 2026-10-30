# Vacas y Toros

Juego de adivinanza numérica para el navegador. Hay que descubrir un número
secreto de **4 dígitos distintos** (puede empezar con 0) en **10 intentos**.

Cada intento devuelve dos pistas:

- **Toros**: dígitos correctos que además están en la posición correcta.
- **Vacas**: dígitos correctos que están en otra posición.

## Cómo se juega

El intento se escribe en la **misma fila de la tabla** donde después se marcan
los colores:

1. Se toca la celda donde va el dígito.
2. Se elige el dígito en el selector de abajo.
3. La selección corre sola a la derecha, sin borrar lo que ya hubiera.
4. Para corregir, se toca la celda y se elige otro dígito.

El botón **Probar** se activa cuando las cuatro celdas están llenas. En el
selector se apagan los dígitos que ya están en otra celda de la fila, porque el
número secreto nunca repite dígitos.

En el computador también sirve el teclado: números para escribir, flechas para
moverse entre celdas, Enter para probar y Retroceso para borrar.

### Marcado a mano

Tocar un dígito ya jugado le da vuelta el color, como anotar en papel:
**verde** (va ahí), **amarillo** (está pero corrido), **rojo** (no va) y de
vuelta a sin marcar. Son anotaciones del jugador: el juego no las corrige ni
las usa para nada.

Arriba hay una **tira del 0 al 9** con las mismas marcas, para llevar el
control de qué dígitos ya se descartaron.

### Alerta y reloj

Desde el octavo intento la pantalla se empieza a teñir de rojo y avisa cuántos
intentos quedan. El cronómetro corre desde que parte la partida.

### Ranking

Cada partida ganada se guarda con nombre, intentos y tiempo. Ordena por menos
intentos y, a igual cantidad, por menos tiempo. Las partidas perdidas o
rendidas no entran.

El ranking es **local**: vive en el navegador de cada persona y no se comparte
entre dispositivos.

## Cómo correrlo

Es un solo archivo sin dependencias ni compilación. Basta con abrir
`index.html` en el navegador.

Para probarlo como lo verá el visitante, con un servidor local:

```bash
npx serve .
```

## De dónde viene

Es la versión web de una app Android escrita en Kotlin + Jetpack Compose. La
lógica se portó entera a JavaScript y se verificó contra los mismos casos de
prueba del proyecto original: toros y vacas, orden de validación, tramos de la
alerta, formato del tiempo, escritura en la fila y desempate del ranking.
