import {
  DeclarationReflection,
  JSX,
  ProjectReflection,
  Reflection,
  ReflectionFlags,
  Comment,
} from "typedoc";

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
