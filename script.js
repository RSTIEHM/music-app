window.addEventListener('DOMContentLoaded', () => {
  async function getData() {
    let response = await fetch('./musicprod.json');
    let data = await response.json();
    appState = data;
    initloadPage(appState);
  }
  getData();
});
