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
  //console.log(section.tableOfContent === undefined);
  if (section.tableOfContent === undefined) {
    return (
      <div>
        <h1>242321{section.name}</h1>
        {section.children!.map((child: DeclarationReflection) => (
          <div id={section.id?.toString()}>
            <h2>14881337{child.name}</h2>

            {template(new PageEvent(PageEvent.BEGIN, child))}
          </div>
        ))}
      </div>
    );
  }
  // if (section.name === "Other") {
  //   console.log(
  //     JSX.renderElement(
  //       <div>
  //         <h2>{section.name}</h2>
  //         {Object.values(section.tableOfContent).map((section: TocSection) => (
  //           <div id={section.id?.toString()}>
  //             <h3>{section.name}</h3>
  //             {section.children?.map((child: DeclarationReflection) => {
  //               return template(new PageEvent(PageEvent.BEGIN, child));
  //             })}
  //           </div>
  //         ))}
  //       </div>,
  //     ),
  //   );
  // }

  return (
    <div>
      {Object.values(section.tableOfContent).map((section: TocSection) => {
        return (
          <div id={section.id?.toString()}>
            {!!section.name && (
              <h2 class="tsd-anchor-link" id={section.anchor}>
                {/* {renderFlags(props.flags, props.comment)} */}
                {wbr(section.name)}

                {anchorIcon(context, section.anchor)}
              </h2>
            )}

            {/* <h3 id={section.name}>{section.name}</h3> */}
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
  if (section.name === "Other") {
    //console.log(section.children);
  }
  return <div>{renderSection({ context, section, template })}</div>;
};
