import { Box, Text, useInput, measureElement, useFocusManager } from "ink";
import { useRef, useState, useEffect } from "react";
import figures from "figures";

const ScrollBox = ({
  children,
  focusIndex,
  setFocusIndex,
}: {
  focusIndex: number;
  setFocusIndex: (index: number) => void;
  children: JSX.Element[];
}) => {
  const { focus, disableFocus, enableFocus } = useFocusManager();

  const [dimensions, setDimensions] =
    useState<ReturnType<typeof measureElement>>();

  const [scrollOffset, setScrollOffset] = useState(0);
  const moveScrollWheel = (direction: "up" | "down") => {
    if (!dimensions?.height) return;
    const step = (dimensions.height - 2) / children.length;
    setScrollOffset(scrollOffset + (direction === "down" ? step : -step));
  };

  const [positiveOverflow, setPositiveOverflow] = useState<JSX.Element[]>([]);
  const [negativeOverflow, setNegativeOverflow] = useState<JSX.Element[]>([]);
  const [itemsToShow, setItemsToShow] = useState<JSX.Element[]>([]);

  const ref = useRef();
  useEffect(() => {
    const dimensions = measureElement(ref.current);
    setItemsToShow(children.slice(0, dimensions.height - 2));
    setPositiveOverflow(children.slice(dimensions.height - 2));
    setDimensions(dimensions);
    disableFocus();
    return enableFocus;
  }, []);

  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  useEffect(() => {
    if (focusIndex === undefined) {
      return scrollDirection === "down"
        ? focus("0")
        : focus(`${children.length - 1}`);
    }
    focus(`${focusIndex + (scrollDirection === "down" ? 1 : -1)}`);
  }, [itemsToShow]);

  useInput(
    (input) => {
      if (input === "j") {
        scrollDirection !== "down" && setScrollDirection("down");
        if (focusIndex < itemsToShow.length - 1) {
          moveScrollWheel("down");
          return focus(`${focusIndex + 1}`);
        }
        if (focusIndex >= children.length - 1) {
          setItemsToShow(children.slice(0, dimensions.height - 2));
          setPositiveOverflow(children.slice(dimensions.height - 2));
          setNegativeOverflow([]);
          setScrollOffset(0);

          return setFocusIndex(undefined);
        }
        if (positiveOverflow.length) {
          const newNegativeOverflow = negativeOverflow.slice();
          const newPositiveOverflow = positiveOverflow.slice();
          const newItems = itemsToShow.slice();

          newNegativeOverflow.push(newItems.shift());
          newItems.push(newPositiveOverflow.shift());

          setNegativeOverflow(newNegativeOverflow);
          setPositiveOverflow(newPositiveOverflow);
          setItemsToShow(newItems);
          return moveScrollWheel("down");
        }
      }
      if (input === "k") {
        scrollDirection !== "up" && setScrollDirection("up");
        const newNegativeOverflow = negativeOverflow.slice();
        const newPositiveOverflow = positiveOverflow.slice();
        const newItems = itemsToShow.slice();
        if (focusIndex <= 0) {
          while (newPositiveOverflow.length) {
            newNegativeOverflow.push(newItems.shift());
            newItems.push(newPositiveOverflow.shift());
          }
          setNegativeOverflow(newNegativeOverflow);
          setPositiveOverflow(newPositiveOverflow);
          setItemsToShow(newItems);
          dimensions?.height && setScrollOffset(dimensions.height - 3);
          return setFocusIndex(undefined);
        }
        if (negativeOverflow.length) {
          newPositiveOverflow.unshift(newItems.pop());
          newItems.unshift(newNegativeOverflow.pop());
          setNegativeOverflow(newNegativeOverflow);
          setPositiveOverflow(newPositiveOverflow);
          setItemsToShow(newItems);
        }
        moveScrollWheel("up");
        return focus(`${focusIndex - 1}`);
      }
    },
    { isActive: !!dimensions },
  );

  const repeats = ~~Math.abs(scrollOffset) || 0;
  const scrollBar =
    (figures.lineVerticalBold + "\n").repeat(repeats) +
    figures.square +
    "\n" +
    (dimensions?.height
      ? (figures.lineVerticalBold + "\n").repeat(
          dimensions?.height - 3 - repeats,
        )
      : "");

  return (
    <Box height="100%">
      <Box flexDirection="column" marginTop={1}>
        <Text color="blueBright">{scrollBar}</Text>
      </Box>
      <Box ref={ref} flexDirection="column" borderStyle="round" paddingX={1}>
        {itemsToShow}
      </Box>
    </Box>
  );
};

export default ScrollBox;
