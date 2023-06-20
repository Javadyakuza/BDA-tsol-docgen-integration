import { JSX, DeclarationReflection, ReflectionType } from "typedoc";
//import { getKindClass, hasTypeParameters, renderTypeParametersSignature, wbr } from "../../lib";
import type { MyThemeRenderContext } from "../myThemeRenderContext";
import { wbr, renderTypeParametersSignature, getKindClass } from "../utils";
import { classNames, hasTypeParameters } from "../../utils";
import { anchorIcon } from "./shared/anchorIcon";

export const memberDeclaration = (
  context: MyThemeRenderContext,
  props: DeclarationReflection,
  title?: string,
) => (
  <>
    {title && (
      <h4
        id={title.toLowerCase()}
        class={classNames({
          "tsd-anchor-link": true,
          "tsd-member-title": true,
        })}
      >
        {title}
        {anchorIcon(context, title)}
      </h4>
    )}
    <div class="tsd-signature">
      <span class={getKindClass(props)}>{wbr(props.name)}</span>
      {renderTypeParametersSignature(context, props.typeParameters)}
      {props.type && (
        <>
          <span class="tsd-signature-symbol">
            {!!props.flags.isOptional && "?"}:
          </span>{" "}
          {context.type(props.type)}
        </>
      )}
      {!!props.defaultValue && (
        <>
          <span class="tsd-signature-symbol">
            {" = "}
            {props.defaultValue}
          </span>
        </>
      )}
    </div>

    {context.comment(props)}

    {hasTypeParameters(props) && context.typeParameters(props.typeParameters)}

    {props.type instanceof ReflectionType && (
      <div class="tsd-type-declaration">
        <h4>Type declaration</h4>
        {context.parameter(props.type.declaration)}
      </div>
    )}

    {context.memberSources(props)}
  </>
);
