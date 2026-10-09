type FieldProps = {
    label: string;
    htmlFor?: string;
    children: React.ReactNode;
    hint?: string;
    error?: string;
};

export const Field = ({ label, htmlFor = "", children, hint, error }: FieldProps) => {
    return (
        <div className="flex flex-col gap-2">
            <label
                className="text-sm font-medium text-neutral-800 dark:text-neutral-200"
                htmlFor={htmlFor}
            >
                {label}
            </label>

            {children}

            {hint && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {hint}
                </span>
            )}

            {error && (
                <span className="text-xs text-red-600 dark:text-red-400" role="alert">
                    {error}
                </span>
            )}
        </div>
    );
};
