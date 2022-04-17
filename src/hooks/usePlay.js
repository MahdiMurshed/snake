import { useEffect } from "react";
import { CellType, Direction } from "../constants";
import { useGameContext } from "../context/game";
import { useInterval } from "./interval";
import { useSnake } from "./snake";

export const usePlay = () => {
  const { setDirection } = useGameContext();
  const { runSingleStep, addNewObject, removeObject } = useSnake();

  useInterval(runSingleStep, 200);
  useInterval(() => addNewObject(CellType.Food), 3000);
  useInterval(() => addNewObject(CellType.Poison), 5000);
  useInterval(() => removeObject(), 100);

  useEffect(() => {
    const handleDirection = (direction, oppositeDirection) => {
      setDirection((currentDirection) => {
        if (currentDirection === oppositeDirection) {
          return currentDirection;
        } else return direction;
      });
    };

    const handleNavigation = (event) => {
      switch (event.key) {
        case "ArrowUp":
          handleDirection(Direction.Top, Direction.Bottom);
          break;

        case "ArrowDown":
          handleDirection(Direction.Bottom, Direction.Top);
          break;

        case "ArrowLeft":
          handleDirection(Direction.Left, Direction.Right);
          break;

        case "ArrowRight":
          handleDirection(Direction.Right, Direction.Left);
          break;
      }
    };
    window.addEventListener("keydown", handleNavigation);

    return () => window.removeEventListener("keydown", handleNavigation);
  }, [setDirection]);
};
