import { JSX } from "typedoc";
import type { MyThemeRenderContext } from "../../myThemeRenderContext";

export function anchorIcon(
  context: MyThemeRenderContext,
  anchor: string | undefined,
) {
  if (!anchor) return <></>;

  return (
    <a href={`#${anchor}`} aria-label="Permalink" class="tsd-anchor-icon">
      {context.icons.anchor()}
    </a>
  );
}
