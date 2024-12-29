container.addEventListener("click", function () {
  let audio = new Audio();
  // audio.src = "./mancing-mania-remix.mp3";
  // audio.src = "./ed-sheeran-one-life.mp3";
  // audio.src = "./cocomelon-intro-sound-effect.mp3";
  audio.src = "/videoplayback.mp4";

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  let canvas = document.getElementById("canvas").transferControlToOffscreen();
  console.log("click");
  const worker = new Worker("./worker.js");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  worker.postMessage({ canvas }, [canvas]);

  audio.play();
  audioSource = audioCtx.createMediaElementSource(audio);
  analyser = audioCtx.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 32;

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  console.log(bufferLength, dataArray);

  function animate() {
    analyser.getByteFrequencyData(dataArray);
    worker.postMessage({ bufferLength, dataArray }, {});
    requestAnimationFrame(animate);
  }

  animate();
});
