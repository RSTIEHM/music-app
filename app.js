const body = document.querySelector('body');
const sidebarNav = document.querySelector('.sidebar-nav');
const mainWrapper = document.querySelector('.main-wrapper-header');
const mainContentContainer = document.querySelector('.main');
const navLink = document.querySelectorAll('.nav-link');
const homeIndex = document.querySelector('.home');
const homeLink = document.querySelector('.home-link');
const homeLinkMobile = document.querySelector('.home-link-mobile');
const searchLink = document.querySelector('.search-link');
const searchLinkMobile = document.querySelector('.search-link-mobile');
const yourMusicLink = document.querySelector('.your-music-link');
const yourMusicLinkMobile = document.querySelector('.your-music-mobile');
const audio = document.querySelector('.audio');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const playNext = document.querySelector('.play-next');
const playPrev = document.querySelector('.play-prev');
const recordCover = document.querySelector('.record-cover');
const recordArtitst = document.querySelector('.record-artist');
const recordTitle = document.querySelector('.record-title');
const currentTime = document.querySelector('.current');
const remaining = document.querySelector('.remaining');
const playAlbumBTN = document.querySelector('.play-btn');
const yourMusicSpan = document.querySelector('.your-music-span');
const progressBarTrack = document.querySelector('.progress-bar-track');
const progressBar = document.querySelector('.progress-bar');
const progressBall = document.querySelector('.progress-ball');
const progressRange = document.querySelector('.progress-range');
const searchInput = document.querySelector('.search-input');
const pageHeaderTitle = document.querySelector('.page-header-title');
const pageName = document.querySelector('.page-name');

let savePlayListBTN;

let appState = [];

let localState = {
  timer: null,
  nowShowing: false,
  randomPlayListExists: true,
  playing: false,
  looping: true,
  loaded: false,
  currentlyPlayingAlbumIndex: 0,
  userSelectedAlbum: {
    albumID: 0,
    artistID: 0,
  },
  currentPlaylist: [],
  currentlyPlayingSongIndex: 0,
  tempSelectedAlbum: {},
  pageID: 0,
  userPlayList: [],
  currentPausedTrack: {
    paused: false,
    currentPausedTime: null,
    currentlyPlayingAlbumIndex: null,
    currentlyPlayingSongIndex: null,
  },
};

const changePageTitle = (elem, text) => {
  elem.style.display = 'inline-block';
  elem.textContent = text;
};

// ================================== GETTERS ===============================

const getAlbums = () => {
  return appState[0].data;
};

const getArtists = () => {
  return appState[1].data;
};

const getSongs = () => {
  return appState[3].data;
};

const getSongsByAlbumID = (albumID) => {
  return getSongs().filter((song) => song.album === albumID);
};

const getSingleArtist = (id) => {
  let foundArtistName = appState[1].data.filter((artist) => artist.id === id);
  return foundArtistName;
};

const getSingleAlbum = (id) => {
  let foundAlbum = appState[0].data.filter((album) => album.id === id);
  return foundAlbum;
};

const getAlbumByArtistID = (id) => {
  let foundAlbum = getAlbums().filter((album) => album.artist === id);
  return foundAlbum[0].title;
};

const getAlbumsByArtistID = (id) => {
  let foundAlbum = getAlbums().filter((album) => album.artist === id);
  return foundAlbum[0];
};
const getAllAlbumsByArtistID = (id) => {
  let foundAlbum = getAlbums().filter((album) => album.artist === id);
  return foundAlbum;
};

const getSongsByArtistID = (id) => {
  let allSongs = getSongs().filter((song) => song.artist === id);
  return allSongs;
};

const getSingleSong = () => {};

