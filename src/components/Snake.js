import { Config } from "../constants";

import styles from "../../styles/Snake.module.css";
import { useCells } from "../hooks/snake";
export const Snake = () => {
  const cells = useCells();

  return (
    <div
      className={styles.grid}
      style={{
        height: Config.height * Config.cellSize,
        width: Config.width * Config.cellSize,
      }}
    >
      {cells}
    </div>
  );
};
