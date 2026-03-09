# Serie trigonométrica de Fourier

Aplicación web interactiva para calcular y visualizar la **serie trigonométrica de Fourier** de señales periódicas en tiempo continuo: descompone una señal en sus armónicos (senos y cosenos) y muestra la aproximación junto con la señal original y los coeficientes. Pensada como apoyo en la asignatura de **Procesamiento Digital de Señales (PDS)**.

---

## Definición matemática

Cualquier señal **periódica** de periodo \(T\) puede expresarse como una suma infinita de senos y cosenos cuyas frecuencias son **múltiplos enteros** de la frecuencia fundamental \(\omega_0 = 2\pi/T\). Esa suma se llama **serie trigonométrica de Fourier**:

$$f(t) = \frac{a_0}{2} + \sum_{n=1}^{\infty} \left[ a_n \cos\left(\frac{2\pi n}{T}t\right) + b_n \sin\left(\frac{2\pi n}{T}t\right) \right]$$

- **\(a_0/2\)**: componente de continua (valor medio de la señal).
- **\(a_n\), \(b_n\)**: coeficientes del armónico \(n\). Cada par \((a_n, b_n)\) define la amplitud y fase de la componente a frecuencia \(n/T\) (es decir, \(n\) ciclos en un periodo \(T\)).

### Cálculo de los coeficientes

Los coeficientes se obtienen integrando la señal multiplicada por el seno o coseno correspondiente sobre **un periodo**. En este proyecto se usa el intervalo \([-T/2, T/2]\):

$$a_0 = \frac{2}{T} \int_{-T/2}^{T/2} f(t)\,dt$$

$$a_n = \frac{2}{T} \int_{-T/2}^{T/2} f(t)\,\cos\left(\frac{2\pi n}{T}t\right)dt
\qquad
b_n = \frac{2}{T} \int_{-T/2}^{T/2} f(t)\,\sin\left(\frac{2\pi n}{T}t\right)dt$$

Estas fórmulas se deducen de la **ortogonalidad** de las funciones \(\cos(2\pi n t/T)\) y \(\sin(2\pi n t/T)\) en \([-T/2, T/2]\): al multiplicar \(f(t)\) por una de ellas e integrar, solo “sobrevive” la contribución de ese armónico.

### Aproximación con N términos

En la práctica se usa una **suma finita** (truncada) con \(N\) armónicos:

$$f(t) \approx \frac{a_0}{2} + \sum_{n=1}^{N} \left[ a_n \cos\left(\frac{2\pi n}{T}t\right) + b_n \sin\left(\frac{2\pi n}{T}t\right) \right]$$

Cuanto mayor sea \(N\), mejor se aproxima la forma de la señal (salvo el fenómeno de Gibbs cerca de discontinuidades). En esta aplicación, \(N\) es el **número de armónicos** elegido en la interfaz (entre 1 y 50).

### Relación armónico n y forma de la aproximación

El armónico \(n\) tiene frecuencia \(f_n = n/T\) y en un periodo \(T\) completa **exactamente \(n\) ciclos**. Cada sinusoide tiene un pico y un valle por ciclo; por tanto, con \(N\) armónicos el término de mayor frecuencia (\(n=N\)) aporta **N picos y N valles** en un periodo. Es correcto observar esa estructura en la gráfica (p. ej. 5 armónicos → 5 picos y 5 valles por periodo).

---

## Implementación

### Integración numérica

Las integrales que definen \(a_0\), \(a_n\) y \(b_n\) se aproximan con la **regla de Simpson 1/3** sobre una malla equiespaciada en \([-T/2, T/2]\) (por defecto 1000 subintervalos en `simpsonIntegral`, en `src/lib/fourier.ts`). Para cada coeficiente se construye el integrando correspondiente (\(f(t)\), \(f(t)\cos(2\pi n t/T)\) o \(f(t)\sin(2\pi n t/T)\)) y se evalúa la suma de Simpson.

### Señales

Cada señal se representa como una función \(t \mapsto \text{valor}\) (tipo `SignalFunction`):

