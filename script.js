let songs = [];
let songNames = [];
let currentSong = new Audio();
const getSongs = async ()=>{
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response  = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.querySelectorAll("a");
    for (let ele of as){
        if (ele.href.endsWith(".mp3")){
            songs.push(ele.href);
            songNames.push(ele.title);
        }
    }
    return songs;
}

const playMusic = (tracks)=>{
    document.querySelector(".volume").style.display = "flex";
    document.querySelector(".range").querySelector("input").style.display = "flex";

    let track = "songs/"+tracks.innerHTML+".mp3";
    console.log(tracks.innerHTML);
    currentSong.src = track;
    currentSong.play();
    play.src="svgs/pause.svg";
    songinfo = document.querySelector(".songinfo");
    songtime = document.querySelector(".songtime");
    songinfo.innerHTML = tracks.innerHTML;
}

const main = async ()=>{
    songs = await getSongs();
    let songul = document.querySelector(".songList").querySelector("ul");
    for (let song of songNames){
        songul.innerHTML = songul.innerHTML+ 
                            `<li>
                                <img class="invert" src="/svgs/music.svg">
                                <div class="info">
                                <div>${song.slice(0,-4)}</div>
                                <div>Artist</div>
                                </div>
                                <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="/svgs/play.svg">
                                </div>
                            </li>`;
    }


    let lis = document.querySelector(".songList").querySelectorAll("li")
    lis.forEach((e)=>{
        e.addEventListener("click",()=>{
            let x = e.querySelector(".info").querySelector("div");
            playMusic(x);
        })
    })

    play.addEventListener("click",()=>{
        if (currentSong.paused && currentSong.src!=""){
            currentSong.play();
            play.src="/svgs/pause.svg";
        }else if(currentSong!=""){
            currentSong.pause();
            play.src="/svgs/play.svg";
        }
    })

    currentSong.addEventListener("timeupdate",()=>{
        let ct = currentSong.currentTime;
        let cd = currentSong.duration;
        cdInMins = Math.floor(cd/60);
        cdInSecs = Math.floor(cd%60);
        ctInMins = Math.floor(ct/60);
        ctInSecs = Math.floor(ct%60)
        if (ctInMins/10<1){
            ctInMins = "0"+ctInMins;
        }
        if (cdInMins/10<1){
            cdInMins = "0"+cdInMins;
        }
        if (ctInSecs/10<1){
            ctInSecs = "0"+ctInSecs;
        }
        if (cdInSecs/10<1){
            cdInSecs = "0"+cdInSecs;
        }
        songtime.innerHTML = ctInMins+":"+ctInSecs+"/"+cdInMins+":"+cdInSecs;
        document.querySelector(".circle").style.left = (ct/cd*100)+"%";
    })

    document.querySelector(".seekbar").addEventListener(("click"),(e)=>{
        document.querySelector(".circle").style.left = 
        e.offsetX/e.target.getBoundingClientRect().width*100 + "%";
        currentSong.currentTime = e.offsetX/e.target.getBoundingClientRect().width*currentSong.duration;
    })

    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left=0;
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-110%";
    })

    previous.addEventListener("click",()=>{
        let div = document.createElement("div");
        let ind=0;
        for (let ele of songs){
            if (ele===currentSong.src){
                if (ind-1===-1){
                    div.innerHTML = songNames[songs.length-1].slice(0,-4);
                }else{
                    div.innerHTML = songNames[ind-1].slice(0,-4);
                }
                playMusic(div);
                break;
            }
            ind++;
        }
    })
    next.addEventListener("click",()=>{
        let div = document.createElement("div");
        let ind=0;
        for (let ele of songs){
            if (ele===currentSong.src){
                if (ind+1===songs.length){
                    div.innerHTML = songNames[0].slice(0,-4);
                }else{
                    div.innerHTML = songNames[ind+1].slice(0,-4);
                }
                playMusic(div);
                break;
            }
            ind++;
        }
    })

    document.querySelector(".range").querySelector("input").addEventListener("change",(e)=>{
        currentSong.volume = (e.target.value)/100;
    })
}
main();