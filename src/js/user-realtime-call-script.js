const APP_ID = "78e6ab1adf5140df92c8b5a43575926f";
const TOKEN = "007eJxTYDhxeMK/KTaLFv7e+S69divrllehadpdMeU7pq66cjh+tegjBQZzi1SzxCTDxJQ0U0MTg5Q0S6NkiyTTRBNjU3NTSyOzNF7TgNSGQEaGc5ukGRihEMRnYchNzMxjYAAAUXshyg==";
const CHANNEL = "main";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

let localTracks = [];
let remoteUsers = {};

let joinAndDisplayLocalStream = async () => {
    client.on("user-published", handleUserJoined);

    client.on("user-left", handleUserLeft);

    let UID = await client.join(APP_ID, CHANNEL, TOKEN, null);

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

    let player = `<div class="video-container" id="user-container-${UID}">
                        <div class="video-player" id="user-${UID}"></div>
                  </div>`;
    document
        .getElementById("video-streams")
        .insertAdjacentHTML("beforeend", player);

    localTracks[1].play(`user-${UID}`);

    await client.publish([localTracks[0], localTracks[1]]);
};

let joinStream = async () => {
    await joinAndDisplayLocalStream();
    // document.getElementById('join-btn').style.display = 'none'
    document.getElementById("stream-controls").style.display = "flex";
};

let handleUserJoined = async (user, mediaType) => {
    remoteUsers[user.uid] = user;
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
        let player = document.getElementById(`user-container-${user.uid}`);
        if (player != null) {
            player.remove();
        }

        player = `<div class="video-container" id="user-container-${user.uid}">
                      <div class="video-player" id="user-${user.uid}"></div> 

                 </div>`;
        document
            .getElementById("video-streams")
            .insertAdjacentHTML("beforeend", player);

        user.videoTrack.play(`user-${user.uid}`);
    }

    if (mediaType === "audio") {
        user.audioTrack.play();
    }
};

let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid];
    document.getElementById(`user-container-${user.uid}`).remove();
};

let microphoneOn = true;
let toggleMic = async (e) => {
    microphoneOn = !microphoneOn;
    const micButton = document.querySelector("#mic-btn");
    const micIcon = document.querySelector("#mic-btn i");

    if (localTracks[0].muted) {
        await localTracks[0].setMuted(false);
        micButton.className = "btn btn-primary";
        micIcon.className = "bi bi-mic-fill";
    } else {
        await localTracks[0].setMuted(true);
        micButton.className = "btn btn-danger";
        micIcon.className = "bi bi-mic-mute-fill";
    }
};

let cameraOn = true;
let toggleCamera = async (e) => {
    cameraOn = !cameraOn;
    const cameraButton = document.querySelector("#camera-btn");
    const cameraIcon = document.querySelector("#camera-btn i");

    if (localTracks[1].muted) {
        await localTracks[1].setMuted(false);
        cameraButton.className = "btn btn-primary";
        cameraIcon.className = "bi bi-camera-video-fill";
    } else {
        await localTracks[1].setMuted(true);
        cameraButton.className = "btn btn-danger";
        cameraIcon.className = "bi bi-camera-video-off-fill";
    }
};

const onPageLoad = async () => {
    setTimeout(async () => {
        await joinAndDisplayLocalStream();
    }, 800);
};

document.addEventListener("DOMContentLoaded", onPageLoad);
document.getElementById("mic-btn").addEventListener("click", toggleMic);
document.getElementById("camera-btn").addEventListener("click", toggleCamera);
