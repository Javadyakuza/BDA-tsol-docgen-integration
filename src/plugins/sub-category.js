const fs = require("fs");
const path = require("path");
const {
  Application,
  Converter,
  ReflectionKind,
  DeclarationReflection,
  ProjectReflection,
  SignatureReflection,

  Comment,
  CommentTag,
  ReflectionCategory,
} = require("typedoc");

const { MyCustomTheme } = require("./../theme");

function load(host) {
  const app = host.application;
  app.renderer.defineTheme("mycustom", MyCustomTheme);
  // app.converter.on(Converter.EVENT_END, async project => {
  //   // const projectWithSubCategory = await createSubCategory(project);
  //   // const ast = JSON.parse(
  //   //   fs.readFileSync("src/everscale-inpage-provider/ast.json", "utf-8"),
  //   // );
  //   // ast.subCategories = projectWithSubCategory.subCategory?.toObject(
  //   //   app.serializer,
  //   // );
  //   // fs.writeFileSync(
  //   //   path.resolve(__dirname, "src/everscale-inpage-provider/ast.json"),
  //   //   JSON.stringify(ast, null, 2),
  //   // );
  //   // console.log(123123);
  // });
}

class SubCategoryReflection {
  constructor(name) {
    this.name = name;
  }

  toObject(serializer) {
    if (!this.children) {
      return {};
    }
    const serializedChildren = this.children.map(child =>
      serializer.toObject(child),
    );

    const serializedParentCategory = this.parentCategory?.toObject(serializer);
    return {
      name: this.name,
      children: serializedChildren,
      parent: this.parent,
      parentCategory: serializedParentCategory,
    };
  }
}

class ProjectReflectionWithSubCategory extends ProjectReflection {
  constructor() {
    super();
    this.subCategory = undefined;
  }
}

class SubCategoryGroup {
  constructor(title) {
    this.title = title;
    this.children = [];
  }

  allChildrenHaveOwnDocument() {
    return this.children.every(
      child =>
        child.hasOwnProperty("children") &&
        child.children?.every(subChild =>
          subChild ? subChild.hasOwnDocument : false,
        ),
    );
  }

  toObject(serializer) {
    return this.children.length > 0
      ? this.children.map(child => child.toObject(serializer))
      : [];
  }

  fromObject(de, obj) {
    // if (obj.children) {
    //   this.children = obj.children.map((childObj) => {
    //     const child = new SubCategoryReflection(childObj.name);
    //     child.children = de.fromObject();
    //     de.fromObject(this.children, obj.parentCategory);
    //     child.parent = childObj.parent;
    //     child.parentCategory = childObj.parentCategory;
    //     return child;
    //   });
    // }
  }
}

module.exports = {
  load,
  SubCategoryReflection,
  ProjectReflectionWithSubCategory,
  SubCategoryGroup,
};

function findCategoryByChildId(childId, project) {
  for (const category of project.categories) {
    for (const child of category.children) {
      if (child.id === childId) {
        return category;
      }
    }
  }
  return undefined;
}

function addSubCategoriesToChildrenNodes(parent, project) {
  const knownedSubCategories = new Map();
  let currentSubCategory;
  let currentComment;
  for (const child of parent.children) {
    let signature;

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
        currentSubCategory = signature.comment.blockTags.find(
          tag => tag.tag === "@subCategory",
        ).content[0].text;

        currentComment = signature.comment.clone();

        if (
          currentSubCategory &&
          !knownedSubCategories.has(currentSubCategory)
        ) {
          const category = findCategoryByChildId(parent.id, project);

          const newSubCategory = new SubCategoryReflection(currentSubCategory);
          newSubCategory.children = [];
          newSubCategory.parent = parent.id;
          newSubCategory.parentCategory = category;

          knownedSubCategories.set(newSubCategory.name, newSubCategory);
        }
      }
    }

    if (!currentSubCategory) continue;

    knownedSubCategories.get(currentSubCategory).children.push(child);

    const newCommentTag = new CommentTag(`@SubCategoryReflection`, [
      { kind: "text", text: currentSubCategory },
    ]);
    if (!signature.comment) {
      child.signatures[0].comment = currentComment;
    } else if (!signature.comment.blockTags) {
      signature.comment.blockTags = [newCommentTag];
    } else if (
      !signature.comment.blockTags.some(
        tag => tag.tag === "@SubCategoryReflection",
      )
    ) {
      signature.comment.blockTags.push(newCommentTag);
    }
  }

  return knownedSubCategories;
}

async function createSubCategory(project) {
  // let knownedSubCategories = new Map();
  // console.log(12312);
  // for (const node of project.children) {
  //   if (
  //     node.kind === ReflectionKind.Class ||
  //     node.kind === ReflectionKind.Interface
  //   ) {
  //     const newKnownedSubCategories = addSubCategoriesToChildrenNodes(
  //       node,
  //       project,
  //     );
  //     if (newKnownedSubCategories.size > 0) {
  //       knownedSubCategories = new Map([
  //         ...knownedSubCategories,
  //         ...newKnownedSubCategories,
  //       ]);
  //     }
  //   }
  // }

  // project.subCategory = new SubCategoryGroup("SubCategories");
  // project.subCategory.children = Array.from(knownedSubCategories.values()).map(
  //   subCategory => {
  //     const subCategoryObject = new SubCategoryReflection(subCategory.name);
  //     subCategoryObject.children = subCategory.children;
  //     subCategoryObject.parent = subCategory.parent;
  //     subCategoryObject.parentCategory = subCategory.parentCategory;

  //     return subCategoryObject;
  //   },
  // );

  return project;
}

function processNamespaceOrModule(node, sectionMap, subCategoryMap) {
  for (const child of node.children || []) {
    if (
      child.kind === ReflectionKind.Namespace ||
      child.kind === ReflectionKind.Module
    ) {
      processNamespaceOrModule(child, sectionMap, subCategoryMap);
    } else if (
      child.kind === ReflectionKind.Class ||
      child.kind === ReflectionKind.Interface
    ) {
      //processClassOrInterface(child, sectionMap, subCategoryMap);
    } else if (
      child.kind === ReflectionKind.Function ||
      child.kind === ReflectionKind.Variable
    ) {
      //processFunctionOrVariable(child, sectionMap);
    }
  }
}
