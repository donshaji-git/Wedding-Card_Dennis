const fs = require('fs');
const path = require('path');

const sampleRate = 44100;
const duration = 24; // 24-second seamless loop
const totalSamples = sampleRate * duration;
const numChannels = 2;
const bytesPerSample = 2;
const blockAlign = numChannels * bytesPerSample;
const byteRate = sampleRate * blockAlign;
const dataSize = totalSamples * blockAlign;
const buffer = Buffer.alloc(44 + dataSize);

// RIFF header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20); // PCM format
buffer.writeUInt16LE(numChannels, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(byteRate, 28);
buffer.writeUInt16LE(blockAlign, 32);
buffer.writeUInt16LE(16, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

// Canon in D progression: D -> A -> Bm -> F#m -> G -> D -> G -> A (3 seconds each)
const chordFrequencies = [
  [146.83, 220.00, 293.66, 369.99, 440.00], // D major
  [110.00, 164.81, 220.00, 277.18, 329.63], // A major
  [123.47, 185.00, 246.94, 293.66, 369.99], // B minor
  [92.50,  146.83, 185.00, 220.00, 277.18], // F# minor
  [98.00,  146.83, 196.00, 246.94, 293.66], // G major
  [146.83, 220.00, 293.66, 369.99, 440.00], // D major
  [98.00,  146.83, 196.00, 246.94, 293.66], // G major
  [110.00, 164.81, 220.00, 277.18, 440.00]  // A major
];

// Romantic lead melody
const notes = [
  { t: 0.0, f: 587.33, dur: 1.4 }, { t: 1.0, f: 554.37, dur: 0.9 }, { t: 2.0, f: 493.88, dur: 0.9 },
  { t: 3.0, f: 440.00, dur: 1.4 }, { t: 4.0, f: 392.00, dur: 0.9 }, { t: 5.0, f: 369.99, dur: 0.9 },
  { t: 6.0, f: 493.88, dur: 1.4 }, { t: 7.0, f: 554.37, dur: 0.9 }, { t: 8.0, f: 587.33, dur: 0.9 },
  { t: 9.0, f: 440.00, dur: 1.4 }, { t: 10.0, f: 369.99, dur: 0.9 }, { t: 11.0, f: 293.66, dur: 0.9 },
  { t: 12.0, f: 392.00, dur: 1.4 }, { t: 13.0, f: 440.00, dur: 0.9 }, { t: 14.0, f: 493.88, dur: 0.9 },
  { t: 15.0, f: 587.33, dur: 1.4 }, { t: 16.0, f: 554.37, dur: 0.9 }, { t: 17.0, f: 493.88, dur: 0.9 },
  { t: 18.0, f: 392.00, dur: 1.4 }, { t: 19.0, f: 440.00, dur: 0.9 }, { t: 20.0, f: 493.88, dur: 0.9 },
  { t: 21.0, f: 440.00, dur: 1.4 }, { t: 22.0, f: 493.88, dur: 0.9 }, { t: 23.0, f: 554.37, dur: 0.9 }
];

for (let i = 0; i < totalSamples; i++) {
  const t = i / sampleRate;
  const chordIdx = Math.min(Math.floor(t / 3), 7);
  const chord = chordFrequencies[chordIdx];
  const chordTime = t % 3;

  let left = 0;
  let right = 0;

  // Gentle acoustic piano/harp arpeggio
  for (let c = 0; c < chord.length; c++) {
    const noteStart = c * 0.45;
    if (chordTime >= noteStart) {
      const dt = chordTime - noteStart;
      const env = Math.exp(-dt * 2.1);
      const freq = chord[c];
      const tone = Math.sin(2 * Math.PI * freq * dt) * 0.4 +
                   Math.sin(2 * Math.PI * freq * 2 * dt) * 0.2 +
                   Math.sin(2 * Math.PI * freq * 3 * dt) * 0.08;
      const pan = (c / (chord.length - 1)) * 0.6 + 0.2;
      left += tone * env * (1 - pan) * 0.28;
      right += tone * env * pan * 0.28;
    }
  }

  // Soft romantic flute/music box melody
  for (const n of notes) {
    if (t >= n.t && t < n.t + n.dur + 0.8) {
      const dt = t - n.t;
      const env = Math.exp(-dt * 1.6) * Math.min(dt * 30, 1.0);
      const tone = Math.sin(2 * Math.PI * n.f * dt) * 0.45 +
                   Math.sin(2 * Math.PI * n.f * 2 * dt) * 0.2 +
                   Math.sin(2 * Math.PI * n.f * 3 * dt) * 0.08;
      left += tone * env * 0.22;
      right += tone * env * 0.22;
    }
  }

  // Seamless crossfade loop
  let loopFade = 1.0;
  if (t < 0.8) loopFade = t / 0.8;
  else if (t > 23.2) loopFade = (24.0 - t) / 0.8;

  left = Math.max(-1, Math.min(1, left * loopFade * 0.85));
  right = Math.max(-1, Math.min(1, right * loopFade * 0.85));

  const offset = 44 + i * 4;
  buffer.writeInt16LE(Math.floor(left * 32767), offset);
  buffer.writeInt16LE(Math.floor(right * 32767), offset + 2);
}

fs.writeFileSync(path.join(__dirname, 'assets', 'audio', 'wedding-bgm.wav'), buffer);
console.log('Romantic wedding audio generated! Size:', buffer.length, 'bytes');
