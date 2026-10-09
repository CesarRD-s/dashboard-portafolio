'use client'

import { createContext, useContext, useState, ReactNode } from "react"
import { ConfirmModal } from "./ConfirModal"
import { useToast } from "@/app/components/toast/toast.provider"

type ConfirmOptions = {
    title: string
    description?: string
    confirmText?: string
    cancelText?: string
    variant?: "default" | "danger" | "success" | "warning"
    action: () => Promise<boolean | void> | boolean | void
}

type ConfirmContextType = {
    confirm: (options: ConfirmOptions) => void
}

const ConfirmContext = createContext<ConfirmContextType | null>(null)

export function ConfirmProvider({ children }: { children: ReactNode }) {
    const { showToast } = useToast()
    const [options, setOptions] = useState<ConfirmOptions | null>(null)
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const confirm = (opts: ConfirmOptions) => {
        setOptions(opts)
        setOpen(true)
    }

    const handleClose = () => {
        if (loading) return
        setOpen(false)
    }

    const handleConfirm = async () => {
        if (!options) return

        try {
            setLoading(true)
            const result = await options.action()
            if (result !== false) setOpen(false)
        } catch (error) {
            console.error('Error al confirmar la acción', error)
            showToast({ type: 'error', message: 'No se pudo completar la acción. Inténtalo de nuevo.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}

            {options && (
                <ConfirmModal
                    open={open}
                    title={options.title}
                    description={options.description}
                    confirmText={options.confirmText}
                    cancelText={options.cancelText}
                    variant={options.variant}
                    loading={loading}
                    onConfirm={handleConfirm}
                    onClose={handleClose}
                />
            )}
        </ConfirmContext.Provider>
    )
}

export function useConfirm() {
    const ctx = useContext(ConfirmContext)
    if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider")
    return ctx.confirm
}
