import { loadList } from '../main.js';

export function render(outsideData) {
  // console.log(data);
  const container = document.createElement('div');
  const goBack = document.createElement('a');
  const content = document.createElement('div');
  const mainTitle = document.createElement('h1');
  const description = document.createElement('p');
  const listsBlock = document.createElement('div');
  const dataProperties = outsideData.result.properties;

  container.classList.add('container-details');
  goBack.classList.add('back-btn');
  description.classList.add('descr');
  listsBlock.classList.add('lists');

  const additionalDataArr = ['planets', 'species', 'starships'];

  getAdditionallData(dataProperties, additionalDataArr).then(listsInfo => {
    mainTitle.textContent = `${dataProperties.title} (episode ${dataProperties.episode_id})`;
    description.textContent = dataProperties.opening_crawl;

    for (const key in listsInfo) {
      const listWrap = document.createElement('div');
      const title = document.createElement('h2');
      const listOfAdditionals = document.createElement('ul');

      listOfAdditionals.id = key;
      title.textContent = key.toUpperCase();

      for (const item of listsInfo[key]) {
        createListOfElements(item, listOfAdditionals);
      }

      listWrap.append(title, listOfAdditionals);
      listsBlock.append(listWrap);
    }
  })

  goBack.textContent = 'Back to episodes';
  goBack.addEventListener('click', (e) => {
    e.preventDefault();
    history.pushState(null, '', 'index.html');
    loadList();
  })

  content.append(mainTitle, description, listsBlock);
  container.append(goBack, content);

  document.body.style.backgroundImage = 'url("img/details.jpg")';

  return container;
}

function createListOfElements(item, list) {
  const li = document.createElement('li');
  li.textContent = item.result.properties.name;
  list.append(li);
}

async function getSingleData(url) {
  const res = await fetch(url);
  return await res.json();
}

async function getAdditionallData(pageData, dataNamesArr) {
  if (!dataNamesArr || !dataNamesArr.length || !pageData) throw Error('Function has no data');

  const dataObj = {};
  const namesArr = dataNamesArr.filter(dataName => pageData[dataName]);
  const urlArrs = namesArr.map(dataName => pageData[dataName]);

  const allData = await Promise.all(
    urlArrs.map((urlArr) => {
      return Promise.all(
        urlArr.map((url) => getSingleData(url))
      );
    })
  );

  namesArr.forEach((propName, i) => {
    dataObj[propName] = allData[i]
  });
  return dataObj;
}
