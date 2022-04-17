import React from "react";
import { GameState, useGameContext } from "../context/game";
import { usePlay } from "../hooks/usePlay";
import { Snake } from "./Snake";

const SnakeContainer = () => {
  const { state } = useGameContext();
  switch (state) {
    case GameState.Playing:
      return <Play />;

    default:
      return <Snake />;
  }
};

export default SnakeContainer;

const Play = () => {
  usePlay();
  return <Snake />;
};
