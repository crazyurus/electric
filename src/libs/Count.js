export function Count() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://web.wutnews.net/Application/Electric/Assets/js/count.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}