const getSelectedAlbum = () => {
  let { artistID } = localState.userSelectedAlbum;
  let { albumID } = localState.userSelectedAlbum;
  let foundArtist = getSingleArtist(artistID);
  let foundAlbum = getSingleAlbum(albumID);
  let foundSongs = getSongsByAlbumID(albumID);

  let foundUserSelectedAlbum = {
    artist: foundArtist[0],
    album: foundAlbum[0],
    songs: foundSongs,
  };

  localState.tempSelectedAlbum = foundUserSelectedAlbum;
  return localState.tempSelectedAlbum;
};

const getRandomPlaylist = () => {
  let songs = getSongs();
  let shuffleIndexes = [];
  let finalShuffled = [];
  while (shuffleIndexes.length < 5) {
    let rand = Math.floor(Math.random() * songs.length);
    if (!shuffleIndexes.includes(rand)) {
      shuffleIndexes.push(rand);
    }
  }

  for (let index = 0; index < shuffleIndexes.length; index++) {
    let tempObj = {};
    let artistID = songs[shuffleIndexes[index]].artist;
    let albumID = songs[shuffleIndexes[index]].album;
    const artistName = getSingleArtist(artistID)[0].name;
    const albumInfo = getSingleAlbum(albumID);
    let albumTitle = albumInfo[0].title;
    let albumArt = albumInfo[0].artWorkPath;
    songs[shuffleIndexes[index]].albumTitle = albumTitle;
    songs[shuffleIndexes[index]].albumArt = albumArt;
    songs[shuffleIndexes[index]].artistName = artistName;
    finalShuffled.push(songs[shuffleIndexes[index]]);
  }
  return finalShuffled;
};

const getUserSelectedAlbum = () => {
  const albumInfo = getSingleAlbum(localState.userSelectedAlbum.albumID)[0];
  const artist = getSingleArtist(albumInfo.artist)[0].name;
  const allSongs = getSongs();
  const songs = allSongs.filter((song) => song.album === albumInfo.id);
  let finalArr = [];
  songs.forEach((song, i) => {
    let tempObj = {};
    tempObj.album = albumInfo.id;
    tempObj.albumArt = albumInfo.artWorkPath;
    tempObj.albumOrder = song.albumOrder;
    tempObj.artist = albumInfo.artist;
    tempObj.artistName = artist;
    tempObj.duration = song.duration;
    tempObj.genre = song.genre;
    tempObj.path = song.path;
    tempObj.id = song.id;
    tempObj.plays = song.plays;
    tempObj.title = song.title;
    tempObj.albumTitle = albumInfo.title;
    finalArr.push(tempObj);
  });
  return finalArr;
};

// ================================== SETTERS ===============================

const setUserPlaylist = (arr) => {
  localState.currentlyPlayingSongIndex = localState.currentlyPlayingSongIndex;
  localState.currentPlaylist = [];
  localState.currentPlaylist = arr;
};

const setUserSelectionToState = (e) => {
  localState.userSelectedAlbum.albumID = e.target.dataset.record;
  localState.userSelectedAlbum.artistID = e.target.dataset.artist;
};

const shuffleAlbums = () => {
  let albumArr = getAlbums();
  let shuffledArr = [];
  let finalShuffled = [];
  while (shuffledArr.length < albumArr.length) {
    let rand = Math.floor(Math.random() * albumArr.length);
    if (!shuffledArr.includes(rand)) {
      shuffledArr.push(rand);
    }
  }

  for (let index = 0; index < shuffledArr.length; index++) {
    finalShuffled.push(albumArr[shuffledArr[index]]);
  }
  return finalShuffled;
};

// =================================== GENERATE HTML =========================
const singleAlbumHTML = (album) => {
  return `<div class="single-album-card" data-record="${album.id}" data-artist="${album.artist}">
      <img class="single-album-image grid-view-img" src="${album.artWorkPath}" alt="${album.title}"/>
      <h2 class="single-album-title grid-view-info">${album.title}</h2>
    </div>`;
};

