import { Toast } from "../toast.type";
import { ToastItem } from "./ToastItem";

interface Props {
    toasts: Toast[];
}

export const ToastContainer = ({ toasts }: Props) => {
    return (
        <div className="fixed bottom-4 left-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:left-auto sm:right-6 sm:w-full sm:max-w-sm">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} />
            ))}
        </div>
    );
};
