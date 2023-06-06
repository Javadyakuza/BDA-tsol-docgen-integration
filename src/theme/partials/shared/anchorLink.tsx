import { JSX } from "typedoc";

export const AnchorLink = (props: { idName: string; class: string }) => (
  <div class={`${props.class}`}>
    <a
      href={`#${props.idName}`}
      rel="noopener"
      style="font-size: 1em; text-decoration: none"
    >
      {props.idName}
    </a>
  </div>
);
