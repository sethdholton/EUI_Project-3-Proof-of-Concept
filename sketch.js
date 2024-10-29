

// audio values
let sound; // audio assets
let fft;
let mic;
let startAudio = false;
let inputMic = false;
let bass, lowMid, mid, highMid, treble;
let soundAvg;
sf = [];
sfIndex = 0;

let spectrum, waveform; // spectrum and waveform

let sLen, wLen; // spectrum length and waveform length

let turnSpeed;

let sf1, sf2, sfAsleep; // image assets

let partyGoers = [];

function preload() {
    sound = loadSound('/assets/i-81-car-pileup.mp3');

    sfAsleep = loadImage('/assets/sfAsleep.png');

    for (let i = 0; i < 2; i++) {
      sf[i] = loadImage("/assets/sf/" + i + ".png");
    }
    
    // sound = loadSound('/assets/demoserenade.mp3');
    // sound = loadSound('/assets/smooveguitar.mp3');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    sound.amp(.8);
    colorMode(HSB);
    textFont("Courier New");
    background(0);
}

function draw() {
    background(0);

    if (startAudio) {
      
      updateAudio();
      updateVisuals();

      displayScene();
    }

    if (stopped) {
      fill(100, 255, 255);
      textAlign(CENTER, CENTER);
      textSize(width/20);
      text("PRESS 'SPACE' TO START", width/2, height/2);
    } //else {
    //   textAlign(LEFT, CENTER);
    //   textSize(width/100);
    //   text("Click to Toggle", width * 0.025, height * 0.9);
    //   if (inputMic) {
    //     text("Input: Mic", width * 0.025, height * 0.95);
    //   } else {
    //     text("Input: Music", width * 0.025, height * 0.95);
    //   }
    // }

    image(sf[indexJump])
}

function updateAudio() {

  bass = fft.getEnergy("bass");
  lowMid = fft.getEnergy("lowMid");
  mid = fft.getEnergy("mid");
  highMid = fft.getEnergy("highMid");
  treble = fft.getEnergy("treble");

  soundAvg = (bass + lowMid + mid + highMid + treble) / 5;
  turnSpeed = map(soundAvg, 0, 255, .0000000000000001,.000005);

  // for(let i = 0; i < particles.length; i++) {
  //   particles[i].display();
  //   if (particles[i].x > width ||
  //       particles[i].y > height) {
  //         particles.splice(i, 1);
  //       }
  // }

  spectrum = fft.analyze();
  sLen = Math.floor(spectrum.length / 5);

  waveform = fft.waveform();
  wlen = waveform.length;

}

function updateVisuals() {
  if (soundAvg > 160) {
    partyGoers.push(new PartyGoer());
  }
}

function displayScene() {
  // for (let i = 0; i < sLen; i++) {
  //   h = map(spectrum[i], 0, 255, 0, height);
  //   push();
  //     translate(width/2, height/2);
  //     let r = map(i, 0, sLen, 0, TWO_PI);
  //     rotate(r-(millis()*turnspeed));
  //     let thick = h * 0.005;
  //     fill(150);
  //     triangle(-5, height-(h*1.05), 0, height, 0 + thick, height);
  //     fill(125);
  //     triangle(0, height - (h*1.), 0, height, 10 + thick, height);
  //     fill(100);
  //     triangle(0, height - (h*0.95), 0, height, 15 + thick, height);
  //     fill(75);
  //     triangle(0, height - (h*0.9), 0, height, 20 + thick, height);
  //     fill(0);
  //     triangle(0, height - (h*0.85), 0, height, 25 + thick, height);
  //   pop();
  // }
  // for ( let i = 0; i < sLen; i++) {
  //   h = map(spectrum[i], 0, 255, 0, height);
  //   push();
  //     translate(width/2, height/2.05);
  //     rotate(millis()/25000);
  //     push();
  //       let r = map(i, 0, sLen, 0, TWO_PI);
  //       rotate(r+(millis()/15000));
  //       fill(420-h*0.5, h*0.5, 255);
  //       noStroke();
  //       ellipse(0, (h*0.095)+height/10, (h*50)/width, h*0.33);
  //     pop();
  //   pop();
  // }

  // for (let i = 0; i < wlen; i++) {
  //   let y = map(waveform[i], 1, -1, 0, height/20);
  //   push();
  //     translate(width/2, height/2);
  //     let r = map(i, 0, wlen, 0, TWO_PI);
  //     rotate(r+millis()/20000);
  //     stroke(255);
  //     strokeWeight(1);
  //     line(0, y, 0, 0);
  //   pop();
  // }

  let img = sf[sfIndex];
  image(img, width/2, height/2, img.width, img.height);
  sfIndex++;
  if (sfIndex >= sf.length) {
    sfIndex = 0;
  }
}

let stopped = true;

function keyPressed() {
  // background(0);
  if (keyCode == 32) {
  getAudioContext().resume();

  if (!startAudio) {
    mic = new p5.AudioIn();
    fft = new p5.FFT();
    mic.start();
    startAudio = true;
  }

    if (stopped) {
        loop();
        // background(0);
        if (!inputMic) {
          sound.loop();
        }
        stopped = false;
    } else {
        noLoop();
        // background(0);
        if (!inputMic) {
          sound.stop();
        }
        stopped = true;
    }
  }
}

function mousePressed() {
  // background(0);
  if (!stopped) {
    if (inputMic) {
      fft.setInput(sound);
      inputMic = false;
      sound.loop();
    } else {
      fft.setInput(mic);
      inputMic = true;
      sound.stop();
    }
  }
}

class PartyGoer
{
  constructor(x, y, scale) {
    this.x = x;
    this.y = y;
    this.scale = scale;
  }
  
}