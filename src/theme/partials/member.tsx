import {
  ContainerReflection,
  DeclarationReflection,
  JSX,
  ReferenceReflection,
  ReflectionGroup,
} from "typedoc";
import { MyThemeRenderContext } from "./../myThemeRenderContext";
import { classNames } from "./../../utils";
import { getDisplayName, renderFlags, wbr } from "./../utils";
import { anchorIcon } from "./shared/anchorIcon";
export function member(
  context: MyThemeRenderContext,
  props: DeclarationReflection,
) {
  context.page.pageHeadings.push({
    link: `#${props.anchor}`,
    text: getDisplayName(props),
    kind: props.kind,
    classes: context.getReflectionClasses(props),
  });

  return (
    <section
      class={classNames(
        { "tsd-panel": true, "tsd-member": true },
        context.getReflectionClasses(props),
      )}
    >
      <a id={props.anchor} class="tsd-anchor"></a>
      {!!props.name && (
        <h5
          class={classNames({
            deprecated: props.isDeprecated(),
            "tsd-anchor-link": true,
            "tsd-member-title": true,
          })}
        >
          {renderFlags(props.flags, props.comment)}
          {wbr(props.name)}

          {anchorIcon(context, props.anchor)}
        </h5>
      )}
      {props.signatures
        ? context.memberSignatures(props)
        : props.hasGetterOrSetter()
        ? context.memberGetterSetter(props)
        : props instanceof ReferenceReflection
        ? context.memberReference(props)
        : context.memberDeclaration(props)}

      {props.groups?.map(item =>
        item.children.map(item => !item.hasOwnDocument && context.member(item)),
      )}
    </section>
  );
}
