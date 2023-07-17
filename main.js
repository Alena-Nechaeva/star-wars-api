const MAIN_URL = `https://www.swapi.tech/api/films/`;
const appContainer = document.getElementById('app');

let cssPromise = {};

function loadSrc(src) {
  if (src.endsWith('.js')) {
    return import(src);
  }

  if (src.endsWith('.css')) {
    if (!cssPromise[src]) {
      let link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = src;
      cssPromise[src] = new Promise(resolve => {
        link.addEventListener('load', () => resolve())
      });
      document.head.append(link);
    }
    return cssPromise[src];
  }

  return fetch(src).then(res => res.json());
}


function renderPage(moduleName, apiUrl, css) {
  Promise.all([moduleName, apiUrl, css].map(src => loadSrc(src)))
    .then(([pageModule, data]) => {
      appContainer.innerHTML = '';
      appContainer.append(pageModule.render(data));
    })
}

export function loadList() {
  renderPage(
    `./modules/list.js`,
    `${MAIN_URL}`,
    `./css/style.css`,
  )
}

export function loadDetails() {
  const searchParams = new URLSearchParams(location.search);
  const filmNumber = searchParams.get('filmNumber');
  renderPage(
    `./modules/details.js`,
    `${MAIN_URL}${filmNumber}`,
    `./css/style.css`
  )
}

if (location.search !== '') loadDetails();
else loadList();

window.addEventListener('popstate', (e) => {
  // console.log(e)
  if (location.search !== '') loadDetails();
  else loadList();
});
