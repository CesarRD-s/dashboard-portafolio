import { forwardRef, TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    error?: boolean;
};

const baseStyles =
    "w-full px-3 py-2 rounded-md text-sm " +
    "bg-white dark:bg-neutral-800 " +
    "text-neutral-900 dark:text-white " +
    "placeholder:text-neutral-400 dark:placeholder:text-neutral-500 " +
    "border border-neutral-300 dark:border-neutral-700 " +
    "transition duration focus:outline-none focus:ring-2 focus:ring-blue-600/75";

const errorStyles =
    "border-red-500 focus:border-blue-600";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
    { error, className = "", ...props }, ref
) {
    return (
        <textarea
            ref={ref}
            className={`${baseStyles} ${error ? errorStyles : ""} ${className}`}
            {...props}
        />
    );
});
