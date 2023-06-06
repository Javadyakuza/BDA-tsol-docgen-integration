import {
  DeclarationReflection,
  Reflection,
  SignatureReflection,
  TypeParameterReflection,
} from "typedoc";

/**
 * Used to inject HTML directly into the document.
 */
export function Raw(_props: { html: string }) {
  // This is handled specially by the renderElement function. Instead of being
  // called, the tag is compared to this function and the `html` prop will be
  // returned directly.
  return null;
}

export function hasTypeParameters(
  reflection: Reflection,
): reflection is Reflection & { typeParameters: TypeParameterReflection[] } {
  return (
    (reflection instanceof DeclarationReflection ||
      reflection instanceof SignatureReflection) &&
    reflection.typeParameters != null &&
    reflection.typeParameters.length > 0
  );
}

export function classNames(
  names: Record<string, boolean | null | undefined>,
  extraCss?: string,
) {
  const css = Object.keys(names)
    .filter(key => names[key])
    .concat(extraCss || "")
    .join(" ")
    .trim()
    .replace(/\s+/g, " ");
  return css.length ? css : undefined;
}
