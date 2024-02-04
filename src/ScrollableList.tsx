import { useEffect, useRef, useState } from "react";

import {
  type BoxProps,
  measureElement,
  useFocus,
  useInput,
  Text,
  Box,
} from "ink";

import VerticalScrollBar, {
  type ScrollBarStyles,
} from "./VerticalScrollBar.js";

type Dimensions = ReturnType<typeof measureElement>;

type Props = {
  items: string[];
  upInput?: string;
  downInput?: string;
  scrollBarStyles?: ScrollBarStyles;
  contentStyles?: Omit<BoxProps, "flexDirection">;
} & BoxProps;

const BORDER_HEIGHT = 2;

const ScrollableList = ({
  items,
  contentStyles,
  scrollBarStyles,
  downInput = "j",
  upInput = "k",
  ...props
}: Props) => {
  const [overflowBottom, setOverflowBottom] = useState<string[]>([]);
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  const [overflowTop, setOverflowTop] = useState<string[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [focusIndex, setFocusIndex] = useState(0);

  const [dimensions, setDimensions] = useState<Dimensions>({
    height: 0,
    width: 0,
  });

  const scrollStep = Math.abs(dimensions.height - 2) / items.length;

  const scrollDown = () => {
    // move focus down
    if (focusIndex < visibleItems.length - 1) {
      setFocusIndex(focusIndex + 1);
      return setScrollPosition(scrollPosition + scrollStep);
    }
    // scroll down
    if (overflowBottom.length) {
      const _overflowBottom = overflowBottom.slice();
      const _visibleItems = visibleItems.slice();
      const _overflowTop = overflowTop.slice();

      _visibleItems.push(_overflowBottom.shift());
      _overflowTop.push(_visibleItems.shift());

      setOverflowBottom(_overflowBottom);
      setVisibleItems(_visibleItems);
      setOverflowTop(_overflowTop);

      return setScrollPosition(scrollPosition + scrollStep);
    }
    // wrap around to top
    setVisibleItems(items.slice(0, dimensions.height - BORDER_HEIGHT));
    setOverflowBottom(items.slice(dimensions.height - BORDER_HEIGHT));
    setOverflowTop([]);

    setFocusIndex(0);
    return setScrollPosition(0);
  };

  const scrollUp = () => {
    // move focus up
    if (focusIndex > 0) {
      setFocusIndex(focusIndex - 1);
      return setScrollPosition(scrollPosition - scrollStep);
    }

    const _overflowBottom = overflowBottom.slice();
    const _visibleItems = visibleItems.slice();
    const _overflowTop = overflowTop.slice();

    // scroll up
    if (overflowTop.length) {
      _overflowBottom.unshift(_visibleItems.pop());
      _visibleItems.unshift(_overflowTop.pop());

      setOverflowBottom(_overflowBottom);
      setVisibleItems(_visibleItems);
      setOverflowTop(_overflowTop);

      return setScrollPosition(scrollPosition - scrollStep);
    }

    // wrap around to bottom
    while (_overflowBottom.length) {
      _overflowTop.push(_visibleItems.shift());
      _visibleItems.push(_overflowBottom.shift());
    }
    setFocusIndex(visibleItems.length - 1);
    setScrollPosition(dimensions.height - 3);
    setOverflowBottom(_overflowBottom);
    setVisibleItems(_visibleItems);
    setOverflowTop(_overflowTop);
  };

  const { isFocused } = useFocus({ autoFocus: true });
  useInput(
    (input, _) => {
      if (input === downInput) {
        scrollDown();
      }
      if (input === upInput) {
        scrollUp();
      }
    },
    { isActive: isFocused },
  );

  const ref = useRef();
  useEffect(() => {
    const _dimensions = measureElement(ref.current);
    const _visibleItems = items.slice(0, _dimensions.height - BORDER_HEIGHT);
    const _overflowBottom = items.slice(_dimensions.height - BORDER_HEIGHT);

    setOverflowBottom(_overflowBottom);
    setVisibleItems(_visibleItems);
    setDimensions(_dimensions);
  }, []);

  const wrapperStyle: BoxProps = {
    borderStyle: "single",
    borderDimColor: true,
    ...props,
  };

  const contentStyle: BoxProps = {
    justifyContent: "center",
    flexDirection: "column",
    paddingX: 2,
    ...contentStyles,
  };

  return (
    <Box {...wrapperStyle}>
      <VerticalScrollBar
        height={dimensions.height - 3}
        scrollPosition={scrollPosition}
      />
      <Box ref={ref} {...contentStyle}>
        {visibleItems.map((item, i) => (
          <Text key={i} color={i === focusIndex ? "blueBright" : undefined}>
            {item}
          </Text>
        ))}
      </Box>
    </Box>
  );
};
export default ScrollableList;
