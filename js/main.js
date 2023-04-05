const wrapper_player = document.querySelector(".wrapper_player"),
    musicImg = wrapper_player.querySelector(".img-area img"),
    musicName = wrapper_player.querySelector(".song-details .name"),
    musicArtist = wrapper_player.querySelector(".song-details .artist"),
    playPauseBtn = wrapper_player.querySelector(".play-pause"),
    prevBtn = wrapper_player.querySelector("#prev"),
    nextBtn = wrapper_player.querySelector("#next"),
    mainAudio = wrapper_player.querySelector("#main-audio"),
    progressArea = wrapper_player.querySelector(".progress-area"),
    progressBar = progressArea.querySelector(".progress-bar"),
    musicList = wrapper_player.querySelector(".music-list"),
    moreMusicBtn = wrapper_player.querySelector("#more-music"),
    closemoreMusic = musicList.querySelector("#close");
let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;


window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playMusic();
    playingSong();
    setVolume();
    console.info("THANKS FOR USE MY LOADING SCREEN JOIN THE DISCORD PLEASE :(")
});

function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `img/${allMusic[indexNumb - 1].img + "." + allMusic[indexNumb - 1].type_image}`;
    mainAudio.src = `audio/${allMusic[indexNumb - 1].src + "." + allMusic[indexNumb - 1].type_music}`;
}

//play music function
function playMusic() {
    wrapper_player.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//pause music function
function pauseMusic() {
    wrapper_player.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

//prev music function
function prevMusic() {
    musicIndex--; //decrement of musicIndex by 1
    //if musicIndex is less than 1 then musicIndex will be the array length so the last music play
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

//next music function
function nextMusic() {
    musicIndex++; //increment of musicIndex by 1
    //if musicIndex is greater than array length then musicIndex will be 1 so the first music play
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

// play or pause button event
playPauseBtn.addEventListener("click", () => {
    const isMusicPlay = wrapper_player.classList.contains("paused");
    //if isPlayMusic is true then call pauseMusic else call playMusic
    isMusicPlay ? pauseMusic() : playMusic();
    playingSong();
});

//prev music button event
prevBtn.addEventListener("click", () => {
    prevMusic();
});

//next music button event
nextBtn.addEventListener("click", () => {
    nextMusic();
});

// update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; //getting playing song currentTime
    const duration = e.target.duration; //getting playing song total duration
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper_player.querySelector(".current-time"),
        musicDuartion = wrapper_player.querySelector(".max-duration");
    mainAudio.addEventListener("loadeddata", () => {
        // update song total duration
        let mainAdDuration = mainAudio.duration;
        let totalMin = Math.floor(mainAdDuration / 60);
        let totalSec = Math.floor(mainAdDuration % 60);
        if (totalSec < 10) { //if sec is less than 10 then add 0 before it
            totalSec = `0${totalSec}`;
        }
        musicDuartion.innerText = `${totalMin}:${totalSec}`;
    });
    // update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) { //if sec is less than 10 then add 0 before it
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// update playing song currentTime on according to the progress bar width
progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth; //getting width of progress bar
    let clickedOffsetX = e.offsetX; //getting offset x value
    let songDuration = mainAudio.duration; //getting song total duration

    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic(); //calling playMusic function
    playingSong();
});

//change loop, shuffle, repeat icon onclick
const repeatBtn = wrapper_player.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText; //getting this tag innerText
    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffled");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
});

//code for what to do after song ended
mainAudio.addEventListener("ended", () => {
    // we'll do according to the icon means if user has set icon to
    // loop song then we'll repeat the current song and will do accordingly
    let getText = repeatBtn.innerText; //getting this tag innerText
    switch (getText) {
        case "repeat":
            nextMusic(); //calling nextMusic function
            break;
        case "repeat_one":
            mainAudio.currentTime = 0; //setting audio current time to 0
            loadMusic(musicIndex); //calling loadMusic function with argument, in the argument there is a index of current song
            playMusic(); //calling playMusic function
            break;
        case "shuffle":
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1); //genereting random index/numb with max range of array length
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randIndex); //this loop run until the next random number won't be the same of current musicIndex
            musicIndex = randIndex; //passing randomIndex to musicIndex
            loadMusic(musicIndex);
            playMusic();
            playingSong();
            break;
    }
});

