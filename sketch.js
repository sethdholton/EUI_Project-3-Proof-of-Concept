

// audio values
let sound; // audio assets
let fft;
let mic;
let startAudio = false;
let inputMic = false;
let bass, lowMid, mid, highMid, treble;
let soundAvg;
let sf = [];
let bassEnergy;
let lastBeatTime = 0;
let bpm = 120;
let beatInterval = (60 / bpm) * 1000;
let freqThreshold = 150;

let camX = 0;

let spectrum, waveform; // spectrum and waveform

let sLen, wLen; // spectrum length and waveform length

let displaythoughtbubble = false;

let turnSpeed;
let displace;
let tempDisplace = 0;

let spawnInterval = 0;
let phase = 0;

let sf1, sf2, sfAsleep, thoughtbubble; // image assets

let partyGoers = [];

function preload() {
    sound = loadSound('./assets/i-81-car-pileup.mp3');

    sfAsleep = loadImage('./assets/sfAsleep.png');

    for (let i = 0; i < 2; i++) {
      sf[i] = loadImage("./assets/sf/" + i + ".png");
    }

    thoughtbubble = loadImage("./assets/thoughtbubble.png");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    sound.amp(.8);
    colorMode(RGB);
    textFont("Courier New");
    background(0);

    // background
    partyGoers.push(new PartyGoer(width*1.3, height/2, 3, false));
    partyGoers.push(new PartyGoer(width*0.95, height/2, 3, false));
    partyGoers.push(new PartyGoer(width * 1.5, height/2, 3, false));
    partyGoers.push(new PartyGoer(width * 2.1, height/2, 3, false));
    partyGoers.push(new PartyGoer(width * 2.4, height/2, 3, false));
    
    // foreground
    partyGoers.push(new PartyGoer(width*0.5, height/2, 4, false));
    partyGoers.push(new PartyGoer(width, height/2, 4, false));
    partyGoers.push(new PartyGoer(width * 1.3, height/2, 4, false));
    partyGoers.push(new PartyGoer(width * 1.7, height/2, 4, false));

    // spawnNewPartyGoers();
}

function draw() {
    background(200);

    noStroke();
    fill(100);
    rect(0, height*0.6, width, height*0.4);

    displace = (camX*-1) + (width);

    if (startAudio) {
      updateAudio();
      // updateVisuals();

      push();
        translate(camX, 0);
        displayScene();
        if (displaythoughtbubble) {
          strokeWeight(4);
          stroke(0);
          fill(255);
          // circle(width*0.3 + tempDisplace, height*0.7, width*0.01);
          circle(width*0.45 + tempDisplace, height*0.6, width*0.01);
          circle(width*0.6 + tempDisplace, height*0.55, width*0.02);
          circle(width*0.9 + tempDisplace, height*0.5, width*0.05);
          image(thoughtbubble, width*0.9 + tempDisplace, 0, thoughtbubble.width*1.54, thoughtbubble.height*1.54);
        }
    
      pop();

      camX--;
      if (camX % width == 0) {
        spawnNewPartyGoers();
        phase++;
        console.log("yes");
      }
    }

    displayUI();
    spawnInterval++;
}

function updateAudio() {

  bass = fft.getEnergy("bass");
  lowMid = fft.getEnergy("lowMid");
  mid = fft.getEnergy("mid");
  highMid = fft.getEnergy("highMid");
  treble = fft.getEnergy("treble");

  soundAvg = (bass + lowMid + mid + highMid + treble) / 5;
  turnSpeed = map(soundAvg, 0, 255, .0000000000000001,.000005);

  fft.analyze();
  bassEnergy = fft.getEnergy("bass");

  // console.log("Bass Energy: ", bassEnergy);

  if (bassEnergy > freqThreshold && millis() - lastBeatTime > beatInterval * 0.8) {
    for(let i = 0; i < partyGoers.length; i++) {
      partyGoers[i].anim();
    }
    lastBeatTime = millis();
    // console.log("Beat detected!");
  }

  let timeSinceLastBeat = millis() - lastBeatTime;
  let speedC = map(timeSinceLastBeat, 0, beatInterval, 0, width);

  // ellipse(speedC, height / 2, height * 0.5, height * 0.5);
  // if (speedC == 0) {
  //   for(let i = 0; i < partyGoers.length; i++) {
  //     partyGoers[i].anim();
  //   }
  // }

  // spectrum = fft.analyze();
  // sLen = Math.floor(spectrum.length / 5);

  // waveform = fft.waveform();
  // wlen = waveform.length;

}

