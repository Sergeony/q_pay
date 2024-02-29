type Modes = Record<string, boolean | string>;

export function classNames(cls: string, modes: Modes = {}, additional: string[] = []): string {
    return [
        cls,
        ...additional.filter(Boolean),
        ...Object.entries(modes)
            .filter(([_, value]) => Boolean(value))
            .map(([className]) => className)
    ].join(" ");
}
