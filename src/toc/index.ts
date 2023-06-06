import {
  DeclarationReflection,
  ProjectReflection,
  ReflectionKind,
  ReflectionCategory,
} from "typedoc";

import { TocSection, TableOfContent } from "./models";

function getCategoryName(child: DeclarationReflection) {
  switch (child.kind) {
    case ReflectionKind.Class:
      return "Classes";
    case ReflectionKind.Constructor:
      return "Constructors";
    case ReflectionKind.Method:
      return "Methods";
    case ReflectionKind.Property:
      return "Properties";
    case ReflectionKind.Accessor:
      return "Accessors";

    case ReflectionKind.Interface:
      return "Interfaces";
    case ReflectionKind.Enum:
      return "Enums";
    case ReflectionKind.TypeAlias:
      return "Type Aliases";
    case ReflectionKind.Variable:
      return "Variables";
    case ReflectionKind.Function:
      return "Functions";
    default:
      return "Other";
  }
}

// export function buildTableOfContent(
//   category: ReflectionCategory,
//   sectionIdDl: string = ".",
// ): TableOfContent {
//   const toc: TableOfContent = {};
//   let lastId = 1;
//   const otherSections: DeclarationReflection[] = [];

//   for (const node of category.children!) {
//     let sectionTag = node.comment?.blockTags?.find(
//       tag => tag.tag === "@tocSection",
//     );
//     let refTag = node.comment?.blockTags?.find(tag => tag.tag === "@tocRef");

//     if (node.kind === ReflectionKind.Function) {
//       sectionTag = node.signatures?.[0].comment?.blockTags?.find(
//         tag => tag.tag === "@tocSection",
//       );
//       refTag = node.signatures?.[0].comment?.blockTags?.find(
//         tag => tag.tag === "@tocRef",
//       );
//     }

//     if (sectionTag) {
//       const sectionId = Number(
//         sectionTag.content[0]?.text.split(sectionIdDl)[0],
//       );

//       const sectionName = sectionTag.content[0]?.text
//         .substring(sectionTag.content[0].text.indexOf(" ") + 1)
//         ?.toLowerCase();

//       const section = new TocSection(
//         sectionName,
//         sectionId,
//         ReflectionKind.Module,
//         false,
//       );
//       section.id = lastId++;
//       section.parentName = category.title;
//       section.children = [node];

//       toc[sectionName] = section;
//     } else if (refTag) {
//       const sectionId = Number(refTag.content[0].text);
//       const sectionName = Object.values(toc)
//         .find(section => section.colNum === sectionId)
//         ?.name.toLowerCase();

//       if (sectionName) {
//         const section = toc[sectionName];
//         section.children?.push(node);
//         if (section) {
//         } else {
//           console.log(
//             "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!section not found!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
//           );
//         }
//       }
//     } else {
//       otherSections.push(node);
//     }
//   }

//   if (otherSections.length > 0) {
//     for (const node of otherSections) {
//       const sectionName = getCategoryName(node).toLowerCase();

//       if (sectionName in toc) {
//         toc[sectionName].children?.push(node);
//       } else {
//         const section = new TocSection(
//           sectionName,
//           lastId++,
//           ReflectionKind.Module,
//           false,
//         );
//         section.parentName = category.title;
//         section.children = [node];
//         toc[sectionName] = section;
//       }
//     }
//   }

//   //(project as any)["tableOfContent"] = toc;

//   return toc;
// }

export function buildTableOfContent(
  category: ReflectionCategory,
  sectionIdDl: string = ".",
): TableOfContent {
  const toc: TableOfContent = {};
  let lastId = 1;
  const otherSections: DeclarationReflection[] = [];

  for (const node of category.children!) {
    let sectionTag = node.comment?.blockTags?.find(
      tag => tag.tag === "@tocSection",
    );
    let refTag = node.comment?.blockTags?.find(tag => tag.tag === "@tocRef");

    if (node.kind === ReflectionKind.Function) {
      sectionTag = node.signatures?.[0].comment?.blockTags?.find(
        tag => tag.tag === "@tocSection",
      );
      refTag = node.signatures?.[0].comment?.blockTags?.find(
        tag => tag.tag === "@tocRef",
      );
    }

    if (sectionTag) {
      const sectionId = Number(
        sectionTag.content[0]?.text.split(sectionIdDl)[0],
      );

      const sectionName = sectionTag.content[0]?.text.substring(
        sectionTag.content[0].text.indexOf(" ") + 1,
      );
      const section = new TocSection(
        sectionName,
        sectionId,
        ReflectionKind.Module,
        false,
      );
      section.id = lastId++;
      section.parentName = category.title;
      section.children = [node];

      toc[sectionName.toLowerCase()] = section;
    } else if (refTag) {
      const sectionId = Number(refTag.content[0].text);
      const sectionName = Object.values(toc)
        .find(section => section.colNum === sectionId)
        ?.name.toLowerCase();

      if (sectionName) {
        const section = toc[sectionName.toLowerCase()];
        section.children?.push(node);
        if (section) {
        } else {
          console.log(
            "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!section not found!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
          );
        }
      }
    } else {
      otherSections.push(node);
    }
  }

  if (otherSections.length > 0) {
    for (const node of otherSections) {
      const sectionName = getCategoryName(node);

      if (sectionName in toc) {
        toc[sectionName.toLowerCase()].children?.push(node);
      } else {
        const section = new TocSection(
          sectionName,
          lastId++,
          ReflectionKind.Module,
          false,
        );
        section.parentName = category.title;
        section.children = [node];
        toc[sectionName.toLowerCase()] = section;
      }
    }
  }

  //(project as any)["tableOfContent"] = toc;

  return toc;
}

export function buildProjectToc(
  project: ProjectReflection,
): TableOfContent | undefined {
  if (!project.categories) return;
  const toc: TableOfContent = {};
  let lastId = 1;
  for (const category of project.categories) {
    const pageToc = buildTableOfContent(category);
    const section = new TocSection(
      category.title,
      lastId++,
      ReflectionKind.Module,
      true,
      project,
    );
    section.tableOfContent = pageToc;
    section.children = category.children;
    section.parentName = category.title;
    toc[category.title.toString().toLowerCase()] = section;
  }
  //(project as any).tableOfContent = toc;
  return toc;
}

export { TocSection, TableOfContent };
