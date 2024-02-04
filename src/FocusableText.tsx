import { type TextProps, useFocus, Text } from "ink";
import { useEffect, type PropsWithChildren } from "react";

type Props = PropsWithChildren<
  TextProps & {
    onFocused: (index: number) => void;
    focusColor?: TextProps["color"];
    id: number;
  }
>;

const FocusableText = ({
  id,
  focusColor,
  onFocused,
  children,
  ...props
}: Props) => {
  const { isFocused } = useFocus({ id: `${id}` });
  useEffect(() => {
    isFocused && onFocused(id);
  }, [isFocused]);
  const color = isFocused ? focusColor ?? "blueBright" : props?.color;
  const underline = isFocused;
  return (
    <Text
      {...{
        underline,
        ...props,
        color,
      }}
    >
      {children}
    </Text>
  );
};

export default FocusableText;
