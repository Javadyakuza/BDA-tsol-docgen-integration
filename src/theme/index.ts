import {
  Theme,
  Renderer,
  ProjectReflection,
  UrlMapping,
  Reflection,
  DeclarationReflection,
  PageEvent,
  DefaultTheme,
  RenderTemplate,
  JSX,
  Type,
  DefaultThemeRenderContext,
  ContainerReflection,
  ReflectionCategory,
  SignatureReflection,
} from "typedoc";

import { TocSection, TableOfContent, buildProjectToc } from "./../toc";
import { writeFileSync } from "fs";
//import { tableOfContent } from "./partials/tableOfContent";
import { pageTemplate } from "./templates/page";
import { MyThemeRenderContext } from "./myThemeRenderContext";
import { removeServiceTagsFromProject } from "../ast/upgrade-ast";

export class MyCustomTheme extends DefaultTheme {
  constructor(renderer: Renderer) {
    super(renderer);
  }

  getRenderContext(pageEvent: PageEvent<Reflection>): MyThemeRenderContext {
    return new MyThemeRenderContext(this, pageEvent, this.application.options);
  }

  reflectionTemplate = (pageEvent: PageEvent<ContainerReflection>) => {
    return this.getRenderContext(pageEvent).reflectionTemplate(pageEvent);
  };

  pageTemplate = (pageEvent: PageEvent<Reflection>) => {
    if (pageEvent.model instanceof Reflection) {
      return this.getRenderContext(pageEvent).pageTemplate(
        pageEvent as PageEvent<ContainerReflection>,
        this.reflectionTemplate,
      );
    } else {
      return this.getRenderContext(pageEvent).pageTemplate(
        pageEvent as PageEvent<ContainerReflection>,
        this.reflectionTemplate,
      );
    }
    //return this.getRenderContext(pageEvent).pageTemplate(
    //   pageEvent,
    //   this.reflectionTemplate,
    // );
  };

  pageLayoutTemplate = (
    pageEvent: PageEvent<Reflection>,
    template: RenderTemplate<PageEvent<Reflection>>,
  ) => {
    return this.getRenderContext(pageEvent).pageLayout(template, pageEvent);
  };

  render(
    page: PageEvent<Reflection>,
    template: RenderTemplate<PageEvent<Reflection>>,
  ): string {
    //const urls = this.getUrls(page.project);
    //console.log(page);

    // const toc = tableOfContent(this.getRenderContext(page), {
    //   tocData: projectToc,
    // });
    // console.log(page.model.name, page.model.url);

    const event = new PageEvent(PageEvent.BEGIN, page.model);
    if (page.model.name === "Provider") {
    }
    const templateOutput = this.pageLayoutTemplate(page, template);

    return JSX.renderElement(templateOutput);
  }

  // getUrls(project: ProjectReflection): UrlMapping[] {
  //   const urls: UrlMapping[] = [];

  //   const projectToc = buildProjectToc(project)!;
  //   removeServiceTagsFromProject(project);

  //   let id = 1;
  //   for (const sectionName in projectToc) {
  //     const section = projectToc[sectionName];

  //     if (section.itsPage) {
  //       const url = this.generateUrl(section);
  //       section.url = url;
  //       section.id;

  //       // if (!project.categories) {
  //       //   continue;
  //       // }

  //       urls.push(new UrlMapping(url, section, this.pageTemplate));

  //       section.traverse(child => {
  //         MyCustomTheme.applyAnchorUrl(child, section);
  //         return true;
  //       });
  //     }
  //   }

  //   return urls;
  // }

  private generateUrl(section: TocSection): string {
    return `${section.name.replace(/ /g, "-")}.html`;
  }

  // static generateAnchor(child: Reflection, section: Reflection): string {
  //   return section.name.replace(/ /g, "-").toLowerCase() + "#" + child.name;
  // }

  // static applyAnchorUrl(child: Reflection, section: TocSection | Reflection) {
  //   const anchor = this.generateAnchor(child, section);

  //   child.url = section.url + "#" + anchor;
  //   child.anchor = anchor;
  //   console.log(section.url);

  //   child.traverse(grandchild => {
  //     this.applyAnchorUrl(grandchild, child);
  //     return true;
  //   });
  // }
  // buildUrls(section: TocSection): UrlMapping[] {
  //   const url = this.generateUrl(section);
  //   section.url = url;
  //   const urls: UrlMapping[] = [];

  //   section.traverse(child => {
  //     MyCustomTheme.applyAnchorUrl(child, section);
  //     return true;
  //   });

  //   return urls;
  // }
  getUrls(project: ProjectReflection): UrlMapping[] {
    const urls: UrlMapping[] = [];

    const projectToc = buildProjectToc(project)!;
    removeServiceTagsFromProject(project);

    let id = 1;
    for (const sectionName in projectToc) {
      const section = projectToc[sectionName];

      if (section.itsPage) {
        const url = this.generateUrl(section);
        section.url = url;
        section.id;
        section.anchor =
          section.url + "#" + section.name.replace(/ /g, "-").toLowerCase();

        // if (!project.categories) {
        //   continue;
        // }

        urls.push(new UrlMapping(url, section, this.pageTemplate));

        section.traverse(child => {
          if (child instanceof DeclarationReflection) {
            this.setUrls(child, url);
          }
        });

        if (section.tableOfContent) {
          this.applyTocAnchorUrl(section, url);
        }
      }
    }

    return urls;
  }
  applyTocAnchorUrl(section: TocSection, parentUrl: string) {
    for (const sectionName in section.tableOfContent) {
      const child = section.tableOfContent[sectionName];
      const url = parentUrl + "#" + child.name.replace(/ /g, "-").toLowerCase();
      child.url = url;

      child.anchor = child.name.replace(/ /g, "-").toLowerCase();

      // if (!project.categories) {
      //   continue;
      // }

      if (child.tableOfContent) {
        this.applyTocAnchorUrl(child, child.anchor);
      }
    }
  }
  setUrls(reflection: DeclarationReflection, parentUrl?: string) {
    if (reflection instanceof DeclarationReflection) {
      reflection.url = parentUrl + "#" + reflection.name.replace(/ /g, "-");

      reflection.traverse(child => {
        if (child instanceof DeclarationReflection) {
          this.setUrls(child, reflection.url);
        } else {
          DefaultTheme.applyAnchorUrl(child, reflection);
        }
        return true;
      });
    } else {
      DefaultTheme.applyAnchorUrl(reflection, reflection);
    }
  }
}
