import React, { useMemo } from "react";
import { Config } from "../constants";
import { GameState, useGameContext } from "../context/game";
import styles from "../../styles/Snake.module.css";
const Header = () => {
  const { score, state, setState, resetGame } = useGameContext();
  const actions = useMemo(() => {
    switch (state) {
      case GameState.Finished:
        return [
          {
            name: "New",
            onClick: () => {
              resetGame();
              setState(GameState.Playing);
            },
          },
        ];
      case GameState.Playing:
        return [
          {
            name: "Pause",
            onClick: () => setState(GameState.Paused),
          },
        ];

      case GameState.Paused:
        return [
          {
            name: "Resume",
            onClick: () => setState(GameState.Playing),
          },
        ];

      default:
        return [];
    }
  }, [state, resetGame, setState]);

  return (
    <div
      className={styles.header}
      style={{ width: Config.width * Config.cellSize }}
    >
      <div>Score: {score}</div>
      <div>
        {actions.map(({ name, onClick }) => (
          <button key={name} onClick={onClick}>
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Header;
