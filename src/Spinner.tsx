import spinnerKinds from "./utils/spinnerKinds.js";
import { useEffect, useState } from "react";
import { type TextProps, Text } from "ink";

type Props = TextProps & {
  kind?: keyof typeof spinnerKinds;
  interval?: number;
};

const Spinner = ({ kind = "brailDots", interval = 100, ...props }: Props) => {
  const [frameId, setFrameId] = useState(0);
  const frames = spinnerKinds[kind];
  useEffect(() => {
    const timer = setTimeout(() => {
      setFrameId(frameId < frames.length - 1 ? frameId + 1 : 0);
    }, interval);
    return () => {
      clearTimeout(timer);
    };
  }, [frameId]);

  return <Text {...props}>{frames[frameId]}</Text>;
};

export default Spinner;
