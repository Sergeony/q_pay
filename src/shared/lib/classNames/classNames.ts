type Modes = Record<string, boolean | string>;


export const classNames = (cls: string, modes: Modes = {}, additional: string[] = []): string => {
    return [
        cls,
        ...additional.filter(Boolean),
        ...Object.entries(modes)
            .filter(([key, value]) => Boolean(value))
            .map(([className]) => className)
    ].join(' ');
}
