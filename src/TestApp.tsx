import useDimensions from "./hooks/useDimensions.js";
import FocusableText from "./FocusableText.js";
import ScrollBox from "./ScrollBox.js";
import { Box, render } from "ink";
import { useState } from "react";
import { clear } from "console";

const TestApp = () => {
  const [focusIndex, setFocusIndex] = useState<number>();
  const [width, height] = useDimensions();
  return (
    <Box
      width={width}
      height={height / 2}
      borderStyle="single"
      borderColor="green"
    >
      <ScrollBox focusIndex={focusIndex} setFocusIndex={setFocusIndex}>
        {new Array(100).fill("element").map((str, i) => (
          <FocusableText id={i} key={i} onFocused={setFocusIndex}>
            {str + i}
          </FocusableText>
        ))}
      </ScrollBox>
    </Box>
  );
};

clear();
render(<TestApp />);
