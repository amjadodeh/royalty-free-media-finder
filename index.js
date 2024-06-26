'use strict';

const photoSearchURL = 'https://api.pexels.com/v1/search?query=';
const videoSearchURL = 'https://api.pexels.com/videos/search?query=';
var videoPage = 1;

const audioSearchURL = 'https://freesound.org/apiv2/search/text/';
const audioApiKey = 'HvhIQH3WHGMQoU37KAwlU6PG4p4O7M3eVjRvufax';

/********** FETCH FUNCTIONS **********/

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
      $('#results-list').text(
        `Something went wrong, please try again with another search term.`
      );
      console.log(`Something went wrong: ${err.message}`);
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
      $('#results-list').text(
        `Something went wrong, please try again with another search term.`
      );
      console.log(`Something went wrong: ${err.message}`);
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
      $('#results-list').text(
        `Something went wrong, please try again with another search term.`
      );
      console.log(`Something went wrong: ${err.message}`);
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
  $('#results-list').empty();
  $('#results-nav').empty();
  if (responseJson.photos.length === 0) {
    $('#results-list').html(
      `<p>No results... Try Searching for something else.</p>`
    );
  } else {
    for (let i = 0; i < responseJson.photos.length; i++) {
      $('#results-list').append(
        `<li class='result'>
        <a href='${responseJson.photos[i].src.original}' target='_blank'><img class='photo' src='${responseJson.photos[i].src.large}' alt='preview image'></a>
        <div class='links-div'>
        <p class='user-link'>By <a href='${responseJson.photos[i].photographer_url}' target='_blank'>${responseJson.photos[i].photographer}</a></p>
        <a class='dl-link' href='${responseJson.photos[i].src.original}' target='_blank' download='photo.jpeg'><img class='dl-image' src='images/dl.png' alt='download link'></a>
        </div>
        </li>`
      );
    }
    if (responseJson.page === 1 && responseJson.total_results > 15) {
      $('#results-nav').append(
        `
        <br>
        <br>
        <a class='next_page' href='${responseJson.next_page}'>Next</a>
        `
      );
    } else if (
      responseJson.page !== 1 &&
      15 * responseJson.page >= responseJson.total_results
    ) {
      $('#results-nav').append(
        `
        <br>
        <br>
        <a class='prev_page' href='${responseJson.prev_page}'>Previous</a>
        `
      );
    } else if (responseJson.page !== 1 && responseJson.photos.length === 15) {
      $('#results-nav').append(
        `
        <br>
        <br>
        <a class='prev_page' href='${responseJson.prev_page}'>Previous</a>
        <a class='next_page' href='${responseJson.next_page}'>Next</a>
        `
      );
    }
  }

  $('#results').removeClass('hidden');
}

function displayVideoResults(responseJson) {
  $('#results-list').empty();
  $('#results-nav').empty();
  if (responseJson.videos.length === 0) {
    $('#results-list').html(
      `<p>No results... Try Searching for something else.</p>`
    );
  } else {
    for (let i = 0; i < responseJson.videos.length; i++) {
      var previewVideoNumber = findPreviewVideo(i, responseJson);
      var downloadVideoNumber = findDownloadVideo(i, responseJson);
      $('#results-list').append(
        `<li class='result'>
        <video class='video' src='${responseJson.videos[i].video_files[previewVideoNumber].link}' type='video/mp4' style='background-image: url(${responseJson.videos[i].video_pictures[0].picture});' loop>
          Your browser does not support HTML video.
        </video>
        <div class='links-div'>
        <p class='user-link'>By <a href='${responseJson.videos[i].user.url}' target='_blank'>${responseJson.videos[i].user.name}</a></p>
        <a class='dl-link' href='${responseJson.videos[i].video_files[downloadVideoNumber].link}' target='_blank' download='video.mp4'><img class='dl-image' src='images/dl.png' alt='download link'></a>
        </div>
        <img class='play' src='images/play.png' alt='play and pause button'>
        </li>`
      );
    }
    if (responseJson.page === 1 && responseJson.total_results > 15) {
      $('#results-nav').append(
        `
        <br>
        <a class='next_page' href='${responseJson.url.slice(37, -1)}'>Next</a>
        `
      );
    } else if (
      responseJson.page !== 1 &&
      15 * responseJson.page >= responseJson.total_results
    ) {
      $('#results-nav').append(
        `
        <br>
        <a class='prev_page' href='${responseJson.url.slice(
          37,
          -1
        )}'>Previous</a>
        `
      );
    } else if (responseJson.page !== 1 && responseJson.videos.length === 15) {
      $('#results-nav').append(
        `
        <br>
        <a class='prev_page' href='${responseJson.url.slice(
          37,
          -1
        )}'>Previous</a>
        <a class='next_page' href='${responseJson.url.slice(37, -1)}'>Next</a>
        `
      );
    }
  }
  $('#results').removeClass('hidden');
}

