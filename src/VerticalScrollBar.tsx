import { Box, Text, type BoxProps, type TextProps } from "ink";
import figures from "figures";

export type ScrollBarStyles = {
  textStyle?: TextProps & { background: string; icon: string };
  boxStyle?: Omit<BoxProps, "flexDirection">;
};

type Props = {
  scrollPosition: number;
  height: number;
} & ScrollBarStyles;

const VerticalScrollBar = ({
  scrollPosition,
  textStyle,
  boxStyle,
  height,
}: Props) => {
  const position = ~~Math.abs(scrollPosition);
  const head = (figures.lineVerticalBold + "\n").repeat(position);
  const body = figures.square + "\n";
  const tail = (figures.lineVerticalBold + "\n").repeat(
    Math.abs(height - position),
  );
  return (
    <Box {...{ ...boxStyle, flexDirection: "column" }}>
      <Text {...{ color: "blueBright", ...textStyle }}>
        {head + body + tail}
      </Text>
    </Box>
  );
};

export default VerticalScrollBar;
