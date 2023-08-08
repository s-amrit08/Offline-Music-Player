//selecting all the required tag elements
const wrapper=document.querySelector(".wrapper");

musicImg=wrapper.querySelector(".img-area img"),
musicName=wrapper.querySelector(".song-details .name"),
musicArtist=wrapper.querySelector(".song-details .artist");
mainAudio=wrapper.querySelector("#main-audio"),
playPauseBtn=wrapper.querySelector(".play-pause"),
prevBtn=wrapper.querySelector("#prev"),
nextBtn=wrapper.querySelector("#next"),
progressBar=wrapper.querySelector(".progress-bar"),
progressArea=wrapper.querySelector(".progress-area"),
musicList=wrapper.querySelector(".music-list"),
showMoreBtn=wrapper.querySelector("#more-music"),
hideMusicBtn=musicList.querySelector("#close");



//loading a random song, whenever the page refreshes.
let musicIndex=Math.floor((Math.random() * allMusic.length)+1);

//once the window is loaded -> ("Load") we call the loadMusic function
window.addEventListener("load", ()=>{
    loadMusic(musicIndex);//loads the music once the window loads
    playingNow();
})

//loadMusic function--loads the music details
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb-1].name;
    //indexes of allMusic starst from 0. Thus, nth music = n-1th index
    musicArtist.innerText= allMusic[indexNumb-1].artist;

    //Note the arguments are inside, tab ke upr wala symbol and not single quotes.
    musicImg.src=`images/${allMusic[indexNumb-1].img}.jpg`;
    mainAudio.src=`music/${allMusic[indexNumb-1].src}.mp3`;
}

//play music function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText="pause";
    mainAudio.play();
    
}

//pause music function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText="play_arrow"; // i refers to the icon tag of html.
    mainAudio.pause();
}

//nextmusic function
function nextMusic(){
    //increment the index by 1. 
    //index=1 because we have use [indexNumb-1];
    musicIndex++;   

    //if the index is last, move back to index=1.
    musicIndex>allMusic.length ? musicIndex= 1 : musicIndex;
    //after incrementing we have to load again.
    loadMusic(musicIndex);
    playMusic();
    playingNow();

}

//prevmusic function
function prevMusic(){
    //decrement the index by 1. 
    musicIndex--;   

    musicIndex<1 ? musicIndex= allMusic.length : musicIndex;
    //after decrementing we have to load again.
    loadMusic(musicIndex);
    playMusic();
    playingNow();

}


playPauseBtn.addEventListener("click", ()=>{
    const IsMusicPaused=wrapper.classList.contains("paused");
    //ternayr operator
    IsMusicPaused ? pauseMusic() : playMusic();
    playingNow();

});

//next music button event
nextBtn.addEventListener("click",()=>{
    //call next music function if next button is clciked.
    //nextMusic(); 
    let getText=repeatBtn.innerText;
    
    //This functionality was added by myself-----> Jab mai next button ko dabau tab wo pehle 
    //check krega ki kis type ka icon abhi repeatbutton pr hai
    //then the next song will be played accordingly.
    
    switch(getText){
        case "repeat": //this means playlist looped 
            nextMusic();
            break;

        case "repeat_one":
            mainAudio.currentTime=0;
            loadMusic(indexNumb);
            playMusic();
            break;
        
        case "shuffle":
            //generating a random index between the range of arrray Length. 
            let randIndex=Math.floor(Math.random()*allMusic.length+1);
            
            //the generated random number should not be same and the current index.
            do{
                randIndex=Math.floor(Math.random()*allMusic.length+1);
            }while(musicIndex==randIndex);

            
            musicIndex=randIndex; //updating music index
            loadMusic(musicIndex);  //loading the music.
            playMusic();
            playingNow();

            break;

    }

});

closeBtn=wrapper.querySelector("#close-player");
closeBtn.addEventListener("click", ()=>{
    if(confirm("Are you sure you want to close the Player?")){
        close();
    }
});

//prev music button event
prevBtn.addEventListener("click",()=>{
    //call prev music function if prev button is clicked.
    prevMusic(); 
});

//updating the progress bar accroding to the progress of music.
mainAudio.addEventListener("timeupdate", (e) =>{
    
    //Every second the information about the audio will be generated.
    //see this info when you play the song (use inspect to see).
    //console.log(e);

    //currentTime and duration are two of the many properties of e.
    const currentTime= e.target.currentTime; //gets the current time of song
    const duration=e.target.duration; //gets the total duration of the song.

    let progressWidth= (currentTime / duration)*100; //currentTiem pr prgress kitna hua hoga hoga.

    //progressbar ki width property ko update krrhe hai
    progressBar.style.width = `${progressWidth}%`;
    
    let musicCurrentTime= wrapper.querySelector(".current"),
    musicDuration= wrapper.querySelector(".duration");
    
        //updating the current time and duration on the song display
    mainAudio.addEventListener("loadeddata",()=>{
        //update song's total duration
        let audioDuration = mainAudio.duration;
        
        //currently the audioduration is in seconds.Thus, we ahve to convert it into mintues
        let totalMin= Math.floor(audioDuration/60);
        let totalSec= Math.floor(audioDuration%60);
        
        //Seconds ko 01,02,03 dikhane ke liye
        if(totalSec<10){
            totalSec=`0${totalSec}`
        }
        musicDuration.innerText= `${totalMin}:${totalSec}`;
    });

        //update currently playing song's play time duration

        //currently the audioduration is in seconds.Thus, we ahve to convert it into mintues
        let currentMin= Math.floor(currentTime/60);
        let currentSec= Math.floor(currentTime%60);
        
        //Seconds ko 01,02,03 dikhane ke liye
        if(currentSec<10){
            currentSec=`0${currentSec}`;
        }
        musicCurrentTime.innerText= `${currentMin}:${currentSec}`;


});

