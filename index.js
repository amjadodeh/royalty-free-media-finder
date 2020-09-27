'use strict';

const photoSearchURL = 'https://api.pexels.com/v1/search?query=';
const videoSearchURL = 'https://api.pexels.com/videos/search?query=';
const audioSearchURL = 'https://freesound.org/apiv2/search/text/';

const audioApiKey = 'HvhIQH3WHGMQoU37KAwlU6PG4p4O7M3eVjRvufax';

var fetchSettings = {
  url: '',
  method: 'GET',
  timeout: 0,
  headers: {
    Authorization: '563492ad6f91700001000001e6dc0d922c664b3b995eedd2333b7b68',
  },
};

function fetchImage() {
  $.ajax(fetchSettings).done(function (response) {
    console.log(response);
  });
}

/********** TEMPLATE GENERATION FUNCTIONS **********/

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join('&');
}

function fetchAudioResults(url) {
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayAudioResults(responseJson))
    .catch((err) => {
      $('#results-list').text(`Something went wrong: ${err.message}`);
    });
}

/********** RENDER FUNCTION **********/

function displayAudioResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  for (let i = 0; i < responseJson.results.length; i++) {
    $('#results-list').append(
      `<li><h3>${responseJson.results[i].name}</h3>
      <img src="${responseJson.results[i].images.waveform_m}" alt="waveform image">
      <br>
      <audio controls>
      <source src="${responseJson.results[i].previews['preview-lq-mp3']}" type="audio/mpeg">
      Preview unavailable. Your browser does not support the audio element.
      </audio>
      <p>${responseJson.results[i].description}</p>
      <a href='${responseJson.results[i].download}'>Download Here</a>
      </li>`
    );
  }
  if (responseJson.previous == null) {
    $('#results-list').append(
      `
      <br>
      <br>
      <a class='next' href='${responseJson.next}'>Next</a>
      `
    );
  } else {
    $('#results-list').append(
      `
      <br>
      <br>
      <a class='prev' href='${responseJson.previous}'>Previous</a>
      <br>
      <a class='next' href='${responseJson.next}'>Next</a>
      `
    );
  }
  $('#results').removeClass('hidden');
}

/********** SINGLE PURPOSE FUNCTIONS **********/

function submitInputs(type, input) {
  if (type === 'photo') {
  } else if (type === 'video') {
  } else if (type === 'audio') {
    const params = {
      token: audioApiKey,
      fields: 'id,name,description,previews,download,images',
      query: input,
    };

    const queryString = formatQueryParams(params);
    const url = audioSearchURL + '?' + queryString;

    console.log(url);

    fetchAudioResults(url);
  }
}

/********** EVENT HANDLER FUNCTIONS **********/

function watchPrevNext() {
  $('#results-list').on('click', '.prev', function (event) {
    event.preventDefault();
    const url = $('.prev').attr('href') + '&token=' + audioApiKey;
    fetchAudioResults(url);
    window.location.hash = 'main-div';
  });
  $('#results-list').on('click', '.next', function (event) {
    event.preventDefault();
    const url = $('.next').attr('href') + '&token=' + audioApiKey;
    fetchAudioResults(url);
    window.location.hash = 'main-div';
  });
}

function watchForm() {
  $('form').submit((event) => {
    event.preventDefault();
    const mediaType = $('#js-media-type').val();
    const searchInput = $('#js-search-input').val();
    submitInputs(mediaType, searchInput);
  });
}

$(watchForm);
$(watchPrevNext);
