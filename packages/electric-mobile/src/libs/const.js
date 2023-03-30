export const IS_X5_WEBVIEW = navigator.userAgent.includes('TBS/') || window.getX5WebViewExtension;
export const SUPPORT_CSS_HOUDINI = !IS_X5_WEBVIEW && CSS.paintWorklet;