const selectedArtistHTML = (artist) => {
  let artistAlbums = getAllAlbumsByArtistID(artist.id);
  let albums = artistAlbums.map((album) => {
    return singleAlbumHTML(album);
  });

  let allSongs = getSongsByArtistID(artist.id);
  console.log(allSongs, 'ALL SONGS');
  let allSongsHTML = allSongs.map((singleSong) => {
    return `<h3 data-trackid=${singleSong.id}>${singleSong.title}</h3>`;
  });

  return `<div class="single-artist-container">
            <div class="image-artist-info">
              <img class="single-artist-image" src="${
                artist.img
              }" alt="Record cover for">
              <div class="single-artist-content">
                <h2 class="single-artist-artist">${
                  artist.name
                } <span class="artist-name-span"></span></h2>
                <p>${artist.bio}</p>
                <div class="spacer">
                <h2>Albums</h2>
                  <div class="search-albums-info-container">
                    ${albums.join('')} 
                  </div>
                </div>
              </div>
            </div>
            </div>
            <div class="all-songs-search-container">
            <h2 class="single-artist-artist">All Songs</h2>
              ${allSongsHTML.join('')}   
            </div>
          </div>`;
};

const selectedAlbumHTML = (album) => {
  let songsArr = album.songs.map((song, i) => {
    // SONG LIST TRACK ===========================
    return singleSongHTML(song, i, album);
  });

  let text;
  if (`${localState.currentlyPlayingAlbumIndex}` === localState.pageID) {
    text = '(Now Playing...)';
  } else {
    text = '';
  }

  let tempAlbum = localState.tempSelectedAlbum;
  // CHECK TO SEE IF ALBUM ALREADY EXISTS IN PLAYLIST ===> FOR SAVE BTN
  let matched = localState.userPlayList.filter((list) => {
    return list.album.id === tempAlbum.album.id;
  });

  return `<div class="single-album-container">
            <div class="image-album-info">
              <img class="single-album-image" src="${
                album.album.artWorkPath
              }" alt="Record cover for ${album.album.title}">
              <div class="single-album-content">
                <h2 class="single-album-artist search-artist-card-artist single-underline" data-id=${
                  album.album.artist
                }>${
    album.artist.name
  } <span class="artist-name-span">${text}</span></h2>
                <h3 class="single-album-title">${album.album.title}</h3>
                <h4 class="track-count">${album.songs.length} Songs</h4>
                <p>${album.album.description}</p>
                <div class="button-container">
                <button class="btn play-btn">Play</button>
                  ${
                    matched.length === 0
                      ? `<button class="btn save-btn">Save</button>`
                      : '<button class="btn view-playlist-btn">Playlist</button>'
                  }

                </div>
              </div>
            </div>
            </div>
            ${songsArr.join('')}          
        </div>`;
};
// SONG LIST TRACK ===========================
const singleSongHTML = (song, i, album) => {
  return `<div class="single-album-tracks-container">
            <div class='single-album-track' data-id=${i} data-trackid=${
    song.id
  }>
              <div class='counter-container'>
                <p class='single-album-track-counter'>${i + 1}</p>
                <i class='fas fa-play icon-play'></i>
              </div>
              <div class="single-track-info-wrapper">
                <p class='single-album-track-title'>${song.title}</p>
                <p class='single-album-track-artist'>${album.artist.name}</p>
              </div>
              <div class="song-duration">
                <p>${song.duration}</p>
              </div>
            </div>
          </div>`;
};

const singleArtistSearchHTML = (artist) => {
  return `<div class="search-artist-card-artist" data-id=${artist.id}>
            <img class="search-artist-img" src="${artist.img}" />
            <h3 class="search-artist-name">${artist.name}</h3>
          </div>`;
};

const singleAlbumSearchHTML = (album) => {
  return `<div class="search-artist-card" data-record="${album.id}" data-artist="${album.artist}">
            <img class="search-artist-img" src="${album.artWorkPath}" />
            <h3 class="search-album-name">${album.title}</h3>
          </div>`;
};