//updating the current time of the song according to the progress bar width.
progressArea.addEventListener("click",(e)=>{
    let progressWidthVal=progressArea.clientWidth;//getting progress bar ki width.
    let clickedOffSetX=e.offsetX;//getting offset X value

    let songDuration=mainAudio.duration;//getting the song's total duration.

    mainAudio.currentTime= (clickedOffSetX/progressWidthVal)* songDuration;

    //now the music doesn't play if the music is already on pause.
    playMusic();

});

//Providing functionality to repeat and shuffle song.
//Right now only the icon is changed, 
const repeatBtn=wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click",()=>{
    //getting the innertext of icon and then change it accordingly.
    let getText=repeatBtn.innerText;

    switch(getText){
        case "repeat": //if repeat icon.repeat is icon name, innerText gives us the text inside<i></i>
        repeatBtn.innerText="repeat_one";
        repeatBtn.setAttribute("title","Song Looped")
        break;

        case "repeat_one":
        repeatBtn.innerText="shuffle";
        repeatBtn.setAttribute("title","Playlist Shuffled")
        break;

        case "shuffle":
        repeatBtn.innerText="repeat";
        repeatBtn.setAttribute("title","Playlist Looped")
        break;

    }
});

//now we will work on what to do after the song ends.
mainAudio.addEventListener("ended",()=>{
    //changes are made according to the icons.
    let getText=repeatBtn.innerText;
    
    switch(getText){
        case "repeat": //this means playlist looped 
            nextMusic();
            break;

        case "repeat_one":
            mainAudio.currentTime=0;
            loadMusic(musicIndex);
            playMusic();
            break;
        
        case "shuffle":
            //generating a random index between the range of arrray Length. 
            let randIndex=Math.floor(Math.random()*allMusic.length+1);
            
            //the generated random number should not be same and the current index.
            do{
                randIndex=Math.floor(Math.random()*allMusic.length+1);
            }while(musicIndex==randIndex);

            
            musicIndex=randIndex; //updating music index
            loadMusic(musicIndex);  //loading the music.
            playMusic();
            playingNow();
            break;

    }


});


showMoreBtn.addEventListener("click",()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click",()=>{
    showMoreBtn.click();
});

const ulTag=wrapper.querySelector("ul");

//Lets create li.
for (let i = 0; i < allMusic.length; i++) {
    
    // li-index is i+1 because, firstly we are using li-index, to get the index of currently played song.
    //although, li-index is also used to provide the click featur, i.e. when a li is clicked it should start playing.
    //But, the loadmusic function loads the (index-1)th music. Thus, if i will be 0 loadmusic will reach -1, which is not possible.
    
    let liTag=`<li li-index="${i+1}"> 
                <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                </div>
                <audio class="${allMusic[i].src}" src="music/${allMusic[i].src}.mp3"></audio>
                <span id="${allMusic[i].src}" class="audio-duration"></span>
            </li>`;
        
    ulTag.insertAdjacentHTML("beforeend",liTag);

    //selects span tag which show audio duration.
    let liAudioDuration=ulTag.querySelector(`#${allMusic[i].src}`);
    
    //selects the audio tag which have the audio source.
    let liAudioTag=ulTag.querySelector(`.${allMusic[i].src}`);

    //loadeddata is used to get the duration of the audio without playing it.
    liAudioTag.addEventListener("loadeddata",()=>{
        let audioDuration = liAudioTag.duration;
        
        //currently the audioduration is in seconds.Thus, we ahve to convert it into mintues
        let totalMin= Math.floor(audioDuration/60);
        let totalSec= Math.floor(audioDuration%60);
        
        //Seconds ko 01,02,03 dikhane ke liye
        if(totalSec<10){
            totalSec=`0${totalSec}`
        }
        liAudioDuration.innerText= `${totalMin}:${totalSec}`;

        //the attribute will be used to load the duration, when the currently played song is changed.
        //Thus, it status will change from Playing ---> duration of song.
        liAudioDuration.setAttribute("t-duration",`${totalMin}:${totalSec}`);
    });
}

//Working on clicking a particular song
const allLiTags=ulTag.querySelectorAll("li");

function playingNow(){
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag=allLiTags[j].querySelector(".audio-duration");

        //remove the class playing from any other song.
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            audioTag.innerText="";
            
            //Now the Playing is removed, thus, add the duration of song.
            let adDuration=audioTag.getAttribute("t-duration");
            audioTag.innerText=adDuration;
        }

    
        //if there is an li tag whose li-index==musicIndex, this means the music is current being played.
        //in this case we will style the particular li.
        if(allLiTags[j].getAttribute("li-index")==musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText="Playing";
        }
    
        //adding onclick attribute to all li
        allLiTags[j].setAttribute("onclick","clicked(this)");//after this we updated inside <li> tgas as <li li-index="${i}">
    }
}


//Playing song when a particular li is clicked
function clicked(element){
    //pehle uss list item(li) ka index lekar aao, jipr click hua hai.
    let getLiIndex=element.getAttribute("li-index");

    //Then make the relevant changes for playing the song.
    musicIndex=getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

