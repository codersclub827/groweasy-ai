import { BarChart3 } from "lucide-react";

import { FeaturePage } from "@/components/common/feature-page";

export default function AnalyticsPage() {
  return (
    <FeaturePage
      badge="Import intelligence"
      title="Analytics"
      description="Track import volume, success rate, skipped row reasons, and processing performance."
      icon={BarChart3}
      cards={[
        {
          title: "Success rate",
          value: "94%",
          description: "Rows imported successfully this month."
        },
        {
          title: "Rows processed",
          value: "842k",
          description: "Total rows validated and mapped."
        },
        {
          title: "Time saved",
          value: "312h",
          description: "Estimated manual cleanup avoided."
        }
      ]}
    />
  );
}
