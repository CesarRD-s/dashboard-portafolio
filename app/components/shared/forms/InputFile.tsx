import clsx from "clsx";
import { CheckCircle, Upload } from "lucide-react";
import { ChangeEvent, useEffect, useId, useRef } from "react";

interface InputFileProps {
    id?: string;
    helperText?: string;
    accept?: string;
    file: File | null;
    onChange: (file: File | null) => void;
    disabled?: boolean;
}

export const InputFile = (
    { id, helperText = "Documentos, Imágenes", accept = "*", file, onChange, disabled = false }: InputFileProps
) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const generatedId = useId();

    const handleClick = () => {
        if (disabled) return;
        inputRef.current?.click();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] ?? null;
        if (!selectedFile) return;
        onChange(selectedFile);
    };

    useEffect(() => {
        if (!file && inputRef.current) {
            inputRef.current.value = "";
        }
    }, [file]);

    const isActive = !!file;

    return (
        <div className="flex flex-col gap-2">
            {/* DROPZONE */}
            <button
                type="button"
                onClick={handleClick}
                disabled={disabled}
                className={clsx("group flex flex-col items-center justify-center gap-3 px-4 py-6 rounded-md",
                    "border border-dashed text-center bg-white dark:bg-neutral-800 transition duration",
                    disabled ? "opacity-50 cursor-not-allowed" : "hover:border-blue-500 cursor-pointer",
                    isActive ? "border-blue-500" : "border-neutral-200 dark:border-neutral-700"
                )}
            >
                {/* ICON */}
                <div
                    className={clsx("w-12 h-12 rounded-md flex items-center justify-center transition duration",
                        isActive
                            ? "bg-blue-100 dark:bg-blue-500/20"
                            : "bg-neutral-100 dark:bg-neutral-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20"
                    )}
                >
                    {isActive ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                        <Upload className="w-6 h-6 text-neutral-500 group-hover:text-blue-600" />
                    )}
                </div>

                {/* TEXT */}
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        {isActive
                            ? "Archivo cargado"
                            : "Haz clic para subir archivo"}
                    </span>

                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {isActive ? file.name : helperText}
                    </span>
                </div>
            </button>

            {/* INPUT */}
            <input
                id={id ?? generatedId}
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleChange}
                className="hidden"
            />
        </div>
    );
};
