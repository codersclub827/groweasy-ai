import { Bot } from "lucide-react";

import { FeaturePage } from "@/components/common/feature-page";

export default function MappingPage() {
  return (
    <FeaturePage
      badge="AI mapping center"
      title="AI Mapping"
      description="Review CRM field matching, mapping confidence, skipped rows, and normalization results."
      icon={Bot}
      cards={[
        {
          title: "Mapped fields",
          value: "16",
          description: "CRM fields available for contact imports."
        },
        {
          title: "Avg. confidence",
          value: "96%",
          description: "Estimated quality across mapped rows."
        },
        {
          title: "Needs review",
          value: "3",
          description: "Mappings with low confidence or missing data."
        }
      ]}
    />
  );
}
