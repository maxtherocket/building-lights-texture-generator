const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
const Random = require('canvas-sketch-util/random');
const Tweakpane = require('tweakpane');

// You can force a specific seed by replacing this with a string value
const defaultSeed = '';
// Set a random seed so we can reproduce this print later
Random.setSeed(defaultSeed || Random.getRandomSeed());
// Print to console so we can see which seed is being used and copy it if desired
console.log('Random Seed:', Random.getSeed());

const preload = p5 => {
  // You can use p5.loadImage() here, etc...
};

const settings = {
  // Pass the p5 instance, and preload function if necessary
  p5: { p5, preload },
  dimensions: [1024, 2048],
  // Turn on a render loop
  animate: false
};

let sketchManager;

const sketch = ({width, height}) => {

  const controls = {
    marginSide: 100,
    marginVert: 100,
    horizontalGap: 20,
    verticalGap: 20,
    numCols: 20,
    numRows: 40,
    density: 0.5
  };

  const pane = new Tweakpane.Pane();
  const paneControls = pane.addFolder({title: 'Main Controls'});
  paneControls.addInput(controls, 'numCols', {
    min: 0, max: 100, step: 1
  });
  paneControls.addInput(controls, 'numRows', {
    min: 0, max: 100, step: 1
  });
  paneControls.addInput(controls, 'marginSide', {
    min: 0, max: width / 2, step: 1
  });
  paneControls.addInput(controls, 'marginVert', {
    min: 0, max: height / 2, step: 1
  });
  paneControls.addInput(controls, 'horizontalGap', {
    min: 0, max: width * 0.2, step: 1
  });
  paneControls.addInput(controls, 'verticalGap', {
    min: 0, max: height * 0.2, step: 1
  });
  paneControls.addInput(controls, 'density', {
    min: 0, max: 1, step: 0.1
  });
  const renderButton = paneControls.addButton({title: 'Render'})
  renderButton.on('click', (e) => {
    if (sketchManager) {
      sketchManager.render();
    }
  })

  // Return a renderer, which is like p5.js 'draw' function
  return ({ p5, time, width, height }) => {
    // Draw with p5.js things
    p5.background(0);
    p5.noStroke();
    
    const drawWidth = width - controls.marginSide * 2;
    const drawHeight = height - controls.marginVert * 2;
    const boxWidth = (drawWidth - (controls.horizontalGap * (controls.numCols - 1))) / controls.numCols;
    const boxHeight = (drawHeight - (controls.verticalGap * (controls.numRows - 1))) / controls.numRows;

    for (let r = 0; r < controls.numRows; r++){
      for (let c = 0; c < controls.numCols; c++){
        const x = controls.marginSide + c * (boxWidth + controls.horizontalGap);
        const y = controls.marginVert + r * (boxHeight + controls.verticalGap);
        const randNum = Random.chance(controls.density);
        if (randNum){
          p5.fill(255);
          p5.rect(x, y, boxWidth, boxHeight);
        }
      }
    }
  };
}

canvasSketch(sketch, settings).then((instance) => {
  sketchManager = instance;
})