- **Predefinidas** (`src/lib/signals.ts`): onda cuadrada, diente de sierra, triangular, sinusoidal, pulso rectangular (periodo \(T=1\), extensión periódica mediante fase normalizada).
- **Expresión personalizada** (`src/lib/customExpression.ts`): cadena evaluada con [mathjs](https://mathjs.org/) usando la variable `t` (ej: `sin(2*pi*t)`, `cos(t)`, `t^2`). Para señales custom, el periodo de análisis es el ancho del rango mostrado (\(T = T_{\max} - T_{\min}}\), p. ej. 3) de modo que la serie aproxime la curva visible en ese intervalo.

### Evaluación de la serie

La función `evaluateFourierSeries` recibe los coeficientes \((a_0, a_n, b_n)\), el instante \(t\) y el periodo \(T\), y devuelve el valor de la suma truncada con \(\omega_n = 2\pi n/T\). Los puntos de la gráfica se generan muestreando la señal original y la aproximación en una malla de 500 puntos sobre el rango mostrado.

---

## Interfaz y uso

### Sección "Parámetros"

- **Señal**: selector entre presets (onda cuadrada, diente de sierra, triangular, sinusoidal, pulso rectangular) o "Expresión personalizada". Si es personalizada, se muestra un campo de texto para \(f(t)\) (variable `t`).
- **Número de armónicos**: entero entre 1 y 50. Controla cuántos términos \(n=1,\ldots,N\) se incluyen en la suma de Fourier.

### Sección "Gráfica"

- **Señal original**: curva en verde (continua).
- **Aproximación de Fourier**: curva en rosa (discontinua). Se observa cómo al aumentar \(N\) la aproximación se acerca a la señal (y en un periodo aparecen N picos y N valles cuando domina el armónico máximo).
- Para señales predefinidas el rango mostrado es \(t \in [-1.5, 1.5]\) (1,5 periodos a cada lado) con \(T=1\). Para expresión personalizada el dominio y el periodo de integración dependen del ancho del rango.

### Sección "Coeficientes de Fourier"

- Valor de **\(a_0\)** (componente DC).
- Tabla con **\(a_n\)** y **\(b_n\)** para cada \(n=1,\ldots,N\).
- Recordatorio de la fórmula de la serie.

---

## Relación con Procesamiento Digital de Señales

- **Análisis de Fourier en tiempo continuo**: representación de señales periódicas como superposición de sinusoides; concepto de espectro (amplitud y fase por armónico); frecuencia fundamental y armónicos.
- **Ortogonalidad**: base de funciones \(\{\cos(2\pi n t/T), \sin(2\pi n t/T)\}\) en un periodo; extracción de coeficientes por proyección (integral del producto).
- **Aproximación truncada y fenómeno de Gibbs**: uso de un número finito de armónicos; oscilaciones y overshoot cerca de discontinuidades cuando \(N \to \infty\).
- **Señales típicas**: ondas cuadrada, triangular, diente de sierra, pulsos; relación entre simetrías de la señal y coeficientes nulos (p. ej. \(a_n=0\) para señales impares).
- **Transición a tiempo discreto**: la serie de Fourier en tiempo continuo es la base para la DFT/FFT y el análisis espectral discreto en PDS.

---

## Estructura del proyecto

```
src/
├── App.tsx                 # Estado, parámetros, cálculo de coeficientes y datos para la gráfica
├── lib/
│   ├── fourier.ts          # simpsonIntegral, computeA0, computeAn, computeBn,
│   │                        # computeFourierCoefficients, evaluateFourierSeries
│   ├── signals.ts          # Señales predefinidas (cuadrada, sierra, triangular, etc.)
│   ├── customExpression.ts # createCustomSignal, validateExpression (mathjs)
│   └── formatAxisTick.ts   # Formato de etiquetas numéricas en ejes
└── components/
    ├── FourierChart.tsx    # Gráfica señal original vs aproximación Fourier (Recharts)
    └── CoefficientsTable.tsx # Tabla a₀, aₙ, bₙ
```

---

## Desarrollo

```bash
npm install
npm run dev
```

Build para producción: `npm run build`. Se puede desplegar en [Vercel](https://vercel.com) u otro host estático.

---

## Tecnologías

- **Vite** + **React** + **TypeScript**
- **Recharts**: gráficas (LineChart, ejes, leyenda, tooltip)
- **Tailwind CSS**: estilos
- **mathjs**: evaluación de expresiones matemáticas para señales personalizadas
