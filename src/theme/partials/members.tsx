import {
  ContainerReflection,
  DeclarationReflection,
  JSX,
  ReflectionGroup,
} from "typedoc";
import { MyThemeRenderContext } from "../myThemeRenderContext";
import { classNames } from "../../utils";

export function members(
  context: MyThemeRenderContext,
  props: ContainerReflection,
) {
  if (props.categories && props.categories.length) {
    return (
      <>
        {props.categories.map(
          item =>
            !item.allChildrenHaveOwnDocument() && (
              <section
                class={classNames(
                  { "tsd-panel-group": true, "tsd-member-group": true },
                  props instanceof DeclarationReflection
                    ? context.getReflectionClasses(props)
                    : "",
                )}
              >
                <h3>321312312{item.title}</h3>
                {item.children.map(
                  item => !item.hasOwnDocument && context.member(item),
                )}
              </section>
            ),
        )}
      </>
    );
  }

  return (
    <>
      {props.groups?.map(
        item =>
          !item.allChildrenHaveOwnDocument() && context.membersGroup(item),
      )}
    </>
  );
}
