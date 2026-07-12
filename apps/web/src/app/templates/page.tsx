import { Layers3 } from "lucide-react";

import { FeaturePage } from "@/components/common/feature-page";

export default function TemplatesPage() {
  return (
    <FeaturePage
      badge="Reusable import formats"
      title="Templates"
      description="Manage reusable CSV formats, CRM presets, and field-mapping templates."
      icon={Layers3}
      cards={[
        {
          title: "Templates",
          value: "8",
          description: "Reusable layouts for common CSV imports."
        },
        {
          title: "CRM presets",
          value: "5",
          description: "Saved mappings for frequent workflows."
        },
        {
          title: "Shared",
          value: "3",
          description: "Team-ready templates available to everyone."
        }
      ]}
    />
  );
}
