import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import Grid from "./Grid.js";
import "./index.css";
import Instructions from "./Instructions.js";

const Main = () => {
  let rows = 30;
  let cols = 50;

  const [speed, setSpeed] = useState(100);
  const [go, setGo] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [gridFull, setGridFull] = useState(
    Array(rows)
      .fill()
      .map(() => Array(cols).fill(false))
  );

  const selectCell = (row, col) => {
    let gridCopy = arrayClone(gridFull);
    gridCopy[row][col] = !gridCopy[row][col];
    setGridFull(gridCopy);
  };

  // ********************************************************************************
  // Seed board on first load
  // eslint-disable-next-line
  useEffect(() => germinate(), []);

  const arrayClone = (array) => {
    return JSON.parse(JSON.stringify(array));
  };

  // germinate/ seed board function

  const germinate = () => {
    let gridCopy = arrayClone(
      Array(rows)
        .fill()
        .map(() => Array(cols).fill(false))
    );
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (Math.floor(Math.random() * 4) === 1) {
          gridCopy[i][j] = true;
        }
      }
    }
    setGridFull(gridCopy);
  };

  // Wipe board function

  const wipeBoard = () => {
    let gridCopy = arrayClone(
      Array(rows)
        .fill()
        .map(() => Array(cols).fill(false))
    );
    setGridFull(gridCopy);
  };

  // Cycle function

  const cycle = () => {
    let gridCopy = arrayClone(gridFull);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        // this was the line which I initially had assigned to = instead of ===, it yielded some interesting results
        if (gridCopy[i][j] === true) {
          if (neighbours(i, j) < 2 || neighbours(i, j) > 3) {
            gridCopy[i][j] = false;
          }
        } else if (neighbours(i, j) === 3) {
          gridCopy[i][j] = true;
        }
      }
    }
    setGridFull(gridCopy);
    setGeneration(generation + 1);
  };

  // CALC NEIGHBOURS  *******************
  const neighbours = (i, j) => {
    let neighbourCount = 0;
    if (i > 0 && j > 0) {
      if (gridFull[i - 1][j - 1]) {
        neighbourCount++;
      }
    }
    if (i > 0) {
      if (gridFull[i - 1][j]) {
        neighbourCount++;
      }
    }
    if (i > 0 && j < cols - 1) {
      if (gridFull[i - 1][j + 1]) {
        neighbourCount++;
      }
    }

    if (j > 0) {
      if (gridFull[i][j - 1]) {
        neighbourCount++;
      }
    }
    if (j < cols - 1) {
      if (gridFull[i][j + 1]) {
        neighbourCount++;
      }
    }
    if (i < rows - 1 && j > 0) {
      if (gridFull[i + 1][j - 1]) {
        neighbourCount++;
      }
    }
    if (i < rows - 1) {
      if (gridFull[i + 1][j]) {
        neighbourCount++;
      }
    }
    if (i < rows - 1 && j < cols - 1) {
      if (gridFull[i + 1][j + 1]) {
        neighbourCount++;
      }
    }

    return neighbourCount;
  };

  // *********************************************************************************

  // INTERVAL EFFECT REQUIRING useRef()

  const savedCallBack = useRef();

  useEffect(() => {
    if (go) {
      savedCallBack.current = cycle;
    } else {
      savedCallBack.current = () => {
        return;
      };
    }
  });

  useEffect(() => {
    const tick = () => {
      savedCallBack.current();
    };

    let cycleInterval = setInterval(tick, speed);
    return () => clearInterval(cycleInterval);
  }, [speed]);

  // BUTTON FUNCTIONS

  const stop = () => {
    setGo(false);
  };

  const start = () => {
    setGo(true);
  };

  const clear = () => {
    setGo(false);
    setGeneration(0);
    wipeBoard();
    setSpeed(100);
  };

  const paceFast = () => {
    setSpeed(50);
  };

  const paceMedium = () => {
    setSpeed(100);
  };

  const paceSlow = () => {
    setSpeed(200);
  };

  const seed = () => {
    germinate();
  };

  return (
    <div>
      <h1>Game of Life</h1>

      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={clear}>Clear</button>
      <button onClick={seed}>Seed</button>
      <button onClick={cycle}>Cycle</button>
      <button onClick={paceSlow}>Slow</button>
      <button onClick={paceMedium}>Medium</button>
      <button onClick={paceFast}>Fast</button>

      <Grid
        gridFull={gridFull}
        rows={rows}
        cols={cols}
        selectCell={selectCell}
      />
      <h2>Generations: {generation}</h2>
      <Instructions />
    </div>
  );
};

ReactDOM.render(<Main />, document.getElementById("root"));
