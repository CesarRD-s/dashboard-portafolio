function convertKeys(value: unknown, convertKey: (key: string) => string): unknown {
    if (Array.isArray(value)) return value.map(item => convertKeys(item, convertKey));

    if (value === null || typeof value !== 'object') return value;

    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) return value;

    return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [convertKey(key), convertKeys(item, convertKey)]),
    );
}

export function toCamelCase(value: unknown): unknown {
    return convertKeys(value, key => key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase()));
}

export function toSnakeCase<T>(value: T): T {
    return convertKeys(value, key => key.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()) as T;
}
