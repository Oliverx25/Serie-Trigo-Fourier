# Serie Trigonométrica de Fourier en Tiempo Continuo

Aplicación web interactiva que calcula y visualiza la **Serie Trigonométrica de Fourier** para señales periódicas en tiempo continuo: descompone una señal en sus armónicos (senos y cosenos) y muestra la aproximación junto con la señal original y los coeficientes calculados.

---

## Índice

- [Cómo funciona la Serie Trigonométrica de Fourier](#cómo-funciona-la-serie-trigonométrica-de-fourier)
- [Por qué N armónicos implican N picos y N valles por periodo](#por-qué-n-armónicos-implican-n-picos-y-n-valles-por-periodo)
  - [Discontinuidad y posición de los armónicos (onda cuadrada)](#discontinuidad-y-posición-de-los-armónicos-onda-cuadrada)
- [Características del proyecto](#características-del-proyecto)
- [Uso](#uso)
- [Implementación](#implementación)
- [Desarrollo y despliegue](#desarrollo-y-despliegue)
- [Tecnologías](#tecnologías)

---

## Cómo funciona la Serie Trigonométrica de Fourier

### Idea central

Cualquier señal **periódica** de periodo \(T\) puede expresarse como una suma infinita de senos y cosenos cuyas frecuencias son **múltiplos enteros** de la frecuencia fundamental \(\omega_0 = 2\pi/T\). Esa suma se llama **Serie Trigonométrica de Fourier**:

$$
f(t) = \frac{a_0}{2} + \sum_{n=1}^{\infty} \left[ a_n \cos\left(\frac{2\pi n}{T}t\right) + b_n \sin\left(\frac{2\pi n}{T}t\right) \right]
$$

- **\(a_0/2\)**: componente de continua (valor medio de la señal).
- **\(a_n\), \(b_n\)**: coeficientes del armónico \(n\). Cada par \((a_n, b_n)\) define la amplitud y fase de la componente a frecuencia \(n/T\) (es decir, \(n\) ciclos en un periodo \(T\)).

### Cálculo de los coeficientes

Los coeficientes se obtienen integrando la señal multiplicada por el seno o coseno correspondiente sobre **un periodo** (en este proyecto se usa el intervalo \([-T/2, T/2]\)):

$$
a_0 = \frac{2}{T} \int_{-T/2}^{T/2} f(t)\,dt
$$

$$
a_n = \frac{2}{T} \int_{-T/2}^{T/2} f(t)\,\cos\left(\frac{2\pi n}{T}t\right)dt
\qquad
b_n = \frac{2}{T} \int_{-T/2}^{T/2} f(t)\,\sin\left(\frac{2\pi n}{T}t\right)dt
$$

Estas fórmulas se deducen de la **ortogonalidad** de las funciones \(\cos(2\pi n t/T)\) y \(\sin(2\pi n t/T)\) en \([-T/2, T/2]\): al multiplicar \(f(t)\) por una de ellas e integrar, solo “sobrevive” la contribución de ese armónico.

### Aproximación con N términos

En la práctica se usa una **suma finita** (truncada) con \(N\) armónicos:

$$
f(t) \approx \frac{a_0}{2} + \sum_{n=1}^{N} \left[ a_n \cos\left(\frac{2\pi n}{T}t\right) + b_n \sin\left(\frac{2\pi n}{T}t\right) \right]
\]

Cuanto mayor sea \(N\), mejor se aproxima la forma de la señal (salvo el fenómeno de Gibbs cerca de discontinuidades). En esta aplicación, \(N\) es el **número de armónicos** que se elige en la interfaz (entre 1 y 50).

---

## Por qué N armónicos implican N picos y N valles por periodo

Es frecuente observar que, al elegir por ejemplo **5 armónicos**, en **un solo periodo** de la señal se ven **5 picos y 5 valles** en la aproximación de Fourier (es decir, 10 “semi-oscilaciones” en total). Esto no es un error del programa, sino una consecuencia directa de la definición de la serie.

### Relación entre armónico \(n\) y frecuencia

El armónico \(n\) tiene **frecuencia angular** \(\omega_n = 2\pi n / T\). Por tanto:

- **Frecuencia** (en ciclos por unidad de tiempo): \(f_n = n/T\).
- **Periodo** de ese armónico: \(T_n = T/n\).

Es decir: en un intervalo de tiempo de longitud \(T\) (un periodo de la señal), el armónico \(n\) completa **exactamente \(n\) ciclos**.

### Un ciclo = un pico + un valle

Cada término de la forma \(a_n \cos(\omega_n t) + b_n \sin(\omega_n t)\) es una **sinusoide** de frecuencia \(\omega_n\). En un ciclo completo, una sinusoide tiene:

- **Un máximo** (pico),
- **Un mínimo** (valle).

Por tanto, en un periodo \(T\) de la señal:

- El **armónico 1** hace 1 ciclo → contribuye con **1 pico y 1 valle**.
- El **armónico 2** hace 2 ciclos → **2 picos y 2 valles**.
- …
- El **armónico \(n\)** hace \(n\) ciclos → **\(n\) picos y \(n\) valles**.

### Conclusión para N armónicos

Si se usan **N armónicos** (\(n = 1, 2, \ldots, N\)), la suma incluye el armónico de **mayor frecuencia** con \(n = N\), que en un periodo \(T\) da **N ciclos**, es decir **N picos y N valles**. La forma total de la aproximación resulta de superponer todos los armónicos; en muchos casos (por ejemplo en la onda cuadrada) esa estructura de **N picos y N valles por periodo** se aprecia claramente en la gráfica.

**Resumen**:  
**“Número de armónicos = N”** implica que el armónico más alto oscila **N veces** en un periodo, por lo que es correcto ver **N picos y N valles** (en total, 2N extremos) en un solo periodo de la aproximación. No hay duplicación: son exactamente N armónicos generando esa cantidad de oscilaciones.

### Discontinuidad y posición de los armónicos (onda cuadrada)

En una **onda cuadrada** el punto donde la señal salta de \(-1\) a \(+1\) es una **discontinuidad**: la función no está definida en ese instante. Si ese salto coincide con \(t = 0\) en la serie, todos los términos en \(\sin(2\pi n t/T)\) se anulan ahí y la aproximación reparte los semiciclos de forma **simétrica** (p. ej. 5 y 5 a cada lado para 5 armónicos).  
Algunas convenciones sugieren desplazar la discontinuidad para que ningún armónico tenga un cruce por cero en el salto, lo que daría una distribución **asimétrica** de semiciclos (p. ej. 6 en un lado y 4 en el otro). Ese desplazamiento implica cambiar el **duty cycle** de la señal: dejaría de ser 50 %–50 % y pasaría a ser una **onda rectangular** (p. ej. 40 %–60 %). En este proyecto se mantiene la **onda cuadrada estándar** (50 %–50 %, discontinuidad en \(t = 0\) dentro de cada periodo), de modo que la señal sigue siendo cuadrada y la aproximación muestra N semiciclos a cada lado del salto para N armónicos.

---

## Características del proyecto

- **Cálculo de coeficientes** \(a_0\), \(a_n\) y \(b_n\) por integración numérica (regla de Simpson 1/3) en \([-T/2, T/2]\).
- **Gráfica interactiva**: comparación entre la señal original y la aproximación de Fourier (hasta N armónicos).
- **Señales predefinidas**: onda cuadrada, diente de sierra, triangular, sinusoidal, pulso rectangular.
- **Expresión personalizada**: introduce \(f(t)\) con la variable `t` (sintaxis [mathjs](https://mathjs.org/)); el periodo de análisis para “custom” es el ancho del rango mostrado.
- **Armónicos ajustables**: número de términos \(N\) entre 1 y 50.
- **Tabla de coeficientes**: se muestran \(a_0\) y los pares \((a_n, b_n)\) para cada \(n\) usado.

---

## Uso

1. Elige una **señal** en el desplegable (predefinida o “Expresión personalizada”).
2. Si usas expresión personalizada, escribe \(f(t)\) en el campo de texto (ej: `sin(2*pi*t)`, `cos(t)`, `t^2`). La variable debe ser `t`.
3. Ajusta el **número de armónicos** (1–50). Verás cómo la aproximación gana detalle y, en un periodo, aparecen N picos y N valles cuando el armónico máximo domina.
4. La **gráfica** muestra en verde la señal original y en rosa la aproximación de Fourier. La **tabla** lista los coeficientes calculados.

Para señales predefinidas el periodo es \(T = 1\); el rango mostrado es \(t \in [-1.5, 1.5]\) (1,5 periodos a cada lado). Para expresión personalizada, el periodo de integración y visualización es el ancho de ese rango.

---

## Implementación

- **Integración**: regla de Simpson con 1000 subintervalos por defecto en `simpsonIntegral` (`src/lib/fourier.ts`).
- **Coeficientes**: `computeA0`, `computeAn`, `computeBn` implementan las integrales anteriores; `computeFourierCoefficients` calcula \(n = 1 \ldots N\).
- **Evaluación**: `evaluateFourierSeries` evalúa la suma truncada con \(\omega_n = 2\pi n/T\) en cada punto \(t\).
- **Señales**: definidas en `src/lib/signals.ts` (periodo normalizado); expresiones custom en `src/lib/customExpression.ts` vía mathjs.
- **Visualización**: `FourierChart` (Recharts) para la gráfica; `CoefficientsTable` para la tabla de coeficientes.

---

## Desarrollo y despliegue

```bash
npm install
npm run dev
```

Build para producción:

```bash
npm run build
```

**Despliegue (Vercel)**  
Conecta el repositorio en [Vercel](https://vercel.com) o usa el CLI:

```bash
npm i -g vercel
vercel
```

Vercel detecta el proyecto Vite y lo despliega sin configuración adicional.

---

## Tecnologías

- **Vite** + **React** + **TypeScript**
- **Recharts** (gráficas)
- **Tailwind CSS** (estilos)
- **mathjs** (expresiones matemáticas para señales personalizadas)
