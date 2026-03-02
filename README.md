# Serie Trigonométrica de Fourier en Tiempo Continuo

Programa web que calcula y visualiza la Serie Trigonométrica de Fourier para señales periódicas en tiempo continuo.

## Características

- **Cálculo de coeficientes**: a₀, aₙ y bₙ mediante integración numérica (regla de Simpson)
- **Gráfica interactiva**: Comparación entre la señal original y la aproximación de Fourier
- **Señales predefinidas**: Onda cuadrada, diente de sierra, triangular, sinusoidal, pulso rectangular
- **Armónicos ajustables**: Control del número de términos (1–50) de la serie

## Fórmulas

$$f(t) = \frac{a_0}{2} + \sum_{n=1}^{\infty} \left[a_n \cos\left(\frac{2n\pi}{T}t\right) + b_n \sin\left(\frac{2n\pi}{T}t\right)\right]$$

- $a_0 = \frac{2}{T}\int_{-T/2}^{T/2} f(t)\,dt$
- $a_n = \frac{2}{T}\int_{-T/2}^{T/2} f(t)\cos\left(\frac{2n\pi}{T}t\right)dt$
- $b_n = \frac{2}{T}\int_{-T/2}^{T/2} f(t)\sin\left(\frac{2n\pi}{T}t\right)dt$

## Desarrollo

```bash
npm install
npm run dev
```

## Despliegue en Vercel

1. Sube el proyecto a un repositorio en GitHub
2. Conecta el repositorio en [Vercel](https://vercel.com)
3. Vercel detectará automáticamente el proyecto Vite
4. Despliega sin configuración adicional

O con el CLI:

```bash
npm i -g vercel
vercel
```

## Tecnologías

- Vite + React + TypeScript
- Recharts (gráficas)
- Tailwind CSS
