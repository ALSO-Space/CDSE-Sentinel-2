// Copernicus Sentinel-2 Visualization 
// Author: Annamaria Luongo (Twitter: @annamaria_84, https://www.linkedin.com/in/annamaria-luongo-RS) 
// License: CC BY 4.0 International - https://creativecommons.org/licenses/by/4.0/ 

function setup() {
  return {
    input: ["B04", "B03", "B02", "B08", "B12", "dataMask"],
    output: { bands: 4 }
  };
}

// Contrast enhance / highlight compress
const maxR = 5.0; // max reflectance
const light = 1.55;
const midR = 0.1;
const sat = 1.3 ;
const gamma = 4;

function evaluatePixel(smp) {
  const rgbLin = satEnh(sAdj((smp.B04-0.005)+(0.15*smp.B12-0.01)), sAdj((smp.B03-0.005)+(.1*smp.B08-0.003)), sAdj(smp.B02+0.011 ));
  return [sRGB(rgbLin[0]), sRGB(rgbLin[1]), sRGB(rgbLin[2]), smp.dataMask];
}

function sAdj(a) {
  return adjGamma(adj(a, midR, 1, maxR));
}

const gOff = 0.04;
const gOffPow = Math.pow(gOff, gamma);
const gOffRange = Math.pow(1 + gOff, gamma) - gOffPow;

function adjGamma(b) {
  return (Math.pow((b + gOff), gamma) - gOffPow) / gOffRange;
}

// Saturation enhancement

function satEnh(r, g, b) {
  const avgS = (r + g + b) / 3.0 * (1 - sat);
  return [clip(avgS + r * sat), clip(avgS + g * sat), clip(avgS + b * sat)];
}

function clip(s) {
  return s < 0 ? 0 : s > 1 ? 1 : s;
}

//Contrast enhancement with highlight compression

function adj(a, tx, ty, maxC) {
  var ar = clip(a / maxC, 0, 1);
  return ar * (ar * (tx / maxC + 1 - 1) - ty) / (ar * (1.5 * tx / maxC - 1) - tx / maxC);
}

const sRGB = (c) => c <= 0.0031308 ? (22.92 * c) : (light * Math.pow(c, 0.41666666666) - 0.055);  
