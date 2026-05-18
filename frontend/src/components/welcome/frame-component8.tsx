import React from "react";
import { useState } from "react";
import NumberCard1 from "./number-card1";
import styles from "./frame-component8.module.css";

export type FrameComponent8Type = {
  className?: string;
};

const FrameComponent8: React.FC<FrameComponent8Type> = ({ className = "" }) => {
  const [numberCard1Items] = useState([
    {
      prop: "+ 350 тис  ",
      prop1: "гектарів оброблених полів         по всій Україні",
      numberCardWidth: "478px" as const,
      lineDivBorderRight: "2px solid #b3d217" as const,
      h2Color: "#b3d217" as const,
    },
    {
      prop: "100%",
      prop1: "покращення стану ґрунту після застосування ",
      numberCardWidth: "435px" as const,
      lineDivBorderRight: "2px solid #93928c" as const,
      h2Color: "#2c2c27" as const,
    },
    {
      prop: "+ 5000",
      prop1: "задоволених фермерів,         які обрали нашу продукцію",
      numberCardWidth: "447px" as const,
      lineDivBorderRight: "2px solid #93928c" as const,
      h2Color: "#2c2c27" as const,
    },
  ]);
  return (
    <div className={[styles.numberSectionWrapper, className].join(" ")}>
      <div className={styles.numberSection}>
        <div className={styles.numberCards}>
          {numberCard1Items.map((item, index) => (
            <NumberCard1
              key={index}
              prop={item.prop}
              prop1={item.prop1}
              numberCardWidth={item.numberCardWidth}
              lineDivBorderRight={item.lineDivBorderRight}
              h2Color={item.h2Color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FrameComponent8;
