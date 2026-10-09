import { ArrowUp, Clock3 } from "lucide-react";
import { Section } from "@/app/components/layout/Section";
import { OverviewData } from "@/app/modules/profile/profile.model";
import { StatCard } from "./components/StatCard";
import { RecentActivity } from "./components/RecentActivity";
import { actions } from "./components/config";
import { ActionCard } from "./components/ActionCard";
import { Fragment } from "react/jsx-runtime";

type Props = {
    data: OverviewData;
};

export function DashboardView({ data }: Props) {
    const { stats, recentActivity } = data;

    return (
        <Section
            id="dashboard"
            title="Dashboard"
            description="Resumen general de tu portafolio"
        >
            <div className="space-y-6">

                {/* Stats */}
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat, index) => (
                        <StatCard
                            key={index}
                            title={stat.title}
                            count={stat.count}
                            description={stat.description}
                        />
                    ))}
                </div>

                {/* Recent Activity */}
                <div className="rounded-md p-6 space-y-5 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900/30">

                    <div className="flex items-center gap-2">
                        <Clock3
                            size={18}
                            className="text-blue-500"
                        />

                        <h2 className="text-md font-semibold">
                            Actividad reciente
                        </h2>
                    </div>

                    <div className="space-y-5">
                        {recentActivity.map((activity, index) => (
                            <Fragment key={`${activity.type}-${activity.id}`}>
                                <RecentActivity
                                    type={activity.type}
                                    title={activity.title}
                                    createdAt={activity.createdAt}
                                />

                                {index !== recentActivity.length - 1 && <div className="border-b border-neutral-300 dark:border-neutral-700" />}
                            </Fragment>
                        ))}
                        {recentActivity.length === 0 && <p className="text-sm text-neutral-500">Todavía no hay actividad.</p>}
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-5">

                    <div className="flex items-center gap-2">
                        <ArrowUp
                            size={18}
                            className="rotate-45 text-blue-500"
                        />

                        <h2 className="text-md font-semibold">
                            Acciones rápidas
                        </h2>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {actions.map((action) => (
                            <ActionCard
                                key={action.href}
                                href={action.href}
                                label={action.label}
                                description={action.description}
                                icon={action.icon}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </Section>
    );
}
