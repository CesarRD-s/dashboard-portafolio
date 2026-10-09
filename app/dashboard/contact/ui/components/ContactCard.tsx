import { Contact } from "@/app/modules/contacts/contact.model"
import { formatDate } from "date-fns/format";
import { Edit } from "lucide-react";
import Link from "next/link";
import { DeleteContactButton } from "./DeleteContactButton";

type Props = {
    contact: Contact
}

export function ContactCard({ contact }: Props) {
    return (
        <div className="p-5 rounded-md border border-neutral-300 dark:border-neutral-700 
        bg-white dark:bg-neutral-900/30 flex flex-col justify-between gap-4"
        >
            {/* TOP */}
            <div className="flex flex-col gap-3">

                {/* TITLE + TYPE */}
                <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-semibold line-clamp-2">
                        {contact.title}
                    </h2>

                    {contact.type && (
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border border-blue-500/75 text-blue-500">
                            {contact.type}
                        </span>
                    )}
                </div>

                {/* VALUE */}
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 break-all">
                    {contact.value}
                </p>

                {/* EXTRA */}
                <div className="flex items-center gap-4 flex-wrap">
                    {contact.isPrimary && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-neutral-700 text-white dark:bg-white/90 dark:text-neutral-900">
                            Principal
                        </span>
                    )}

                    {contact.linkUrl && (
                        <Link
                            href={contact.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                        >
                            Abrir enlace
                        </Link>
                    )}
                </div>
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-300 dark:border-neutral-700">
                <span className="text-xs text-neutral-500">
                    {formatDate(new Date(contact.createdAt), "dd MMM yyyy")}
                </span>

                <div className="flex items-center gap-4">
                    <Link
                        href={`/dashboard/contact/${contact.id}`}
                        className="text-sm font-medium text-blue-500/80 hover:underline"
                    >
                        <Edit size={14} className="inline-block mr-1" />
                        Editar
                    </Link>

                    <DeleteContactButton id={contact.id} value={contact.value} />
                </div>
            </div>
        </div>
    );
}
