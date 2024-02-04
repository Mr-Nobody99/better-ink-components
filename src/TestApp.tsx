import useDimensions from "./hooks/useDimensions.js";
import ScrollableList from "./ScrollableList.js";
import { Box, render } from "ink";
import { clear } from "console";

const TestApp = () => {
  const [width, height] = useDimensions();
  return (
    <Box
      width={width}
      height={height - 1}
      borderStyle="single"
      borderColor="green"
    >
      <ScrollableList
        items={new Array(100).fill("element").map((x, i) => x + i)}
      />
    </Box>
  );
};

clear();
render(<TestApp />);
