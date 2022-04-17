import React, { useCallback, useContext, useState } from "react";

import { getDefaultSnake } from "../helpers";
import { Direction } from "../constants";
export const GameContext = React.createContext({});

export const GameState = {
  Running: "running",
  Paused: "paused",
  Replaying: "replaying",
  Finished: "finished",
  Playing: "playing",
};

export const useGame = () => {
  const [state, setState] = useState(GameState.Finished);
  const [snake, setSnake] = useState(getDefaultSnake());
  const [direction, setDirection] = useState(Direction.Right);
  const [object, setObject] = useState([]);
  const score = snake.length - 3;

  // resets the snake, foods, direction to initial values
  const resetGame = useCallback(() => {
    setSnake(getDefaultSnake());
    setDirection(Direction.Right);
    setObject([]);
    setState(GameState.Finished);
  }, []);

  return {
    state,
    setState,
    snake,
    setSnake,
    direction,
    setDirection,
    object,
    setObject,
    score,
    resetGame,
  };
};

export const useGameContext = () => useContext(GameContext);
