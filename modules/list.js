import { loadDetails } from '../main.js';

const numberMap = {
  '1': 'IV',
  '2': 'V',
  '3': 'VI',
  '4': 'I',
  '5': 'II',
  '6': 'III',
}

export function render(data) {
  // console.log(data);
  const container = document.createElement('div');
  const content = document.createElement('div');
  const quote = document.createElement('p');
  content.classList.add('container-list');
  quote.classList.add('quote');
  quote.textContent = 'Fear is the path to the dark side. Fear leads to anger. Anger leads to hate. Hate leads to suffering.';

  for (const item of data.result) {
    const filmLink = document.createElement('a');
    const filmNumber = document.createElement('p');
    const filmTitle = document.createElement('h5');

    filmLink.classList.add('film-link');
    filmNumber.classList.add('number');
    filmTitle.classList.add('film-title');

    filmLink.append(filmTitle, filmNumber);

    filmTitle.textContent = `${item.uid}. ${item.properties.title}`;
    filmNumber.textContent = `Episode ${numberMap[item.uid]} (${item.properties.release_date.substring(0, 4)})`;

    filmLink.addEventListener('click', (e) => {
      e.preventDefault();
      history.pushState(null, '', `details.html?filmNumber=${item.uid}`);
      loadDetails();
    })

    content.append(filmLink);
  }

  container.append(content, quote);
  document.body.style.backgroundImage = 'url("img/list.jpg")';

  return container;
}
