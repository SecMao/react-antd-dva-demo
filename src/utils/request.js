import fetch from 'dva/fetch';
import queryStr from "querystring";

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

export default function request(url, params, type) {
  let options = {
    method: type || 'GET'
  };
  let paramUrl = url;
  if (options.method !== "GET" && typeof (params) !== "undefined" && params !== null) {
    options.body = JSON.stringify(params);
  } else if (options.method === "GET" && typeof (params) !== "undefined" && params !== null) {
    paramUrl += ('?' + queryStr.stringify(params));
  }
  return fetch(paramUrl, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => data)
    .catch(err => {
      throw err;
    });
}
