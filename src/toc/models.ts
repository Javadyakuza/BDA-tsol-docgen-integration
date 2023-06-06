import {
  DeclarationReflection,
  RenderTemplate,
  PageEvent,
  Reflection,
  ReflectionKind,
} from "typedoc";

export class TocSection extends DeclarationReflection {
  parentName?: string;
  tableOfContent?: TableOfContent;
  template?: RenderTemplate<PageEvent<any>>;
  itsPage: boolean;
  colNum: number;

  constructor(
    name: string,
    colNum: number,
    kind: ReflectionKind,
    itsPage: boolean,
    parent?: Reflection,
    template?: RenderTemplate<PageEvent<any>>,
  ) {
    super(name, kind, parent);
    this.colNum = colNum;
    this.itsPage = itsPage;
    this.template = template;
  }
}
export interface TableOfContent {
  [name: string]: TocSection;
}
