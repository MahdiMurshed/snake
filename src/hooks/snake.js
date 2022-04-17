import { useCallback, useMemo } from "react";
import { getRandomCell } from "../helpers";
import { CellType, Config } from "../constants";
import { Cell } from "../components/Cell";
import { useGameContext } from "../context/game";

export const useSnake = () => {
  const { setObject, object, snake, setSnake, resetGame, direction } =
    useGameContext();

  //helper function for removing object
  const removeObject = useCallback(() => {
    setObject((o) => o.filter((f) => Date.now() - f.createdAt <= 10 * 1000));
  }, [setObject]);

  const isObject = useCallback(
    ({ x, y }) => object.find((obj) => obj.x === x && obj.y === y),
    [object]
  );
  const isCellContainsObjectOfType = useCallback(
    ({ x, y, type }) => {
      const _obj = isObject({ x, y });
      return _obj && _obj.type === type;
    },
    [isObject]
  );

  const isSnake = useCallback(
    ({ x, y }) =>
      snake.find((position) => position.x === x && position.y === y),
    [snake]
  );
  const isOccupied = useCallback(
    (cell) => isSnake(cell) || isObject(cell),
    [isObject, isSnake]
  );

  const addNewObject = useCallback(
    (type) => {
      let newobject = getRandomCell();
      while (isOccupied(newobject)) {
        newobject = getRandomCell();
      }
      setObject((o) => [
        ...o,
        {
          ...newobject,
          type,
        },
      ]);
    },
    [isOccupied, setObject]
  );

  // move the snake
  const runSingleStep = useCallback(() => {
    setSnake((snake) => {
      const head = snake[0];
      const newHead = {
        x: (head.x + direction.x + Config.width) % Config.width,
        y: (head.y + direction.y + Config.height) % Config.height,
      };

      // make a new snake by extending head
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
      const newSnake = [newHead, ...snake];

      // check if snake is eating food
      if (!isCellContainsObjectOfType({ ...newHead, type: CellType.Food })) {
        newSnake.pop();
      } else if (
        isCellContainsObjectOfType({ ...newHead, type: CellType.Food })
      ) {
        setObject((o) =>
          o.filter(
            (f) =>
              !(
                f.x === newHead.x &&
                f.y === newHead.y &&
                f.type === CellType.Food
              )
          )
        );
      }
      // check if snake is eating itself
      if (isSnake(newHead)) {
        resetGame();
      }
      if (isCellContainsObjectOfType({ ...newHead, type: CellType.Poison })) {
        setObject((o) =>
          o.filter(
            (f) =>
              !(
                f.x === newHead.x &&
                f.y === newHead.y &&
                f.type === CellType.Poison
              )
          )
        );

        if (snake.length > 3) {
          setSnake((snake) => snake.slice(0, snake.length - 1));
        }
      }

      return newSnake;
    });
  }, [
    direction.x,
    direction.y,
    isCellContainsObjectOfType,
    isSnake,
    resetGame,
    setObject,
    setSnake,
  ]);

  return {
    object,
    isCellContainsObjectOfType,
    removeObject,
    isSnake,
    isObject,
    isOccupied,
    runSingleStep,
    addNewObject,
  };
};

export const useCells = () => {
  const { isCellContainsObjectOfType, isSnake, object } = useSnake();

  const cells = useMemo(() => {
    const elements = [];
    for (let x = 0; x < Config.width; x++) {
      for (let y = 0; y < Config.height; y++) {
        let type = CellType.Empty,
          remaining = undefined;
        if (isCellContainsObjectOfType({ x, y, type: CellType.Food })) {
          type = CellType.Food;
          remaining =
            10 -
            Math.round(
              (Date.now() -
                object.find(
                  (food) =>
                    food.x === x && food.y === y && food.type === CellType.Food
                ).createdAt) /
                1000
            );
        } else if (isSnake({ x, y })) {
          type = CellType.Snake;
        } else if (
          isCellContainsObjectOfType({ x, y, type: CellType.Poison })
        ) {
          type = CellType.Poison;
        }
        elements.push(
          <Cell
            key={`${x}-${y}`}
            x={x}
            y={y}
            type={type}
            remaining={remaining}
          />
        );
      }
    }
    return elements;
  }, [isCellContainsObjectOfType, isSnake, object]);
  return cells;
};
