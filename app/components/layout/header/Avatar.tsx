import { Profile } from "@/app/modules/profile/profile.model";
import Image from "next/image";
import { UserRound } from "lucide-react";

type Props = {
    profile: Profile | null;
};

export function Avatar({ profile }: Props) {
    return (
        <div className="relative h-9 w-9 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
            {profile?.avatarUrl ? (
                <Image
                    src={profile.avatarUrl}
                    alt="Avatar"
                    fill
                    sizes="36px"
                    className="object-cover"
                    priority
                />
            ) : (
                <UserRound aria-label="Sin avatar" className="absolute inset-1.5 h-6 w-6 text-neutral-500" />
            )}
        </div>
    );
}
