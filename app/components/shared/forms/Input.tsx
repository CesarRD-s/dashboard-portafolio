import { forwardRef, InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    id?: string;
    error?: boolean;
};

const baseStyles =
    "w-full px-3 py-2 rounded-md text-sm " +
    "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white " +
    "placeholder:text-neutral-400 dark:placeholder:text-neutral-500 " +
    "border border-neutral-300 dark:border-neutral-700 " +
    "transition duration focus:outline-none focus:ring-2 focus:ring-blue-600/75";

const errorStyles = "border-red-500 focus:border-blue-600";

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { id = "", error, className = "", ...props }, ref
) {
    return (
        <input
            ref={ref}
            id={id}
            name={id}
            className={`${baseStyles} ${error ? errorStyles : ""} ${className}`}
            {...props}
        />
    );
});
