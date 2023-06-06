import { JSX } from "typedoc";

type ArrowProps = {
  isExpanded?: boolean;
  arrowColor?: string;
};

export const Arrow = ({
  isExpanded = false,
  arrowColor = "black",
}: ArrowProps) => (
  <span
    class={`arrow ${isExpanded ? "expanded" : "collapsed"}`}
    style={`border-color: ${arrowColor}`}
  ></span>
);

const arrowStyles = `
.arrow {
  margin-left: 5px;
  border: solid;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transition: transform 0.3s;
}

.expanded {
  transform: rotate(-135deg);
}

.collapsed {
  transform: rotate(45deg);
}
`;
