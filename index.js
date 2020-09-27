'use strict';

const audioApiKey = 'HvhIQH3WHGMQoU37KAwlU6PG4p4O7M3eVjRvufax';
const imageSearchURL = 'https://api.pexels.com/v1/search';
const videoSearchURL = 'https://api.pexels.com/videos/search';
const audioSearchURL = 'https://freesound.org/apiv2/search/text/';

var fetchSettings = {
  url: 'https://api.pexels.com/v1/search?query=',
  method: 'GET',
  timeout: 0,
  headers: {
    Authorization: '563492ad6f91700001000001e6dc0d922c664b3b995eedd2333b7b68',
  },
};

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join('&');
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  for (let i = 0; i < responseJson.results.length; i++) {
    $('#results-list').append(
      `<li><h3>${responseJson.results[i].name}</h3>
      <p>${responseJson.results[i].description}</p>
      <a href='${responseJson.results[i].download}'>Download Here</a>
      </li>`
    );
  }
  $('#results').removeClass('hidden');
}

function fetchImage() {
  $.ajax(imageFetchSettings).done(function (response) {
    console.log(response);
  });
}

function getResults(type, input) {
  if (type === 'Photo') {
    console.log('Photo');
  } else if (type === 'Video') {
    console.log('Video');
  } else if (type === 'Audio') {
    console.log('Audio');

    const params = {
      token: audioApiKey,
      fields: 'id,name,description,previews,download,images',
      query: input,
    };

    const queryString = formatQueryParams(params);
    const url = audioSearchURL + '?' + queryString;

    console.log(url);

    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then((responseJson) => displayResults(responseJson))
      .catch((err) => {
        $('#results-list').text(`Something went wrong: ${err.message}`);
      });
  }
}

function watchForm() {
  $('form').submit((event) => {
    event.preventDefault();
    const mediaType = $('#js-media-type').val();
    const searchInput = $('#js-search-input').val();
    getResults(mediaType, searchInput);
  });
}

$(watchForm);
