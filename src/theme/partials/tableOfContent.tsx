import type { DefaultThemeRenderContext } from "typedoc/dist/lib/output/themes/default/DefaultThemeRenderContext";
import { JSX, DeclarationReflection, ReferenceReflection } from "typedoc";

import { anchorIcon } from "typedoc/dist/lib/output/themes/default/partials/anchor-icon";
import { TableOfContent, TocSection } from "../../toc";
import { Category } from "../../ast/upgrade-ast";
import { AnchorLink, Arrow } from "./shared";

function renderSection(
  context: DefaultThemeRenderContext,
  section: TocSection,
) {
  return (
    <details id={section.id.toString().toLowerCase()} class="toc-section">
      <summary>
        <a href={context.urlTo(section)}>{section.name}</a>
      </summary>
      <ul>
        {section.tableOfContent
          ? Object.values(section.tableOfContent).map(section =>
              renderSection(context, section),
            )
          : section.children?.map(child => (
              <a href={context.urlTo(child)}>{child.name}</a>
            ))}
      </ul>
    </details>
  );
}

export interface TableOfContentProps {
  sections: TocSection[];
  open?: boolean;
}

export function tableOfContent(
  context: DefaultThemeRenderContext,
  props: TableOfContentProps,
) {
  return (
    <details class="toc" open>
      <summary>
        <h3 class="toc-title">Table of Content</h3>
      </summary>

      <ul class="toc-contents">
        {props.sections.map(section => (
          <li>{renderSection(context, section)}</li>
        ))}
      </ul>
    </details>
  );
}
