function fetchCountry(country) {
  const URL = `https://restcountries.com/v3.1/name/${country}?fields=name,capital,population,flags,languages`;

  return fetch(URL).then(res => {
    if (!res.ok) {
      console.log(res.status);
      throw new Error('Oops, there is no country with that name');
    }
    return res.json();
  });
}

export { fetchCountry };
