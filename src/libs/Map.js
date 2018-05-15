export function Map(key) {
  return new Promise((resolve, reject) => {
    window.mapInit = resolve;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = "//map.qq.com/api/js?v=2.exp&callback=mapInit&key=" + key;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}