import {
  DefaultThemeRenderContext,
  PageEvent,
  Reflection,
  DefaultTheme,
  Options,
  JSX,
  RenderTemplate,
} from "typedoc";

import { pageTemplate } from "./templates/page";
import {
  tableOfContent,
  member,
  members,
  membersGroup,
  memberDeclaration,
} from "./partials";
import { pageLayout } from "./layout/pageLayout";
import { reflectionTemplate } from "./templates/reflection";
import { TocSection } from "../toc";

function bind<F, L extends any[], R>(fn: (f: F, ...a: L) => R, first: F) {
  return (...r: L) => fn(first, ...r);
}
export class MyThemeRenderContext extends DefaultThemeRenderContext {
  constructor(
    theme: DefaultTheme,
    page: PageEvent<Reflection>,
    options: Options,
  ) {
    super(theme, page, options);
  }

  pageTemplate = bind(pageTemplate, this);
  tableOfContent = bind(tableOfContent, this);
  pageLayout = bind(pageLayout, this);
  reflectionTemplate = bind(reflectionTemplate, this);
  member = bind(member, this);
  members = bind(members, this);
  membersGroup = bind(membersGroup, this);
  memberDeclaration = bind(memberDeclaration, this);
}