const getSearchHTML = () => {
  let allArtists = getArtists();
  let allArtistHTML = allArtists.map((artist) => {
    return singleArtistSearchHTML(artist);
  });

  let allAlbums = getAlbums();
  let allAlbumsHTML = allAlbums.map((album) => {
    return singleAlbumSearchHTML(album);
  });

  return `<div class="search-container">
           <i class="fa fa-search search-icon"></i> 
           <input class="input search-input" type="text" placeholder="Start Typing..." value="">
           <i class="fa fa-search big-search"></i> 
          </div>

          <div class="search-results-container">
            <div class="search-results-card search-artists-results">
              <h2 class="search-artists-header">Artists</h2>
              <div class="search-artists-info-container">
                ${allArtistHTML.join('')}
              </div>
            </div>

            <div class="search-results-card search-albums-results">
              <h2 class="search-albums-header">Albums</h2>
              <div class="search-albums-info-container">
                ${allAlbumsHTML.join('')}
              </div>
            </div>

          </div>`;
};

const getPlayListHTML = () => {
  if (localState.userPlayList.length === 0) {
    return `<div class="playlist-container">
              <p>No Playlists Saved Yet</p>
              <button class="btn start-btn">Back</button>
            </div>`;
  }

  let playListHTML = localState.userPlayList.map((playlist, i) => {
    return `<div class='playlist-track 
    ${
      localState.pageID === localState.userPlayList[i].album.id
        ? 'selected'
        : ''
    }'
              data-albumID="${playlist.album.id}" 
              data-artistID="${playlist.artist.id}">
              <div class=''>
                <img src="${playlist.album.artWorkPath}" class=""/>
                <i class='fas fa-play icon-play'></i>
              </div>
              <div class="">
                <p class='playlist-title-album'>
                  ${playlist.artist.name} - ${playlist.album.title}</p>
              </div>
              <div class="">
                <button class="btn btn-trash"><i class="fa fa-trash trash-btn"></i></button>
              </div>
              </div>`;
  });

  return `<div class="playlist-container">
            ${playListHTML.join('')}
          </div>`;
};

// ============================= INSERT TO PAGE ==============================
const renderToPage = (single) => {
  mainContentContainer.children[0].insertAdjacentHTML('afterbegin', single);
};

const preLoadNowPlayingUI = () => {
  let current =
    localState.currentPlaylist[localState.currentlyPlayingSongIndex];

  recordCover.src = `${current.albumArt}`;
  recordCover.setAttribute('data-record', `${current.album}`);
  recordCover.setAttribute('data-artist', `${current.artist}`);
  recordTitle.textContent = `${current.title}`;
  recordArtitst.textContent = `${current.artistName}`;
  remaining.textContent = `${current.duration}`;
};

const clearAndAppendWrapper = (mainElem, newElem, classes) => {
  let innerWrapper = document.createElement(newElem);
  innerWrapper.className = classes;
  mainElem.innerHTML = '';
  mainElem.appendChild(innerWrapper);
  return;
};

//  ========================== PAGE LOADS ================================

const setPageIds = (page, id) => {
  mainContentContainer.setAttribute('data-page', page);
  mainContentContainer.setAttribute('data-id', id);
};

// =======================================================================
// ======================= HOME PAGE =====================================
// =======================================================================
const loadIndexAlbums = (albums) => {
  clearAndAppendWrapper(mainContentContainer, 'div', 'home home-index');

  let shuffled = shuffleAlbums();
  shuffled.map((album) => {
    let single = singleAlbumHTML(album);
    renderToPage(single);
  });
  if (!localState.loaded) {
    localState.currentPlaylist = getRandomPlaylist();
    setTimeout(() => {
      preLoadNowPlayingUI();
    }, 1000);
  }
  localState.loaded = true;
  setPageIds('home-page', 0);
};

