const fetchApi = (url, method = 'GET', body = null, token = '') => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Authorization: token ? token : '',
  };

  const options = body
    ? { method, headers: defaultHeaders, body: JSON.stringify(body) }
    : { method, headers: defaultHeaders };

  return fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          return Promise.reject(`${error || 'Something went wrong'}`);
        });
      }
      return response.json();
    })
    .catch((error) => {
      return Promise.reject(`Fetch error: ${error}`);
    });
};

export default fetchApi;
