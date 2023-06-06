import {
  DeclarationReflection,
  ProjectReflection,
  SignatureReflection,
  ReflectionKind,
  Comment,
  CommentTag,
  ReflectionCategory,
  Reflection,
} from "typedoc";

import {
  SubCategoryReflection,
  ProjectReflectionWithSubCategory,
  SubCategoryGroup,
} from "../models";

export interface TocSection {
  id: number;
  title: string;
  elements?: TableOfContentElement[];
}

export interface TableOfContent {
  sections: TocSection[];
}

export interface TableOfContentElement {
  id: number;
  title: string;
  categories?: Category[];
}

export interface Category {
  id?: number;
  name: string;
  children: number[];
  subCategories?: SubCategoryReflection[];
}

function findCategoryByChildId(
  childId: number,
  project: ProjectReflection,
): ReflectionCategory | undefined {
  for (const category of project.categories!) {
    for (const child of category.children) {
      if (child.id === childId) {
        return category;
      }
    }
  }
  return undefined;
}

export function addSubCategoriesToChildrenNodes(
  parent: DeclarationReflection,
  project: ProjectReflection,
) {
  const knownedSubCategories = new Map<string, SubCategoryReflection>();
  let currentSubCategory: string | undefined;
  let currentComment: Comment | undefined;
  for (const child of parent.children!) {
    let signature: SignatureReflection | undefined;

    if (child.kind === ReflectionKind.Accessor) {
      signature = child.getSignature;
    } else if (child.signatures) {
      signature = child.signatures[0];
    }
    if (!signature) continue;

    const childId = child.id;

    if (signature.comment) {
      if (!signature.comment.blockTags) {
        signature.comment.blockTags = [];
      }

      if (signature.comment.blockTags.some(tag => tag.tag === "@subCategory")) {
        currentSubCategory = signature.comment?.blockTags.find(
          tag => tag.tag === "@subCategory",
        )?.content[0].text;

        currentComment = signature.comment.clone();

        if (
          currentSubCategory &&
          !knownedSubCategories.has(currentSubCategory)
        ) {
          const category = findCategoryByChildId(parent.id, project);

          const newSubCategory = new SubCategoryReflection(currentSubCategory);
          newSubCategory.children = [];
          newSubCategory.parent = parent.id;
          newSubCategory.parentCategory = category!;

          knownedSubCategories.set(newSubCategory.name, newSubCategory);
        }
      }
    }

    if (!currentSubCategory) continue;

    knownedSubCategories.get(currentSubCategory)?.children?.push(child);

    const newCommentTag = new CommentTag(`@subCategory`, [
      { kind: "text", text: currentSubCategory },
    ]);
    if (!signature.comment) {
      child.signatures![0].comment = currentComment;
    } else if (!signature.comment.blockTags) {
      signature.comment.blockTags = [newCommentTag];
    } else if (
      !signature.comment.blockTags.some(tag => tag.tag === "@subCategory")
    ) {
      signature.comment.blockTags.push(newCommentTag);
    }

    // if (child.signatures && child.signatures.length > 0) {
    //   for (const signature of child.signatures!) {
    //     if (!signature.comment) {
    //       signature.comment = currentComment;
    //     } else if (!signature.comment.blockTags) {
    //       signature.comment.blockTags = [newCommentTag];
    //     } else if (
    //       !signature.comment.blockTags.some(
    //         tag => tag.tag === "@subCategory",
    //       ) &&
    //       !currentComment?.blockTags.some(tag => tag.tag === "@subCategory")
    //     ) {
    //       signature.comment.blockTags.push(newCommentTag);
    //     }
    //   }
    // }
  }

  return knownedSubCategories;
}

export async function createSubCategory(
  project: ProjectReflectionWithSubCategory,
) {
  let knownedSubCategories = new Map<string, SubCategoryReflection>();

  for (const node of project.children!) {
    if (
      node.kind === ReflectionKind.Class ||
      node.kind === ReflectionKind.Interface
    ) {
      //console.log("processClassOrInterface", node.name);
      const newKnownedSubCategories = addSubCategoriesToChildrenNodes(
        node,
        project,
      );
      if (newKnownedSubCategories.size > 0) {
        knownedSubCategories = new Map([
          ...knownedSubCategories,
          ...newKnownedSubCategories!,
        ]);
      }
    }
  }

  project.subCategory = new SubCategoryGroup("SubCategories");
  project.subCategory.children = Array.from(knownedSubCategories.values()).map(
    subCategory => {
      const subCategoryObject = new SubCategoryReflection(subCategory.name);
      subCategoryObject.children = subCategory.children;
      subCategoryObject.parent = subCategory.parent;
      subCategoryObject.parentCategory = subCategory.parentCategory;

      return subCategoryObject;
    },
  );

  return project;
}

export function removeServiceTags(node: DeclarationReflection) {
  if (node.comment) {
    node.comment.removeTags("@tocSection");
    node.comment.removeTags("@tocRef");
    node.comment.removeTags("@subCategory");
    node.comment.removeTags("@tocDescription");
    node.comment.removeTags("@subCategory");
  }

  if (node.signatures) {
    node.signatures.forEach((signature: SignatureReflection) => {
      if (signature.comment) {
        signature.comment.removeTags("@tocSection");
        signature.comment.removeTags("@tocRef");
        signature.comment.removeTags("@subCategory");
        signature.comment.removeTags("@subCategory");
        signature.comment.removeTags("@tocDescription");
        if (
          signature.comment.blockTags.some(tag => tag.tag === "@subCategory")
        ) {
          console.log(signature.comment.blockTags);
        }
      }
    });
  }

  if (node.children) {
    node.children.forEach((child: any) => removeServiceTags(child));
  }
}

export function removeServiceTagsFromProject(project: ProjectReflection) {
  project.children?.forEach(child => removeServiceTags(child));
}
