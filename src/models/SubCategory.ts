import {
  DeclarationReflection,
  ReflectionCategory,
  Serializer,
  JSONOutput,
  Deserializer,
  ProjectReflection,
} from "typedoc";

export class SubCategoryReflection {
  name: string;
  title?: string;
  children?: DeclarationReflection[];
  parent?: number;
  parentCategory?: ReflectionCategory;

  constructor(name: string) {
    this.name = name;
  }

  toObject(serializer: Serializer): any {
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

export class ProjectReflectionWithSubCategory extends ProjectReflection {
  subCategory?: SubCategoryGroup;
}

export class SubCategoryGroup {
  title: string;
  children: SubCategoryReflection[] = [];

  constructor(title: string) {
    this.title = title;
  }

  allChildrenHaveOwnDocument(): boolean {
    return this.children.every(
      child =>
        child.hasOwnProperty("children") &&
        child.children?.every(subChild =>
          subChild ? subChild.hasOwnDocument : false,
        ),
    );
  }

  toObject(serializer: Serializer): any {
    return this.children.length > 0
      ? this.children.map(child => child.toObject(serializer))
      : [];
  }

  fromObject(de: Deserializer, obj: any) {
    // if (obj.children) {
    //   this.children = obj.children.map((childObj: any) => {
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
