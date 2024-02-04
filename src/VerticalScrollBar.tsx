import { Box, Text, type BoxProps, type TextProps } from "ink";
import figureSet from "figures";

export type ScrollBarStyles = {
  icon?: string;
  background?: string;
  iconStyles?: TextProps;
  backgroundStyles?: TextProps;
  borderStyles?: Omit<BoxProps, "flexDirection">;
};

type Props = {
  height: number;
  scrollPosition: number;
  styles?: ScrollBarStyles;
};

const VerticalScrollBar = ({
  height,
  scrollPosition,
  styles: { icon, iconStyles, background, backgroundStyles, borderStyles } = {
    borderStyles: {
      borderRightDimColor: true,
      borderStyle: "single",
      borderBottom: false,
      borderLeft: false,
      borderTop: false,
      height: "100%",
      paddingTop: 1,
    },

    background: figureSet.lineVerticalBold,
    backgroundStyles: {
      dimColor: true,
    },

    icon: figureSet.square,
    iconStyles: {
      bold: true,
    },
  },
}: Props) => {
  const position = ~~Math.abs(scrollPosition);
  const tail = (background + "\n").repeat(Math.abs(height - position - 3));
  const head = (background + "\n").repeat(position);
  const bar = icon.trim() + "\n";
  return (
    <Box flexDirection="column" {...borderStyles}>
      <Text wrap="truncate">
        <Text {...backgroundStyles}>{head}</Text>
        <Text {...iconStyles}>{bar}</Text>
        <Text {...backgroundStyles}>{tail}</Text>
      </Text>
    </Box>
  );
};

export default VerticalScrollBar;
