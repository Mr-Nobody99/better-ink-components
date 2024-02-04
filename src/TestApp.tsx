import useDimensions from "./hooks/useDimensions.js";
import ScrollableList from "./ScrollableList.js";
import { Box, render } from "ink";
import { clear } from "console";

const TestApp = () => {
  const [width, height] = useDimensions();
  return (
    <Box borderStyle="single" height={height - 1} width={width}>
      <ScrollableList>
        {new Array(100).fill("element").map((x, i) => x + i)}
      </ScrollableList>
    </Box>
  );
};

clear();
render(<TestApp />);
