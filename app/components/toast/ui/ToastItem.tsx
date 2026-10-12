import { useEffect, useState } from "react";
import { XIcon, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useToast } from "../toast.provider";
import { Toast } from "../toast.type";
import clsx from "clsx";

const variantStyles = {
    success: {
        border: "border-emerald-400 dark:border-emerald-700",
        icon: "text-emerald-700 dark:text-emerald-300",
    },
    error: {
        border: "border-red-400 dark:border-red-700",
        icon: "text-red-700 dark:text-red-300",
    },
    info: {
        border: "border-blue-400 dark:border-blue-700",
        icon: "text-blue-700 dark:text-blue-300",
    },
    warning: {
        border: "border-amber-400 dark:border-amber-700",
        icon: "text-amber-800 dark:text-amber-300",
    },
};

const icons = {
    success: <CheckCircle size={18} />,
    error: <AlertCircle size={18} />,
    info: <Info size={18} />,
    warning: <AlertCircle size={18} />,
};

export const ToastItem = ({ toast }: { toast: Toast }) => {
    const { closeToast, pauseToast, resumeToast } = useToast();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setVisible(true);
        });

        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <div
            onMouseEnter={() => pauseToast(toast.id)}
            onMouseLeave={() => resumeToast(toast.id)}
            role={toast.type === "error" || toast.type === "warning" ? "alert" : "status"}
            aria-live={toast.type === "error" || toast.type === "warning" ? "assertive" : "polite"}
            className={clsx(
                "group relative flex w-full max-w-sm items-start gap-3 rounded-md border bg-white px-5 py-4 shadow-lg transition duration-300 dark:bg-neutral-900",
                variantStyles[toast.type].border,
                toast.closing
                    ? "opacity-0 translate-y-2 scale-95"
                    : visible
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 -translate-y-2 scale-95")}
        >

            {/* ICON */}
            <div className={clsx("mt-0.5 shrink-0", variantStyles[toast.type].icon)}>
                {icons[toast.type]}
            </div>

            {/* CONTENT */}
            <div className="min-w-0 flex-1">
                {toast.title && (
                    <p className="text-sm font-semibold text-neutral-950 dark:text-white">
                        {toast.title}
                    </p>
                )}
                {toast.message && (
                    <p className={clsx(
                        "text-sm leading-5 text-neutral-800 dark:text-neutral-100",
                        toast.title && "mt-0.5",
                    )}>
                        {toast.message}
                    </p>
                )}

                {toast.action && (
                    <button
                        onClick={toast.action.onClick}
                        className="mt-2 cursor-pointer text-sm font-semibold text-blue-800 hover:underline dark:text-blue-200"
                    >
                        {toast.action.label}
                    </button>
                )}
            </div>

            {/* CLOSE */}
            <button
                onClick={() => closeToast(toast.id)}
                type="button"
                aria-label="Cerrar aviso"
                className="-mr-1 -mt-1 shrink-0 cursor-pointer rounded p-1 text-neutral-600 transition hover:bg-black/5 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
                <XIcon size={16} />
            </button>
        </div>
    );
};
