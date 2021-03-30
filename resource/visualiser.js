class AudioVisualizer {

  constructor(url) {
    this.animationFrame = null;

    this.audio = new Audio(url);

    this.canvas = document.createElement('canvas');
    this.canvas.width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;
    this.canvas.height = (window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight) / 4;

    this.canvas.className = "audioVisualiser";

    this.canvasContext = this.canvas.getContext("2d");
    
    document.body.appendChild(this.canvas);
  }
  
  init() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    this.analyser = audioContext.createAnalyser();

    const source = audioContext.createMediaElementSource(this.audio);
    source.connect(this.analyser);
    source.connect(audioContext.destination);
  }

  play() {
    if (!this.analyser) {
      this.init();
    }

    this.audio.play();
    this.animate();
  }

  pause() {
    this.audio.pause();
    
    cancelAnimationFrame(this.animationFrame);
  }
  
  mute() {
    this.audio.muted = true;
  }

  unmute() {
    this.audio.muted = false;
  }

  animate() {
    this.animationFrame = requestAnimationFrame(() => this.animate());

    this.onFrame();
  }

  onFrame() {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;
    this.canvas.height = (window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight) / 4;

    const dataArray = new Uint8Array(1000);
    const gradient = this.canvasContext.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, "#FFFF00");
    gradient.addColorStop(1, "#00FF00");
    
    this.analyser.getByteFrequencyData(dataArray);

    for (let i = 0; i < dataArray.length; i++) {
      
      this.canvasContext.fillStyle = gradient;
      this.canvasContext.fillRect(i * 4, (this.canvas.height / 256) * (256 - dataArray[i]), 3, dataArray[i]);
    }
  }
} 