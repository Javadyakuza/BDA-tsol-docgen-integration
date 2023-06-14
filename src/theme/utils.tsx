import {
  DeclarationReflection,
  JSX,
  ProjectReflection,
  Reflection,
  ReflectionFlags,
  Comment,
  TypeParameterReflection,
  ReferenceReflection,
  ReflectionKind,
} from "typedoc";
import { MyThemeRenderContext } from "./myThemeRenderContext";

export function wbr(str: string): (string | JSX.Element)[] {
  // TODO surely there is a better way to do this, but I'm tired.
  const ret: (string | JSX.Element)[] = [];
  const re = /[\s\S]*?(?:[^_-][_-](?=[^_-])|[^A-Z](?=[A-Z][^A-Z]))/g;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(str))) {
    ret.push(match[0], <wbr />);
    i += match[0].length;
  }
  ret.push(str.slice(i));

  return ret;
}

export function getDisplayName(refl: Reflection): string {
  let version = "";
  if (
    (refl instanceof DeclarationReflection ||
      refl instanceof ProjectReflection) &&
    refl.packageVersion
  ) {
    version = ` - v${refl.packageVersion}`;
  }

  return `${refl.name}${version}`;
}

export function getKindClass(refl: Reflection): string {
  if (refl instanceof ReferenceReflection) {
    return getKindClass(refl.getTargetReflectionDeep());
  }
  return ReflectionKind.classString(refl.kind);
}

export function renderFlags(
  flags: ReflectionFlags,
  comment: Comment | undefined,
) {
  const allFlags = [...flags];
  if (comment) {
    allFlags.push(
      ...Array.from(comment.modifierTags, tag =>
        tag.replace(/@([a-z])/, x => x[1].toUpperCase()),
      ),
    );
  }

  return (
    <>
      {allFlags.map(item => (
        <>
          <code class={"tsd-tag ts-flag" + item}>{item}</code>{" "}
        </>
      ))}
    </>
  );
}
export function join<T>(
  joiner: JSX.Children,
  list: readonly T[],
  cb: (x: T) => JSX.Children,
) {
  const result: JSX.Children = [];

  for (const item of list) {
    if (result.length > 0) {
      result.push(joiner);
    }
    result.push(cb(item));
  }

  return <>{result}</>;
}

export function renderTypeParametersSignature(
  context: MyThemeRenderContext,
  typeParameters: readonly TypeParameterReflection[] | undefined,
): JSX.Element {
  if (!typeParameters || typeParameters.length === 0) return <></>;
  const hideParamTypes = context.options.getValue("hideParameterTypesInTitle");

  if (hideParamTypes) {
    return (
      <>
        <span class="tsd-signature-symbol">{"<"}</span>
        {join(
          <span class="tsd-signature-symbol">{", "}</span>,
          typeParameters,
          item => (
            <>
              {item.flags.isConst && "const "}
              {item.varianceModifier ? `${item.varianceModifier} ` : ""}
              <span class="tsd-signature-type tsd-kind-type-parameter">
                {item.name}
              </span>
            </>
          ),
        )}
        <span class="tsd-signature-symbol">{">"}</span>
      </>
    );
  }

  return (
    <>
      <span class="tsd-signature-symbol">{"<"}</span>
      {join(
        <span class="tsd-signature-symbol">{", "}</span>,
        typeParameters,
        item => (
          <>
            {item.flags.isConst && "const "}
            {item.varianceModifier ? `${item.varianceModifier} ` : ""}
            <span class="tsd-signature-type tsd-kind-type-parameter">
              {item.name}
            </span>
            {!!item.type && (
              <>
                <span class="tsd-signature-symbol"> extends </span>
                {context.type(item.type)}
              </>
            )}
          </>
        ),
      )}
      <span class="tsd-signature-symbol">{">"}</span>
    </>
  );
}
