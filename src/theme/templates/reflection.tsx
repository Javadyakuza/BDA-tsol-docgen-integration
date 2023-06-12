import {
  DefaultThemeRenderContext,
  JSX,
  PageEvent,
  ContainerReflection,
  DeclarationReflection,
  ReflectionKind,
  ReflectionType,
} from "typedoc";
import { Raw, hasTypeParameters, classNames } from "../../utils";
import { MyThemeRenderContext } from "../myThemeRenderContext";
import { TocSection } from "../../toc";
import { anchorIcon } from "./..//partials/shared/anchorIcon";
import { wbr } from "./../utils";

export function reflectionTemplate(
  context: MyThemeRenderContext,
  props: PageEvent<ContainerReflection>,
) {
  if (
    [ReflectionKind.TypeAlias, ReflectionKind.Variable].includes(
      props.model.kind,
    ) &&
    props.model instanceof DeclarationReflection
  ) {
    return context.memberDeclaration(props.model);
  }

  return (
    <>
      {/* <a id={props.model.anchor} class="tsd-anchor">
        <h3 id={props.model.anchor}>12321{props.model.name}</h3>
      </a> */}
      {/* <a
        id={
          (props.model instanceof DeclarationReflection &&
            props.model.anchor) ||
          ""
        }
        class="tsd-anchor"
      ></a> */}
      {!!props.model.name && (
        <h3
          class={classNames({
            deprecated: props.model.isDeprecated(),
            "tsd-anchor-link": true,
          })}
          id={props.model.name}
        >
          {wbr(props.model.name)}
          {/* {renderFlags(props.flags, props.comment)} */}
          {/* {console.log(12, props.model.anchor)} */}
          {anchorIcon(context, props.model.anchor)}
        </h3>
      )}

      {props.model.hasComment() && (
        <section class="tsd-panel tsd-comment">
          {context.comment(props.model)}
        </section>
      )}

      {/* {props.model instanceof TocSection &&
        props.model.tableOfContent &&
        context.tableOfContent({
          sections: Object.values(props.model.tableOfContent),
          open: true,
        })} */}
      {props.model instanceof DeclarationReflection &&
        props.model.kind === ReflectionKind.Module &&
        props.model.readme?.length && (
          <section class="tsd-panel tsd-typography">
            <Raw html={context.markdown(props.model.readme)} />
          </section>
        )}
      {hasTypeParameters(props.model) && (
        <> {context.typeParameters(props.model.typeParameters)} </>
      )}
      {props.model instanceof DeclarationReflection && (
        <>
          {context.hierarchy(props.model.typeHierarchy)}

          {!!props.model.implementedTypes && (
            <section class="tsd-panel">
              <h4>Implements</h4>

              <ul class="tsd-hierarchy">
                {props.model.implementedTypes.map(item => (
                  <li>{context.type(item)}</li>
                ))}
              </ul>
            </section>
          )}
          {!!props.model.implementedBy && (
            <section class="tsd-panel">
              <h4>Implemented by</h4>
              <ul class="tsd-hierarchy">
                {props.model.implementedBy.map(item => (
                  <li>{context.type(item)}</li>
                ))}
              </ul>
            </section>
          )}
          {!!props.model.signatures && (
            <section class="tsd-panel">
              {context.memberSignatures(props.model)}
            </section>
          )}
          {!!props.model.indexSignature && (
            <section
              class={classNames(
                { "tsd-panel": true },
                context.getReflectionClasses(props.model),
              )}
            >
              <h4 class="tsd-before-signature">Indexable</h4>
              <div class="tsd-signature">
                <span class="tsd-signature-symbol">[</span>
                {props.model.indexSignature.parameters!.map(item => (
                  <>
                    {item.name}: {context.type(item.type)}
                  </>
                ))}
                <span class="tsd-signature-symbol">]: </span>
                {context.type(props.model.indexSignature.type)}
              </div>
              {context.comment(props.model.indexSignature)}
              {props.model.indexSignature?.type instanceof ReflectionType &&
                context.parameter(props.model.indexSignature.type.declaration)}
            </section>
          )}
          {!props.model.signatures && context.memberSources(props.model)}
        </>
      )}

      {/* {!!props.model.children?.length && context.index(props.model)} */}

      {context.members(props.model)}
    </>
  );
}
