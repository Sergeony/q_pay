export type Modes = Record<string, boolean | string | undefined>;

export function classNames(
    cls: string,
    additional: Array<string | undefined> = [],
    modes: Modes = {}
): string {
    return [
        cls,
        ...additional.filter(Boolean),
        ...Object.entries(modes)
            .filter(([_, value]) => Boolean(value))
            .map(([className]) => className)
    ].join(" ");
}
