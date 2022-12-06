let isAppInit = false;

window.addEventListener("keydown", init);
window.addEventListener("click", init);

function init() {
  if (isAppInit) {
    return;
  }

  // create web audio api context
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();

  // create Oscillator and gain node
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  // connect oscillator to gain node to speakers
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const maxFreq = 6000;
  const maxVol = 0.02;
  const initialVol = 0.001;

  // set options for the oscillator
//   oscillator.detune.value = 100; // value in cents
  oscillator.start(0);

  oscillator.onended = function () {
    console.log("Your tone has now stopped playing!");
  };

  gainNode.gain.value = initialVol;
  gainNode.gain.minValue = initialVol;
  gainNode.gain.maxValue = initialVol;

  // Mouse pointer coordinates
  let loudness;

  // Get new mouse pointer coordinates when mouse is moved
  // then set new gain and pitch values
  document.addEventListener('devicemotion', (event) => {updatePage(event)});

  function updatePage(e) {
    let x = e.acceleration.x;
    let y = e.acceleration.y;
    let z = e.acceleration.z;
    let speed = Math.sqrt(x*x + y*y + z*z);
    if (speed > 0.05) {
        loudness = Math.max(0.0, loudness - 0.01);
    }
    else {
        loudness = Math.min(1.0, loudness + 0.01)
    }
    oscillator.frequency.value = 440;
    gainNode.gain.value = loudness * maxVol;
  }

  isAppInit = true;
}