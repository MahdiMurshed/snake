import dynamic from "next/dynamic";
import { useEffect, useState, useCallback, useRef } from "react";
import styles from "../styles/Snake.module.css";

const Config = {
  height: 25,
  width: 25,
  cellSize: 32,
};

const CellType = {
  Snake: "snake",
  Food: "food",
  Poison: "poison",
  Empty: "empty",
};

const Direction = {
  Left: { x: -1, y: 0 },
  Right: { x: 1, y: 0 },
  Top: { x: 0, y: -1 },
  Bottom: { x: 0, y: 1 },
};

const Cell = ({ x, y, type, remaining }) => {
  const getStyles = () => {
    switch (type) {
      case CellType.Snake:
        return {
          backgroundColor: "yellowgreen",
          borderRadius: 8,
          padding: 2,
        };

      case CellType.Food:
        return {
          backgroundColor: "tomato",
          borderRadius: 20,
          width: 32,
          height: 32,
          transform: `scale(${0.5 + remaining / 20})`,
        };
      case CellType.Poison:
        return {
          backgroundColor: "red",
          borderRadius: 20,
          width: 32,
          height: 32,
          transform: `scale(${0.5 + remaining / 20})`,
        };

      default:
        return {};
    }
  };
  return (
    <div
      className={styles.cellContainer}
      style={{
        left: x * Config.cellSize,
        top: y * Config.cellSize,
        width: Config.cellSize,
        height: Config.cellSize,
      }}
    >
      <div className={styles.cell} style={getStyles()}>
        {remaining}
      </div>
    </div>
  );
};

const getRandomCell = () => ({
  x: Math.floor(Math.random() * Config.width),
  y: Math.floor(Math.random() * Config.width),
  createdAt: Date.now(),
});

const useInterval = (callback, delay) => {
  const time = useRef(0);
  const wrappedCallback = useCallback(() => {
    if (Date.now() - time.current >= delay) {
      time.current = Date.now();
      callback();
    }
  }, [callback, delay]);
  useEffect(() => {
    const interval = setInterval(wrappedCallback, 1000 / 60);
    return () => clearInterval(interval);
  }, [wrappedCallback]);
};

