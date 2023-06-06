import {
  JSX,
  DefaultThemeRenderContext,
  RenderTemplate,
  PageEvent,
  Reflection,
} from "typedoc";
import { tableOfContent } from "../partials";
import { TocSection } from "../../toc";
import { MyThemeRenderContext } from "../myThemeRenderContext";

export const pageLayout = (
  context: MyThemeRenderContext,
  template: RenderTemplate<PageEvent<Reflection>>,
  props: PageEvent<Reflection>,
) => (
  <div class="page-container">
    <h1>{props.model.name}</h1>

    {context.tableOfContent({
      sections: Object.values((props.model as TocSection).tableOfContent!),
      open: true,
    })}
    <div class="col-content">{template(props)}</div>
  </div>
);
