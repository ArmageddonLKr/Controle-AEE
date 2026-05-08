import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  iconClassName?: string;
}

export function StatCard({ icon: Icon, value, label, iconClassName }: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", iconClassName ?? "bg-sky-100")}>
            <Icon className={cn("h-6 w-6", iconClassName ? "text-white" : "text-sky-600")} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
