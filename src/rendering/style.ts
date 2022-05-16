export function injectStyle() {
  const style = document.createElement('style');
  style.innerText = `
  body,
      html {
        padding: 0;
        margin: 0;
      }

      body {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      canvas {
        width: 100%;
        height: 100%;
      }
      
      .no-aa {
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-crisp-edges;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
      }

      .aa {
        image-rendering: auto;
      }
  `;
  document.head.appendChild(style);
}
