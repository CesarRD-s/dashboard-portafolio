import { ReactNode } from "react";
import { Spinner } from "../../ui/spinner/Spinner";

type Props = {
    className?: string;
    isValid?: boolean;
    loading?: boolean;
    text?: string;
    icon?: ReactNode;
}

export function ButtonSubmit(
    { className = "", isValid = false, loading = false, text = "Guardar", icon }: Props
) {
    return (
        <button
            type="submit"
            disabled={!isValid || loading}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium
                transition duration ${className}
                ${isValid && !loading
                    ? 'bg-blue-600 text-white hover:bg-blue-500 cursor-pointer'
                    : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'}`}
        >
            {loading ?
                <Spinner />
                : icon ?
                    <>
                        {icon}
                        {text}
                    </>
                    : text}
        </button>
    )
}