// =======================================================================
// ===================== VIEW SINGLE ALBUM PAGE ==========================
// =======================================================================
const loadSingleAlbumPage = () => {
  clearAndAppendWrapper(
    mainContentContainer,
    'div',
    'single-album single-album-index'
  );
  let selectedAlbum = getSelectedAlbum();
  let userSelectedAlbum = selectedAlbumHTML(selectedAlbum);
  renderToPage(userSelectedAlbum);
};

const loadSingleArtistPage = (id) => {
  clearAndAppendWrapper(
    mainContentContainer,
    'div',
    'single-artist single-artist-index'
  );
  let artist = getSingleArtist(id);
  let userSelectedArtist = selectedArtistHTML(artist[0]);
  renderToPage(userSelectedArtist);
};

const playingTrackHighLight = () => {
  let { randomPlayListExists } = localState;

  if (randomPlayListExists) {
    return;
  } else {
    const singleAlbumTrack = document.querySelectorAll('.single-album-track');

    singleAlbumTrack.forEach((track, i) => {
      track.classList.remove('selected');
      if (i === localState.currentlyPlayingSongIndex) {
        track.classList.add('selected');
      }
    });
  }
};

// =======================================================================
// ========================= SEARCH PAGE =================================
// =======================================================================
const loadSearchPage = () => {
  clearAndAppendWrapper(mainContentContainer, 'div', 'search search-index');

  let searchPageHTML = getSearchHTML();
  renderToPage(searchPageHTML);
};
// =======================================================================
// ========================= PLAYLIST PAGE ===============================
// =======================================================================
const loadPlaylistsPage = () => {
  clearAndAppendWrapper(mainContentContainer, 'div', 'playlist playlist-index');
  let playlistPageHTML = getPlayListHTML();
  setPageIds('playlist-page', 0);
  renderToPage(playlistPageHTML);
};

const saveToPlayLists = (tempAlbum, btn) => {
  let playlist = Object.assign({}, tempAlbum);
  localState.userPlayList.push(playlist);
  btn.style.opacity = '50%';
  btn.textContent = 'Saving...';
  setTimeout(() => {
    btn.style.opacity = '100%';
    btn.style.pointerEvents = 'none';
    btn.textContent = 'Saved';
    const playListCount2 = document.querySelector('.your-music-mobile-span');
    playListCount2.textContent = localState.userPlayList.length;
    yourMusicSpan.textContent = localState.userPlayList.length;
    yourMusicSpan.classList.add('showing');
  }, 500);
};

// =======================================================================
// ========================= AUDIO PLAYER FUNCTIONS ======================
// =======================================================================
const playTrack = () => {
  audio.pause();
  const audioURL =
    localState.currentPlaylist[localState.currentlyPlayingSongIndex];
  audio.src = `${audioURL.path}`;
  audio.play();
  playIcon.style.display = 'none';
  pauseIcon.style.display = 'block';
  preLoadNowPlayingUI();
};

const pauseTrack = () => {
  playIcon.style.display = 'block';
  pauseIcon.style.display = 'none';
  audio.pause();
};

const nextTrack = () => {
  let { currentlyPlayingSongIndex } = localState;
  let { currentPlaylist } = localState;
  if (currentlyPlayingSongIndex < currentPlaylist.length - 1) {
    localState.currentlyPlayingSongIndex =
      localState.currentlyPlayingSongIndex + 1;
  } else {
    localState.currentlyPlayingSongIndex = 0;
  }

  if (localState.playing) {
    playTrack();
    if (localState.pageID == localState.currentlyPlayingAlbumIndex) {
      playingTrackHighLight();
    }
  } else {
    preLoadNowPlayingUI();
  }
};

const prevTrack = () => {
  let { currentlyPlayingSongIndex } = localState;
  let { currentPlaylist } = localState;
  if (currentlyPlayingSongIndex > 0) {
    localState.currentlyPlayingSongIndex =
      localState.currentlyPlayingSongIndex - 1;
  } else {
    localState.currentlyPlayingSongIndex = currentPlaylist.length - 1;
  }
  if (localState.playing) {
    playTrack();
    if (localState.pageID == localState.currentlyPlayingAlbumIndex) {
      playingTrackHighLight();
    }
  } else {
    preLoadNowPlayingUI();
  }
};