function displayAudioResults(responseJson) {
  $('#results-list').empty();
  $('#results-nav').empty();
  if (responseJson.results.length === 0) {
    $('#results-list').html(
      `<p>No results... Try Searching for something else.</p>`
    );
  } else {
    for (let i = 0; i < responseJson.results.length; i++) {
      $('#results-list').append(
        `<li class='result'>
        <h3 class='audio-name'>${responseJson.results[i].name}</h3>
        <img class='waveform' src='${responseJson.results[i].images.waveform_m}' alt='waveform image'>
        <div class='links-div'>
        <audio class='audio' src='${responseJson.results[i].previews['preview-lq-mp3']}' controls>
        Preview unavailable. Your browser does not support the audio element.
        </audio>
        <a class='dl-link' href='${responseJson.results[i].previews['preview-hq-mp3']}' target='_blank' download='audio.mp3'><img class='dl-image' src='images/dl.png' alt='download link'></a>
        </div>
        </li>`
      );
    }
    if (responseJson.previous == null && responseJson.next != null) {
      $('#results-nav').append(
        `
        <br>
        <a class='next' href='${responseJson.next}'>Next</a>
        `
      );
    } else if (responseJson.previous != null && responseJson.next == null) {
      $('#results-nav').append(
        `
        <br>
        <a class='prev' href='${responseJson.previous}'>Previous</a>
        `
      );
    } else if (responseJson.previous != null && responseJson.next != null) {
      $('#results-nav').append(
        `
        <br>
        <a class='prev' href='${responseJson.previous}'>Previous</a>
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

    fetchAudioResults(url);
  }
}

function findPreviewVideo(i, responseJson) {
  for (let n = 0; n < responseJson.videos[i].video_files.length; n++) {
    if (responseJson.videos[i].video_files[n].quality == 'sd') {
      return n;
    }
  }
}

function findDownloadVideo(i, responseJson) {
  for (let n = 0; n < responseJson.videos[i].video_files.length; n++) {
    if (
      responseJson.videos[i].video_files[n].height ===
      responseJson.videos[i].height
    ) {
      return n;
    }
  }
  for (let n = 0; n < responseJson.videos[i].video_files.length; n++) {
    if (responseJson.videos[i].video_files[n].height === 2160) {
      return n;
    } else if (responseJson.videos[i].video_files[n].height === 1440) {
      return n;
    } else if (responseJson.videos[i].video_files[n].height === 1080) {
      return n;
    } else if (responseJson.videos[i].video_files[n].height === 720) {
      return n;
    }
  }
  return 1;
}

/********** EVENT HANDLER FUNCTIONS **********/

function searchButtonImage() {
  $('#search-stuff').on('mouseenter', '#js-search-button', function (event) {
    $('#js-search-button').attr('src', 'images/searchwhite.png');
  });
  $('#search-stuff').on('mouseleave', '#js-search-button', function (event) {
    $('#js-search-button').attr('src', 'images/searchblack.png');
  });
}

function watchVideoPlayer() {
  function handleVideoEvent(element) {
    if (element.prev().attr('class') == 'video' && $(document).width() < 850) {
      if (element.next().attr('class') == 'play') {
        $('.pause').each(function () {
          $(this).prev().prev().get(0).pause();
          $(this).attr('src', 'images/play.png');
          $(this).addClass('play').removeClass('pause');
        });

        element.prev().get(0).play();
        element.next().attr('src', 'images/pause.png');
        element.next().addClass('pause').removeClass('play');
      } else if (element.next().attr('class') == 'pause') {
        element.prev().get(0).pause();
        element.next().attr('src', 'images/play.png');
        element.next().addClass('play').removeClass('pause');
      }
    }
  }
  function handleImgEvent(element) {
    if (element.attr('class') == 'play') {
      $('.pause').each(function () {
        $(this).prev().prev().get(0).pause();
        $(this).attr('src', 'images/play.png');
        $(this).addClass('play').removeClass('pause');
      });

      element.prev().prev().get(0).play();
      element.attr('src', 'images/pause.png');
      element.addClass('pause').removeClass('play');
    } else if (element.attr('class') == 'pause') {
      element.prev().prev().get(0).pause();
      element.attr('src', 'images/play.png');
      element.addClass('play').removeClass('pause');
    }
  }

  $('#results-list').on('click', '.links-div', function (event) {
    handleVideoEvent($(this));
  });

  $('#results-list').on('click', '.play', function (event) {
    handleImgEvent($(this));
  });

  $('#results-list').on('click', '.pause', function (event) {
    handleImgEvent($(this));
  });

  $('#results-list').on('mouseenter', '.links-div', function (event) {
    if ($(this).prev().attr('class') == 'video' && $(document).width() > 850) {
      $(this).prev().get(0).play();
    }
  });
  $('#results-list').on('mouseleave', '.links-div', function (event) {
    if ($(this).prev().attr('class') == 'video' && $(document).width() > 850) {
      $(this).prev().get(0).pause();
    }
  });
}

function watchPrevNextPhotoVideo() {
  $('#results-nav').on('click', '.prev_page', function (event) {
    event.preventDefault();
    const url = $('.prev_page').attr('href');
    if ($('.prev_page').attr('href').includes('v1')) {
      fetchPhotoResults(url);
    } else {
      videoPage -= 1;
      const url =
        videoSearchURL + $('.prev_page').attr('href') + '&page=' + videoPage;
      fetchVideoResults(url);
    }
    window.scrollTo(0, 0);
  });
  $('#results-nav').on('click', '.next_page', function (event) {
    event.preventDefault();
    if ($('.next_page').attr('href').includes('v1')) {
      const url = $('.next_page').attr('href');
      fetchPhotoResults(url);
    } else {
      videoPage += 1;
      const url =
        videoSearchURL + $('.next_page').attr('href') + '&page=' + videoPage;
      fetchVideoResults(url);
    }
    window.scrollTo(0, 0);
  });
}

function watchPrevNextAudio() {
  $('#results-nav').on('click', '.prev', function (event) {
    event.preventDefault();
    const url = $('.prev').attr('href') + '&token=' + audioApiKey;
    fetchAudioResults(url);
    window.scrollTo(0, 0);
  });
  $('#results-nav').on('click', '.next', function (event) {
    event.preventDefault();
    const url = $('.next').attr('href') + '&token=' + audioApiKey;
    fetchAudioResults(url);
    window.scrollTo(0, 0);
  });
}

function watchForm() {
  $('#main-div').on('submit', 'form', function (event) {
    event.preventDefault();
    $('body').removeClass('landing-body');
    $('#landing-text').addClass('hidden');
    $('.landing-logo').addClass('logo').removeClass('landing-logo');
    $('.landing-h1').addClass('h1').removeClass('landing-h1');
    $('#logo-title').addClass('logo-title-post-land');
    const mediaType = $('#js-media-type').val();
    const searchInput = $('#js-search-input').val();
    submitInputs(mediaType, searchInput);
  });
}

/********** ONE FUNCTION TO RUN THEM ALL **********/

function theChosenOne() {
  watchForm();
  watchPrevNextPhotoVideo();
  watchPrevNextAudio();
  watchVideoPlayer();
  searchButtonImage();
}

$(theChosenOne);
