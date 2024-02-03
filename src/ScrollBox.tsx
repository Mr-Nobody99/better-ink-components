import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  type PropsWithChildren,
} from "react";

import {
  Box,
  Text,
  render,
  measureElement,
  useInput,
  useFocus,
  useStdout,
  useFocusManager,
} from "ink";
import { clear } from "console";

import useDimensions from "./hooks/useDimensions.js";
import figures from "figures";

const FocusableText = ({
  id,
  children,
  setFocusIndex,
}: PropsWithChildren<{
  id: number;
  setFocusIndex?: (index: number) => void;
}>) => {
  const { isFocused } = useFocus({ id: id + "" });
  useEffect(() => {
    isFocused && setFocusIndex(id);
  }, [isFocused]);
  return <Text color={isFocused ? "blue" : "white"}>{children}</Text>;
};

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

  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const [scrollCount, setScrollCount] = useState(0);

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
  }, []);

  useEffect(() => {
    if (focusIndex === undefined) {
      return scrollDirection === "down"
        ? focus("0")
        : focus(`${children.length - 1}`);
    }
    focus(`${focusIndex + (scrollDirection === "down" ? 1 : -1)}`);
  }, [itemsToShow]);

  useInput(
    (input, key) => {
      if (input === "j") {
        scrollDirection !== "down" && setScrollDirection("down");
        if (focusIndex < itemsToShow.length - 1) {
          return focus(`${focusIndex + 1}`);
        }
        if (focusIndex >= children.length - 1) {
          setItemsToShow(children.slice(0, dimensions.height - 2));
          setPositiveOverflow(children.slice(dimensions.height - 2));
          setNegativeOverflow([]);
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
        }
        return;
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
          return setFocusIndex(undefined);
        }
        if (negativeOverflow.length) {
          newPositiveOverflow.unshift(newItems.pop());
          newItems.unshift(newNegativeOverflow.pop());
          setNegativeOverflow(newNegativeOverflow);
          setPositiveOverflow(newPositiveOverflow);
          setItemsToShow(newItems);
          return;
        }
        return focus(`${focusIndex - 1}`);
      }
    },
    { isActive: !!dimensions },
  );

  return (
    <Box height="100%" borderStyle="single">
      <Box flexDirection="column" borderStyle="single">
        <Text>
          {"\n".repeat(!scrollCount ? scrollCount : scrollCount - 1) +
            figures.square}
        </Text>
      </Box>
      <Box ref={ref} flexDirection="column" borderStyle="single">
        {itemsToShow}
      </Box>
    </Box>
  );
};

const App = () => {
  const [width, height] = useDimensions();
  const [focusIndex, setFocusIndex] = useState<number>();
  return (
    <Box
      width={width}
      height={height - 10}
      borderStyle="single"
      borderColor="green"
    >
      <ScrollBox focusIndex={focusIndex} setFocusIndex={setFocusIndex}>
        {new Array(50).fill("element").map((str, i) => (
          <FocusableText id={i} key={i} setFocusIndex={setFocusIndex}>
            {str + i}
          </FocusableText>
        ))}
      </ScrollBox>
    </Box>
  );
};

clear();
render(<App />);
