import { Settings } from "lucide-react";

import { FeaturePage } from "@/components/common/feature-page";

export default function SettingsPage() {
  return (
    <FeaturePage
      badge="Configuration"
      title="Settings"
      description="Manage workspace defaults, import preferences, dashboard behavior, and deployment settings."
      icon={Settings}
      cards={[
        {
          title: "Workspace",
          value: "GrowEasy",
          description: "Primary importer workspace configuration."
        },
        {
          title: "Theme",
          value: "Adaptive",
          description: "Light and dark mode are supported."
        },
        {
          title: "API URL",
          value: "Configured",
          description: "Frontend reads API base URL from environment config."
        }
      ]}
    />
  );
}
