import React from "react";
import { GameContext, useGame } from "../context/game";
import Header from "./Header";
import SnakeContainer from "./SnakeContainer";
import styles from "../../styles/Snake.module.css";

const Game = () => {
  const game = useGame();
  return (
    <GameContext.Provider value={game}>
      <div className={styles.container}>
        <Header />
        <SnakeContainer />
      </div>
    </GameContext.Provider>
  );
};

export default Game;
