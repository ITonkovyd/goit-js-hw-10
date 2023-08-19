import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountry } from './fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener(
  'input',
  debounce(e => {
    const country = e.target.value.trim();

    if (country === '') {
      clear();
      return;
    }

    fetchCountry(country)
      .then(data => {
        if (data.length === 1) {
          console.log(data.length);
          createCountry(data.at(0));
        } else if (data.length <= 10) {
          console.log(data.length);
          createList(data);
        } else {
          Notify.warning(
            `Too many matches found (${data.length}). Please enter a more specific name.`
          );
        }
      })
      .catch(error => Notify.failure(`${error.message}`));
  }, DEBOUNCE_DELAY)
);

function createCountry({ capital, flags, languages, name, population }) {
  const markup = `
  <section>
  <div>
    <img src=${flags.png} alt=${flags.alt}>
    <h1>${name.official}</h1>
  </div>
  <p><b>Capital:</b> ${capital}</p>
  <p><b>Population:</b> ${population}</p>
  <p><b>Language${
    Object.values(languages).length > 1 ? 's' : ''
  }:</b> ${Object.values(languages).join(', ')}</p>
</section>
  `;
  countryList.innerHTML = '';
  countryInfo.innerHTML = markup;
}

function createList(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `
      <ul class="country-list">
        <li class="country-item">
          <img src=${flags.svg} width="100" alt=${flags.alt}>
          <p class="country-name">${name.official}</p>
        </li>
      </ul>
    `;
    })
    .join('');
  countryList.innerHTML = markup;
  countryInfo.innerHTML = '';
}

function clear() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}
