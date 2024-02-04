import useDimensions from "./hooks/useDimensions.js";
import ScrollableList from "./ScrollableList.js";
import { Box, Newline, Text, render } from "ink";
import { clear } from "console";
import { Fragment, useState } from "react";

const TestApp = () => {
  const [items] = useState<string[]>(
    new Array(100).fill("element").map((x, i) => x + i),
  );
  const [contentMap] = useState(
    new Map(
      items.map((item) => [
        item,
        <Text>
          <Text>This is the content associated with {item}</Text>
          <Newline />
          <Newline />
          {new Array(~~(Math.random() * 3))
            .fill(
              "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.",
            )
            .map((txt, i) => (
              <Fragment key={i}>
                <Text>{txt}</Text>
                <Newline />
                <Newline />
              </Fragment>
            ))}
        </Text>,
      ]),
    ),
  );
  const [activeContent, setActiveContent] = useState<JSX.Element>(
    contentMap.get(items[0]),
  );
  const [width, height] = useDimensions();
  return (
    <Box borderStyle="single" height={height - 1} width={width} padding={1}>
      <ScrollableList
        title="LIST"
        onChange={(key) => {
          setActiveContent(contentMap.get(key));
        }}
      >
        {items}
      </ScrollableList>
      <Box
        flexDirection="column"
        alignItems="center"
        flexBasis="80%"
        flexGrow={9}
      >
        <Text>CONTENT</Text>
        <Box borderStyle="single" padding={2} width="100%" height="100%">
          {activeContent}
        </Box>
      </Box>
    </Box>
  );
};

clear();
render(<TestApp />);