const prepTrackToPlay = () => {
  localState.randomPlayListExists = false;
  localState.playing = true;
  let id = mainContentContainer.dataset.id;
  localState.currentlyPlayingAlbumIndex = id;
};

const removeClassArr = (elemArr, className) => {
  elemArr.forEach((link) => {
    link.classList.remove(className);
  });
};

// =============================== EVENT LISTENERS ===============================================
// NAV LINKS
navLink.forEach((link) => {
  link.addEventListener('click', (e) => {
    navLink.forEach((single) => {
      single.classList.remove('selected');
    });
    e.target.classList.add('selected');
  });
});

// BROWSE LINK ======
homeLinkMobile.addEventListener('click', () => {
  changePageTitle(pageName, 'Albums');
  localState.pageID = 0;
  localState.nowShowing = false;
  setPageIds('home-page', localState.pageID);
  initloadPage(appState);
});

homeLink.addEventListener('click', () => {
  changePageTitle(pageName, 'Albums');
  localState.pageID = 0;
  localState.nowShowing = false;
  setPageIds('home-page', localState.pageID);
  initloadPage(appState);
});

// SEARCH LINK ======
searchLink.addEventListener('click', () => {
  changePageTitle(pageName, 'Search');
  localState.pageID = 0;
  localState.nowShowing = false;
  setPageIds('search-page', localState.pageID);
  loadSearchPage();
});
searchLinkMobile.addEventListener('click', () => {
  changePageTitle(pageName, 'Search');
  localState.pageID = 0;
  localState.nowShowing = false;
  setPageIds('search-page', localState.pageID);
  loadSearchPage();
});

// PLAYLIST LINK =========
yourMusicLink.addEventListener('click', () => {
  changePageTitle(pageName, 'Playlists');
  loadPlaylistsPage();
});
yourMusicLinkMobile.addEventListener('click', () => {
  toTop();
  changePageTitle(pageName, 'Playlists');
  loadPlaylistsPage();
});

playIcon.addEventListener('click', () => {
  localState.playing = true;
  playTrack();
});

pauseIcon.addEventListener('click', () => {
  localState.playing = false;
  pauseTrack();
});

playNext.addEventListener('click', () => {
  localState.randomPlayListExists = false;
  localState.playing = true;
  nextTrack();
});

playPrev.addEventListener('click', () => {
  localState.randomPlayListExists = false;
  localState.playing = true;
  prevTrack();
});

const toTop = () => {
  body.scrollTo({
    top: 0,
  });
};

