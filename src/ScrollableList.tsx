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
import figureSet from "figures";

type Dimensions = ReturnType<typeof measureElement>;

type Props<T> = {
  children: T[];
  contentStyles?: Omit<BoxProps, "flexDirection">;
  onChange?: (activeItem: T) => void;
  scrollBarStyles?: ScrollBarStyles;
  showScrollBar?: boolean;
  downInput?: string;
  upInput?: string;
} & BoxProps;

const BORDER_HEIGHT = 2;

const ScrollableList = <T extends string | JSX.Element>({
  children,
  onChange,
  contentStyles,
  scrollBarStyles,
  showScrollBar = true,
  downInput = "j",
  upInput = "k",
  ...props
}: Props<T>) => {
  const [overflowBottom, setOverflowBottom] = useState<T[]>([]);
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [overflowTop, setOverflowTop] = useState<T[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [focusIndex, setFocusIndex] = useState(0);

  const [dimensions, setDimensions] = useState<Dimensions>({
    height: 0,
    width: 0,
  });

  const scrollStep = Math.abs(dimensions.height - 2) / children.length;

  const scrollDown = () => {
    if (focusIndex < visibleItems.length - 1) {
      setScrollPosition(scrollPosition + scrollStep);
      setFocusIndex(focusIndex + 1);
      return onChange?.(visibleItems[focusIndex + 1]);
    }
    if (overflowBottom.length) {
      const _overflowBottom = overflowBottom.slice();
      const _visibleItems = visibleItems.slice();
      const _overflowTop = overflowTop.slice();

      _visibleItems.push(_overflowBottom.shift());
      _overflowTop.push(_visibleItems.shift());

      setOverflowBottom(_overflowBottom);
      setVisibleItems(_visibleItems);
      setOverflowTop(_overflowTop);

      setScrollPosition(scrollPosition + scrollStep);

      return onChange?.(_visibleItems[focusIndex]);
    }
    // wrap around to top
    setVisibleItems(children.slice(0, dimensions.height - BORDER_HEIGHT));
    setOverflowBottom(children.slice(dimensions.height - BORDER_HEIGHT));
    setOverflowTop([]);

    setScrollPosition(0);
    setFocusIndex(0);

    onChange?.(children[0]);
  };

  const scrollUp = () => {
    if (focusIndex > 0) {
      setFocusIndex(focusIndex - 1);
      setScrollPosition(scrollPosition - scrollStep);
      return onChange?.(visibleItems[focusIndex - 1]);
    }

    const _overflowBottom = overflowBottom.slice();
    const _visibleItems = visibleItems.slice();
    const _overflowTop = overflowTop.slice();

    if (overflowTop.length) {
      _overflowBottom.unshift(_visibleItems.pop());
      _visibleItems.unshift(_overflowTop.pop());

      setScrollPosition(scrollPosition - scrollStep);
      setOverflowBottom(_overflowBottom);
      setVisibleItems(_visibleItems);
      setOverflowTop(_overflowTop);

      return onChange?.(_visibleItems[focusIndex]);
    }

    // wrap around to bottom
    while (_overflowBottom.length) {
      _overflowTop.push(_visibleItems.shift());
      _visibleItems.push(_overflowBottom.shift());
    }
    setScrollPosition(dimensions.height - 3);
    setFocusIndex(_visibleItems.length - 1);
    setOverflowBottom(_overflowBottom);
    setVisibleItems(_visibleItems);
    setOverflowTop(_overflowTop);

    onChange?.(_visibleItems[_visibleItems.length - 1]);
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
    const _visibleItems = children.slice(0, _dimensions.height - BORDER_HEIGHT);
    const _overflowBottom = children.slice(_dimensions.height - BORDER_HEIGHT);

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

  const isStringList = children.every((item) => typeof item === "string");

  return (
    <Box {...wrapperStyle}>
      {showScrollBar && (
        <VerticalScrollBar
          height={dimensions.height}
          scrollPosition={scrollPosition}
        />
      )}
      <Box ref={ref} {...contentStyle}>
        {visibleItems.map((item, i) =>
          isStringList ? (
            <Text key={i} color={i === focusIndex ? "blueBright" : undefined}>
              {item}
            </Text>
          ) : (
            <Box key={i} alignItems="center">
              <Text color={i === focusIndex ? "blueBright" : undefined}>
                {figureSet.pointer + " "}
              </Text>
              {item}
            </Box>
          ),
        )}
      </Box>
    </Box>
  );
};
export default ScrollableList;