const useSnake = () => {
  const getDefaultSnake = () => [
    { x: 8, y: 12 },
    { x: 7, y: 12 },
    { x: 6, y: 12 },
  ];

  // snake[0] is head and snake[snake.length - 1] is tail
  const [snake, setSnake] = useState(getDefaultSnake());
  const [direction, setDirection] = useState(Direction.Right);
  const [foods, setFoods] = useState([{ x: 4, y: 10 }]);
  const [poison, setPoison] = useState([]);
  const score = snake.length - 3;

  const resetGame = useCallback(() => {
    setSnake(getDefaultSnake());
    setDirection(Direction.Right);
    setFoods([{ x: 4, y: 10 }]);
  }, []);

  //helper function for removing food
  // const removeFood = useCallback(() => {
  //   setFoods((fs) => fs.filter((f) => Date.now() - f.createdAt <= 10 * 1000));
  // }, []);
  const removeObject = useCallback((type) => {
    if (type === CellType.Poison) {
      setPoison((poison) =>
        poison.filter((p) => Date.now() - p.createdAt <= 15 * 1000)
      );
    } else {
      setFoods((fs) => fs.filter((f) => Date.now() - f.createdAt <= 10 * 1000));
    }
  }, []);

  // ?. is called optional chaining
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
  const isFood = useCallback(
    ({ x, y }) => foods.some((food) => food.x === x && food.y === y),
    [foods]
  );
  const isPoison = useCallback(
    ({ x, y }) => poison.some((p) => p.x === x && p.y === y),
    [poison]
  );

  const isSnake = useCallback(
    ({ x, y }) =>
      snake.find((position) => position.x === x && position.y === y),
    [snake]
  );
  const isOccupied = useCallback(
    (cell) => isSnake(cell) || isFood(cell) || isPoison(cell),
    [isFood, isPoison, isSnake]
  );
  //helper function for adding new food
  // const addNewFood = useCallback(() => {
  //   let newFood = getRandomCell();
  //   while (isOccupied(newFood)) {
  //     newFood = getRandomCell();
  //   }

  //   setFoods((fs) => [...fs, newFood]);
  // }, [isOccupied]);

  //helper function for adding new food
  // const addNewPoison = useCallback(() => {
  //   let newPoison = getRandomCell();
  //   while (isOccupied(newPoison)) {
  //     newPoison = getRandomCell();
  //   }

  //   setPoison((fs) => [...fs, newPoison]);
  // }, [isOccupied]);
  const addNewObject = useCallback(
    (type) => {
      let newObject = getRandomCell();
      while (isOccupied(newObject)) {
        newObject = getRandomCell();
      }
      if (type === CellType.Food) {
        setFoods((fs) => [...fs, newObject]);
      } else {
        setPoison((fs) => [...fs, newObject]);
      }
    },
    [isOccupied]
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
      if (!isFood(newHead)) {
        newSnake.pop();
      } else if (isFood(newHead)) {
        setFoods((cf) =>
          cf.filter((f) => !(f.x === newHead.x && f.y === newHead.y))
        );
      }
      // check if snake is eating itself
      if (isSnake(newHead)) {
        resetGame();
      }
      if (isPoison(newHead)) {
        setPoison((cf) =>
          cf.filter((f) => !(f.x === newHead.x && f.y === newHead.y))
        );
        if (snake.length > 3) {
          setSnake((snake) => snake.slice(0, snake.length - 1));
        }
      }

      return newSnake;
    });
  }, [direction, resetGame, isSnake, isFood, isPoison]);

  useInterval(runSingleStep, 200);
  useInterval(() => addNewObject(CellType.Food), 3000);
  useInterval(() => addNewObject(CellType.Poison), 5000);
  useInterval(() => removeObject(CellType.Food), 100);
  useInterval(() => removeObject(CellType.Poison), 100);

  useEffect(() => {
    const handleKey = (direction, oppositeDirection) => {
      setDirection((currDir) => {
        if (currDir !== oppositeDirection) {
          return direction;
        }
        return currDir;
      });
    };
    const handleNavigation = (event) => {
      switch (event.key) {
        case "ArrowUp":
          handleKey(Direction.Top, Direction.Bottom);
          break;

        case "ArrowDown":
          handleKey(Direction.Bottom, Direction.Top);
          break;

        case "ArrowLeft":
          handleKey(Direction.Left, Direction.Right);
          break;

        case "ArrowRight":
          handleKey(Direction.Right, Direction.Left);
          break;
      }
    };
    window.addEventListener("keydown", handleNavigation);

    return () => window.removeEventListener("keydown", handleNavigation);
  }, []);
  const cells = [];
  for (let x = 0; x < Config.width; x++) {
    for (let y = 0; y < Config.height; y++) {
      let type = CellType.Empty,
        remaining = undefined;
      if (isFood({ x, y })) {
        type = CellType.Food;
        remaining =
          10 -
          Math.round(
            (Date.now() -
              foods.find((food) => food.x === x && food.y === y).createdAt) /
              1000
          );
      } else if (isSnake({ x, y })) {
        type = CellType.Snake;
      } else if (isPoison({ x, y })) {
        type = CellType.Poison;
      }
      cells.push(
        <Cell key={`${x}-${y}`} x={x} y={y} type={type} remaining={remaining} />
      );
    }
  }

  return { score, isFood, isSnake, cells };
};

const Snake = () => {
  const { score, cells } = useSnake();

  return (
    <div className={styles.container}>
      <div
        className={styles.header}
        style={{ width: Config.width * Config.cellSize }}
      >
        Score: {score}
      </div>
      <div
        className={styles.grid}
        style={{
          height: Config.height * Config.cellSize,
          width: Config.width * Config.cellSize,
        }}
      >
        {cells}
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Snake), {
  ssr: false,
});
