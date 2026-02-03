if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('SW active'))
      .catch(err => console.debug('SW registration skipped:', err.message));
  });
}