//show music list onclick of music icon
moreMusicBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", () => {
    moreMusicBtn.click();
});

const ulTag = wrapper_player.querySelector("ul");
// let create li tags according to array length for list
for (let i = 0; i < allMusic.length; i++) {
    //let's pass the song name, artist from the array
    let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
              </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag

    let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
    liAudioTag.addEventListener("loadeddata", () => {
        let duration = liAudioTag.duration;
        let totalMin = Math.floor(duration / 60);
        let totalSec = Math.floor(duration % 60);
        if (totalSec < 10) { //if sec is less than 10 then add 0 before it
            totalSec = `0${totalSec}`;
        };
        liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
        liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
    });
}

//play particular song from the list onclick of li tag
function playingSong() {
    const allLiTag = ulTag.querySelectorAll("li");

    for (let j = 0; j < allLiTag.length; j++) {
        let audioTag = allLiTag[j].querySelector(".audio-duration");

        if (allLiTag[j].classList.contains("playing")) {
            allLiTag[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }

        //if the li tag index is equal to the musicIndex then add playing class in it
        if (allLiTag[j].getAttribute("li-index") == musicIndex) {
            allLiTag[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }

        allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
}

// Volume

var volIcon = document.querySelector('.volume')
var volBox = document.querySelector('.volume-box')
var volumeRange = document.querySelector('.volume-range')
var volumeDown = document.querySelector('.volume-down')
var volumeUp = document.querySelector('.volume-up')
volumeRange.value = volume

function handleVolume() {
    volIcon.classList.toggle('active')
    volBox.classList.toggle('active')
}

volumeDown.addEventListener('click', handleVolumeDown);
volumeUp.addEventListener('click', handleVolumeUp);

function setVolume(){
  mainAudio.volume = volumeRange.value / 100;
}

function handleVolumeDown() {
    volumeRange.value = Number(volumeRange.value) - 10
    mainAudio.volume = volumeRange.value / 100
}

function handleVolumeUp() {
    volumeRange.value = Number(volumeRange.value) + 10
    mainAudio.volume = volumeRange.value / 100
}

//particular li clicked function
function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //updating current song index with clicked li index
    loadMusic(musicIndex);
    playMusic();
    playingSong();
    setVolume();
}

function loadProgress(progress) {
    $(".loader .progress").html(progress + "%");
}

window.addEventListener('message', function(e) {
    if (e.data.eventName === 'loadProgress') {
        loadProgress(parseInt(e.data.loadFraction * 100));
    }
});

// Video
document.getElementById("YTvdo").setAttribute("src", "https://www.youtube.com/embed/" + video_ID + "?autoplay=1&controls=0&playlist="+ video_ID + "&hd=1&amp;&loop=1&mute=1&rel=0" + " " + "frameborder='1' allow='autoplay; encrypted-media' allowfullscreen")

//video fullscreen

$(".hideoverlay .bind").html(key_overlay)

var overlay = true;
$(document).keydown(function(e) {
    if(e.key === key_overlay) {
        console.warn("Is working! " + overlay)
        overlay = !overlay;
        if(!overlay) {
            $(".overlay").css("opacity", ".0")
        } else {
            $(".overlay").css("opacity", "")
        }
    }
})
document.getElementById("footer").innerHTML = key_overlay + " - Fullscreen the video";


/*

  --------------------------------------------------------------------------------------------------------------------------------------------------

                                              THANKS FOR USE MY LOADING SCREEN JOIN THE DISCORD PLEASE :(

  --------------------------------------------------------------------------------------------------------------------------------------------------
  
*/