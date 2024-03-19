export const handleCopyToClipboard = async (value: string) => {
    await navigator.clipboard.writeText(value);
};

export function _toCamelCase(str: string): string {
    return str.replace(
        /([-_][a-z])/g,
        (group) => group
            .toUpperCase()
            .replace("-", "")
            .replace("_", "")
    );
}

export function _toSnakeCase(str: string): string {
    return str.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`
    );
}

export const transformKeyFormat = (obj: any, targetKeyFormat: "camel" | "snake"): any => {
    const transformFunc = targetKeyFormat === "camel" ? _toCamelCase : _toSnakeCase;

    if (Array.isArray(obj)) {
        return obj.map((value) => transformKeyFormat(value, targetKeyFormat));
    }
    if (typeof obj === "object" && obj !== null) {
        return Object.keys(obj)
            .reduce((acc, current) => {
                const newKey = transformFunc(current);
                acc[newKey] = transformKeyFormat(obj[current], targetKeyFormat);
                return acc;
            }, {} as Record<string, any>);
    }
    return obj;
};

export const formatTime = (stringDate: string | null) => {
    if (stringDate === null) stringDate = new Date().toISOString();
    const date = new Date(stringDate);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
};

export const formatDate = (stringDate: string | null) => {
    if (stringDate === null) stringDate = new Date().toISOString();

    const date = new Date(stringDate);

    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();

    return `${month}.${day}.${year}`;
};