// ==================================================================
// ================= MAIN CONTAINER EVENT LISTENERS =================
// ==================================================================
mainContentContainer.addEventListener('click', (e) => {
  // VIEW SINGLE ALBUM FROM HOME || SEARCH RESULTS PAGE  =====>
  if (
    e.target.classList.contains('single-album-card') ||
    e.target.classList.contains('search-artist-card')
  ) {
    toTop();
    changePageTitle(pageName, 'Artist & Album');
    removeClassArr(navLink, 'selected');
    let id = e.target.dataset.record;
    localState.pageID = id;
    setPageIds('single-page-album', localState.pageID);
    setUserSelectionToState(e);
    loadSingleAlbumPage();
    if (localState.pageID == localState.currentlyPlayingAlbumIndex) {
      playingTrackHighLight();
    }
  }

  if (e.target.classList.contains('search-artist-card-artist')) {
    toTop();
    changePageTitle(pageName, 'Artist');
    let id = e.target.dataset.id;
    localState.pageID = id;
    setPageIds('single-page-artist', localState.pageID);
    loadSingleArtistPage(id);
  }

  // PLAY FROM SINGLE ALBUM VIEW -----> BTN ========================
  if (e.target.classList.contains('play-btn')) {
    prepTrackToPlay();
    const finalArr = getUserSelectedAlbum();
    localState.currentlyPlayingSongIndex = 0;
    setUserPlaylist(finalArr);
    playingTrackHighLight();
    playTrack();
    const singleAlbumArtist = document.querySelector('.artist-name-span');
    singleAlbumArtist.textContent = '(Now Playing...)';
  }

  // PLAY FROM SINGLE ALBUM VIEW ----> TRACKLIST===============================
  if (e.target.classList.contains('single-album-track')) {
    toTop();
    prepTrackToPlay();
    const finalArr = getUserSelectedAlbum();
    let trackID = parseInt(e.target.dataset.id);
    localState.currentlyPlayingSongIndex = trackID;
    setUserPlaylist(finalArr);
    playingTrackHighLight();
    playTrack();
    const singleAlbumArtist = document.querySelector('.artist-name-span');
    singleAlbumArtist.textContent = '(Now Playing...)';
  }

  // SAVE FROM SINGLE ALBUM VIEW -----> BTN =======================
  if (e.target.classList.contains('save-btn')) {
    let tempAlbum = localState.tempSelectedAlbum;
    savePlayListBTN = document.querySelector('.save-btn');
    if (localState.userPlayList.length === 0) {
      saveToPlayLists(tempAlbum, savePlayListBTN);
      localStorage.setItem('playlist', JSON.stringify(localState.userPlayList));
    } else if (localState.userPlayList.length > 0) {
      // ==================== CHECK FOR DUPLICATES ============================
      let matched = localState.userPlayList.filter((list) => {
        return list.album.id === tempAlbum.album.id;
      });
      if (matched.length === 0) {
        saveToPlayLists(tempAlbum, savePlayListBTN);
        localStorage.setItem(
          'playlist',
          JSON.stringify(localState.userPlayList)
        );
      }
    }
  }

  // VIEW PLAYLIST FROM SINGLE ALBUM VIEW -----> BTN =========================
  if (e.target.classList.contains('view-playlist-btn')) {
    toTop();
    changePageTitle(pageName, 'Playlists');
    navLink.forEach((link) => {
      link.classList.remove('selected');
      if (link.classList.contains('your-music-link')) {
        link.classList.add('selected');
      }
    });
    loadPlaylistsPage();
  }

  // PLAYLIST PAGE -----> BTN ===============================================
  if (e.target.classList.contains('start-btn')) {
    toTop();
    loadIndexAlbums();
  }

  if (e.target.classList.contains('playlist-title-album')) {
    toTop();
    pageName.style.display = 'none';
    const albumID = e.target.parentElement.parentElement.dataset.albumid;
    const artistID = e.target.parentElement.parentElement.dataset.artistid;
    localState.pageID = albumID;
    setPageIds('single-page-album', localState.pageID);
    // THIS IS SAME AS CALLING     setUserSelectionToState(e); ========>
    localState.userSelectedAlbum.albumID = `${albumID}`;
    localState.userSelectedAlbum.artistID = `${artistID}`;
    navLink.forEach((link) => {
      link.classList.remove('selected');
      if (link.classList.contains('home-link')) {
        link.classList.add('selected');
      }
    });
    loadSingleAlbumPage();
    if (localState.pageID == localState.currentlyPlayingAlbumIndex) {
      playingTrackHighLight();
    }
  }

  if (e.target.classList.contains('trash-btn')) {
    e.stopPropagation();
    const albumID =
      e.target.parentElement.parentElement.parentElement.dataset.albumid;
    let newPlaylist = localState.userPlayList.filter(
      (item) => `${item.album.id}` !== `${albumID}`
    );
    localState.userPlayList = newPlaylist;
    const playListCount = document.querySelector('.your-music-span');
    const playListCount2 = document.querySelector('.your-music-mobile-span');
    localStorage.setItem('playlist', JSON.stringify(localState.userPlayList));

    if (localState.userPlayList.length === 0) {
      playListCount.classList.remove('showing');
    }

    playListCount.textContent = localState.userPlayList.length;
    playListCount2.textContent = localState.userPlayList.length;
    loadPlaylistsPage();
  }
});
// ===============================================================================
// ===========================SEARCH PAGE EVENT LISTENERS ========================
// ===============================================================================
mainContentContainer.addEventListener('keyup', (e) => {
  if (e.target.classList.contains('search-input')) {
    let term = e.target.value;

    let artists = getArtists();
    let foundArtists = artists.filter((artist) => {
      let albumTitle = getAlbumByArtistID(artist.id);
      return (
        artist.name.toLowerCase().includes(term.toLowerCase()) ||
        albumTitle.toLowerCase().includes(term.toLowerCase())
      );
    });

    let foundArtistNameHTML = foundArtists.map((artist) => {
      return singleArtistSearchHTML(artist);
    });

    let albums = getAlbums();
    let foundAlbums = albums.filter((album) => {
      let artistName = getSingleArtist(album.artist);
      album.artistName = artistName[0].name;
      return (
        album.title.toLowerCase().includes(term.toLowerCase()) ||
        album.artistName.toLowerCase().includes(term.toLowerCase())
      );
    });

    let foundAlbumsHTML = foundAlbums.map((album) => {
      return singleAlbumSearchHTML(album);
    });

    const searchContainer = document.querySelector('.search-results-container');
    const searchArtists = document.querySelector(
      '.search-artists-info-container'
    );
    const searchAlbums = document.querySelector(
      '.search-albums-info-container'
    );

    clearInterval(localState.timer);
    localState.timer = setTimeout(() => {
      document.querySelector('.big-search').style.display = 'none';
      searchContainer.classList.add('show');
      searchArtists.innerHTML =
        foundArtistNameHTML.length > 0
          ? foundArtistNameHTML.join('')
          : `<p class="search-error">No Artist Found</p>`;
      searchAlbums.innerHTML =
        foundAlbumsHTML.length > 0
          ? foundAlbumsHTML.join('')
          : `<p class="search-error">No Album Found</p>`;
    }, 700);
  }
});

