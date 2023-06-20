import {
  JSX,
  DefaultThemeRenderContext,
  ProjectReflection,
  PageEvent,
  DeclarationReflection,
  ContainerReflection,
  RenderTemplate,
  Reflection,
} from "typedoc";
import { TableOfContent, TocSection } from "../../toc";
import { MyThemeRenderContext } from "../myThemeRenderContext";
import { wbr } from "../utils";
import { anchorIcon } from "../partials/shared/anchorIcon";

interface RenderSectionProps {
  context: MyThemeRenderContext;
  section: TocSection;
  template: RenderTemplate<PageEvent<ContainerReflection>>;
}
export const renderSection = (props: RenderSectionProps) => {
  const { context, section, template } = props;

  if (section.tableOfContent === undefined) {
    return (
      <div>
        <h1>{section.name}</h1>
        {section.children!.map((child: DeclarationReflection) => (
          <div id={section.name.toLowerCase()}>
            <h2 class="tsd-anchor-link" id={child.anchor}>
              {wbr(child.name)}
              {anchorIcon(context, child.anchor)}
            </h2>

            {template(new PageEvent(PageEvent.BEGIN, child))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {Object.values(section.tableOfContent).map((section: TocSection) => {
        return (
          <div id={section.name.toLowerCase()}>
            {!!section.name && (
              <h2 class="tsd-anchor-link" id={section.anchor}>
                {wbr(section.name)}
                {anchorIcon(context, section.anchor)}
              </h2>
            )}

            {section.children?.map((child: DeclarationReflection) => {
              return template(new PageEvent(PageEvent.BEGIN, child));
            })}
          </div>
        );
      })}
    </div>
  );
};
export const pageTemplate = (
  context: MyThemeRenderContext,
  props: PageEvent<ContainerReflection>,
  template: RenderTemplate<PageEvent<ContainerReflection>>,
) => {
  //const tocData = (props.model as any).tableOfContent as TableOfContent;
  const section = props.model as TocSection;
  // if (section.name === "Utils") {
  //   for (const child of section.children!) {
  //     console.log(child.name);
  //   }
  // }
  return <div>{renderSection({ context, section, template })}</div>;
};
