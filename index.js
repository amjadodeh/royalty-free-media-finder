'use strict';

const photoSearchURL = 'https://api.pexels.com/v1/search?query=';
const videoSearchURL = 'https://api.pexels.com/videos/search?query=';
var videoPage = 1;

const audioSearchURL = 'https://freesound.org/apiv2/search/text/';
const audioApiKey = 'HvhIQH3WHGMQoU37KAwlU6PG4p4O7M3eVjRvufax';

/********** TEMPLATE GENERATION FUNCTIONS **********/

function fetchPhotoResults(url) {
  fetch(url, {
    method: 'get',
    headers: {
      Authorization: '563492ad6f91700001000001e6dc0d922c664b3b995eedd2333b7b68',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('BAD HTTP stuff');
      }
    })
    .then((json) => displayPhotoResults(json))
    .catch((err) => {
      $('#results-list').text(`Something went wrong: ${err.message}`);
    });
}

function fetchVideoResults(url) {
  fetch(url, {
    method: 'get',
    headers: {
      Authorization: '563492ad6f91700001000001e6dc0d922c664b3b995eedd2333b7b68',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('BAD HTTP stuff');
      }
    })
    .then((json) => displayVideoResults(json))
    .catch((err) => {
      $('#results-list').text(`Something went wrong: ${err.message}`);
    });
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

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join('&');
}

/********** RENDER FUNCTION **********/

function displayPhotoResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  for (let i = 0; i < responseJson.photos.length; i++) {
    $('#results-list').append(
      `<li>
      <img src="${responseJson.photos[i].src.medium}" alt="waveform image">
      <br>
      <p>By <a href="${responseJson.photos[i].photographer_url}">${responseJson.photos[i].photographer}</a></p>
      <a href='${responseJson.photos[i].src.original}'>Download Here</a>
      </li>
      <br>
      <br>`
    );
  }
  if (responseJson.page === 1) {
    $('#results-list').append(
      `
      <br>
      <br>
      <a class='next_page' href='${responseJson.next_page}'>Next</a>
      `
    );
  } else {
    $('#results-list').append(
      `
      <br>
      <br>
      <a class='prev_page' href='${responseJson.prev_page}'>Previous</a>
      <br>
      <a class='next_page' href='${responseJson.next_page}'>Next</a>
      `
    );
  }
  $('#results').removeClass('hidden');
}

function displayVideoResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  if (responseJson.videos.length === 0) {
    $('#results-list').text(`No results... Try Searching for something else.`);
  } else {
    for (let i = 0; i < responseJson.videos.length; i++) {
      $('#results-list').append(
        `<li>
        <img src="${responseJson.videos[i].video_pictures[1].picture}" alt="video preview image">
        <p>By <a href="${responseJson.videos[i].user.url}">${responseJson.videos[i].user.name}</a></p>
        <a href='${responseJson.videos[i].video_files[1].link}'>View And Download Here</a>
        </li>
        <br>
        <br>`
      );
    }
    if (responseJson.page === 1) {
      $('#results-list').append(
        `
        <br>
        <br>
        <a class='next_page' href='${responseJson.url.slice(37, -1)}'>Next</a>
        `
      );
    } else {
      $('#results-list').append(
        `
        <br>
        <br>
        <a class='prev_page' href='${responseJson.url.slice(
          37,
          -1
        )}'>Previous</a>
        <br>
        <a class='next_page' href='${responseJson.url.slice(37, -1)}'>Next</a>
        `
      );
    }
  }
  $('#results').removeClass('hidden');
}

function displayAudioResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  if (responseJson.next == null) {
    $('#results-list').text(`No results... Try Searching for something else.`);
  } else {
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
  }
  $('#results').removeClass('hidden');
}

/********** SINGLE PURPOSE FUNCTIONS **********/

function submitInputs(type, input) {
  if (type === 'photo') {
    const url = photoSearchURL + input;
    fetchPhotoResults(url);
  } else if (type === 'video') {
    const url = videoSearchURL + input;
    fetchVideoResults(url);
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

function watchPrevNextPhotoVideo() {
  $('#results-list').on('click', '.prev_page', function (event) {
    event.preventDefault();
    const url = $('.prev_page').attr('href');
    if ($('.prev_page').attr('href').includes('v1')) {
      fetchPhotoResults(url);
    } else {
      videoPage -= 1;
      const url =
        videoSearchURL +
        $('.next_page').attr('href') +
        '&page=' +
        videoPage +
        '&per_page=15';
      fetchVideoResults(url);
    }
    window.location.hash = 'main-div';
  });
  $('#results-list').on('click', '.next_page', function (event) {
    event.preventDefault();
    if ($('.next_page').attr('href').includes('v1')) {
      const url = $('.next_page').attr('href');
      fetchPhotoResults(url);
    } else {
      videoPage += 1;
      const url =
        videoSearchURL +
        $('.next_page').attr('href') +
        '&page=' +
        videoPage +
        '&per_page=15';
      fetchVideoResults(url);
    }
    window.location.hash = 'main-div';
  });
}

function watchPrevNextAudio() {
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
$(watchPrevNextPhotoVideo);
$(watchPrevNextAudio);
