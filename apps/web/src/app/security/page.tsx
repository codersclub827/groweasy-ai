import { ShieldCheck } from "lucide-react";

import { FeaturePage } from "@/components/common/feature-page";

export default function SecurityPage() {
  return (
    <FeaturePage
      badge="Workspace protection"
      title="Security"
      description="Review import controls, API configuration, validation safeguards, and access readiness."
      icon={ShieldCheck}
      cards={[
        {
          title: "Validation",
          value: "Active",
          description: "CSV and API payload validation is enabled."
        },
        {
          title: "CORS",
          value: "Scoped",
          description: "Backend accepts configured frontend origins."
        },
        {
          title: "AI key",
          value: "Env only",
          description: "Gemini credentials are read from server environment variables."
        }
      ]}
    />
  );
}
