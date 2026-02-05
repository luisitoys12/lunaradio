/****************************
 * CONFIG PRINCIPAL
 ****************************/

const RADIO_NAME = 'KUS Medios Radio';

// artwork provider
var API_SERVICE = 'spotify';

// STREAM HTTPS
const URL_STREAMING = 'https://libretime.kusmedios.lat/stream/main';

// METADATA HTTPS
const API_URL = 'https://libretime.kusmedios.lat/stream/status-json.xsl';

// Lyrics (Vagalume)
const API_KEY = "18fe07917957c289983464588aabddfb";


/****************************
 * INIT
 ****************************/

window.onload = function () {

    var page = new Page;
    page.changeTitlePage();
    page.setVolume();

    var player = new Player();
    player.play();

    getStreamingData();

    setInterval(function () {
        getStreamingData();
    }, 10000);

    var coverArt = document.getElementsByClassName('cover-album')[0];
    if (coverArt) {
        coverArt.style.height = coverArt.offsetWidth + 'px';
    }
};


/****************************
 * PAGE CONTROL
 ****************************/

function Page() {

    this.changeTitlePage = function (title = RADIO_NAME) {
        document.title = title;
    };

    this.refreshCurrentSong = function (song, artist) {

        document.getElementById('currentSong').innerHTML = song;
        document.getElementById('currentArtist').innerHTML = artist;

        document.getElementById('lyricsSong').innerHTML =
            song + ' - ' + artist;
    };

    this.refreshCover = function (song = '', artist) {

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {

            if (this.readyState === 4 && this.status === 200) {

                var data = JSON.parse(this.responseText);

                if (!data.results) return;

                var urlCoverArt = data.results.artwork;

                document.getElementById('currentCoverArt')
                    .style.backgroundImage =
                    'url(' + urlCoverArt + ')';

                document.getElementById('bgCover')
                    .style.backgroundImage =
                    'url(' + urlCoverArt + ')';

                if ('mediaSession' in navigator) {

                    navigator.mediaSession.metadata =
                        new MediaMetadata({
                            title: song,
                            artist: artist,
                            artwork: [{
                                src: urlCoverArt,
                                sizes: '512x512',
                                type: 'image/png'
                            }]
                        });
                }
            }
        };

        xhttp.open(
            'GET',
            'https://api.streamafrica.net/new.search.php?query=' +
            artist + ' ' + song +
            '&service=' + API_SERVICE.toLowerCase()
        );

        xhttp.send();
    };

    this.refreshLyric = function (song, artist) {

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {

            if (this.readyState === 4 && this.status === 200) {

                var data = JSON.parse(this.responseText);

                if (data.type === 'exact' || data.type === 'aprox') {

                    document.getElementById('lyric')
                        .innerHTML =
                        data.mus[0].text.replace(/\n/g, '<br>');

                }
            }
        };

        xhttp.open(
            'GET',
            'https://api.vagalume.com.br/search.php?apikey=' +
            API_KEY +
            '&art=' + artist +
            '&mus=' + song.toLowerCase(),
            true
        );

        xhttp.send();
    };

    this.changeVolumeIndicator = function (volume) {

        document.getElementById('volIndicator')
            .innerHTML = volume;

        localStorage.setItem('volume', volume);
    };

    this.setVolume = function () {

        var vol =
            (!localStorage.getItem('volume'))
                ? 80
                : localStorage.getItem('volume');

        document.getElementById('volume').value = vol;
        document.getElementById('volIndicator').innerHTML = vol;
    };
}


/****************************
 * AUDIO PLAYER
 ****************************/

var audio = new Audio(URL_STREAMING);

function Player() {

    this.play = function () {

        audio.play();

        var vol =
            localStorage.getItem('volume')
                ? localStorage.getItem('volume')
                : 80;

        audio.volume = intToDecimal(vol);

        document.getElementById('volIndicator').innerHTML = vol;
    };

    this.pause = function () {
        audio.pause();
    };
}


/****************************
 * STREAM DATA
 ****************************/

function getStreamingData() {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {

        if (this.readyState !== 4 || this.status !== 200) return;

        var data = JSON.parse(this.responseText);

        if (!data.icestats) return;

        var source = data.icestats.source;

        if (Array.isArray(source)) {
            source = source.find(s =>
                s.listenurl &&
                s.listenurl.includes('/main')
            );
        }

        if (!source) return;

        var rawTitle =
            source.title ||
            source.server_name ||
            RADIO_NAME;

        var songParts = rawTitle.split(' - ');

        var artist =
            songParts.length > 1
                ? songParts.shift()
                : 'En Vivo';

        var song =
            songParts.join(' - ');

        var page = new Page();

        document.title =
            song + ' - ' +
            artist + ' | ' +
            RADIO_NAME;

        page.refreshCurrentSong(song, artist);
        page.refreshCover(song, artist);
        page.refreshLyric(song, artist);
    };

    xhttp.open('GET', API_URL, true);
    xhttp.send();
}


/****************************
 * UTILS
 ****************************/

function intToDecimal(vol) {
    return vol / 100;
}

function decimalToInt(vol) {
    return vol * 100;
}