// ==================================================================
// =================== END MAIN CONTAINER EVENT LISTENERS ===========
// ==================================================================

audio.addEventListener('ended', (e) => {
  if (localState.looping) {
    nextTrack();
  }
});

audio.addEventListener('canplay', (e) => {});

audio.addEventListener('timeupdate', () => {
  let curr = Math.floor(audio.currentTime);
  let dur = Math.floor(audio.duration);
  let barProgress = Math.floor((curr / dur) * 100);
  let currentTimeleft = convertHMS(curr);
  currentTime.textContent = `${currentTimeleft}`;
  progressBarTrack.style.width = `${barProgress + 1}%`;
  progressRange.value = `${barProgress}`;
});

function convertHMS(value) {
  const sec = parseInt(value, 10);
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - hours * 3600) / 60);
  let seconds = sec - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return minutes + ':' + seconds;
}

audio.addEventListener('pause', () => {});

recordCover.addEventListener('click', (e) => {
  // =============== THIS NEEDS SOME WORK =================
  setUserSelectionToState(e);
  loadSingleAlbumPage();
});

// =============================================================================
// ============================== INITAL PAGE LOAD HERE ========================
// =============================================================================
const initloadPage = (state) => {
  let albums = getAlbums();
  loadIndexAlbums(albums);

  let storedPlaylist = JSON.parse(localStorage.getItem('playlist')) || [];
  localState.userPlayList = storedPlaylist;
  if (localState.userPlayList.length > 0) {
    yourMusicSpan.classList.add('showing');
    yourMusicSpan.textContent = localState.userPlayList.length;
  }
};
// =============================================================================
// ============================== END INITAL PAGE LOAD HERE ====================
// =============================================================================