function displayScene() {
  for (let i = 0; i < partyGoers.length; i++) {
    partyGoers[i].display();
  }
}

function spawnNewPartyGoers() {
  if (phase == 0) {
    // background
    partyGoers.push(new PartyGoer(width*1.3 + displace, height/2, 3, false));
    partyGoers.push(new PartyGoer(width*0.95 + displace, height/2, 3, false));
    // foreground
    partyGoers.push(new PartyGoer(width*0.5 + displace, height/2, 4, false));
    partyGoers.push(new PartyGoer(width + displace, height/2, 4, false));
  } else if (phase == 1) {
    partyGoers.push(new PartyGoer(width*1.3 + displace, height/2, 3, false));
    partyGoers.push(new PartyGoer(width*0.95 + displace, height/2, 3, true));
    displaythoughtbubble = false;
    // foreground
    partyGoers.push(new PartyGoer(width*0.5 + displace, height/2, 4, false));
    partyGoers.push(new PartyGoer(width + displace, height/2, 4, false));
  } else if (phase == 2) {
    partyGoers.push(new PartyGoer(width*1.3 + displace, height/2, 3, true));
    partyGoers.push(new PartyGoer(width*0.95 + displace, height/2, 3, true));
    // foreground
    partyGoers.push(new PartyGoer(width*0.5 + displace, height/2, 4, true));
    partyGoers.push(new PartyGoer(width + displace, height/2, 4, true));
    displaythoughtbubble = true;
  } else if (phase == 3) {
    tempDisplace = displace;
    phase = -1;
  }
}

function displayUI() {
  fill(100, 255, 100);
  if (stopped) {
    textAlign(CENTER, CENTER);
    textSize(width/20);
    text("PRESS 'SPACE' TO START", width/2, height/2);
  } else {
     textAlign(LEFT, CENTER);
     textSize(width/100);
     if (inputMic) {
       text("Mic", width * 0.025, height * 0.95);
     } else {
       text("Music", width * 0.025, height * 0.95);
     }
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
        if (!inputMic) {
          sound.loop();
        }
        stopped = false;
    } else {
        noLoop();
        if (!inputMic) {
          sound.stop();
        }
        stopped = true;
        camX = 0;
    }
  }
}

// function mousePressed() {
//   if (!stopped) {
//     if (inputMic) {
//       fft.setInput(sound);
//       inputMic = false;
//       sound.loop();
//     } else {
//       fft.setInput(mic);
//       inputMic = true;
//       sound.stop();
//     }
//   }
// }

class PartyGoer
{
  constructor(x, y, size, asleep) {
    this.startX = x;
    this.startY = y;
    this.x = this.startX;
    this.y = this.startY;
    this.size = size;
    // this.scale = scale;
    this.onscreen = true;
    this.sfIndex = 0;
    this.asleep = asleep;
  }
  
  display() {
    let img;
    if (!this.asleep) {
      img = sf[this.sfIndex];
    } else {
      img = sfAsleep;
    }
    this.w = img.width/(5-this.size);
    this.h = img.height/(5-this.size);
    image(img, this.x, this.y, img.width/(5-this.size), 
          img.height/(5-this.size));
  }

  anim() {
    this.sfIndex++;
    if (this.sfIndex >= sf.length) {
      this.sfIndex = 0;
    }
  }
}