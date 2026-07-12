import { FileSpreadsheet } from "lucide-react";

import { FeaturePage } from "@/components/common/feature-page";

export default function LibraryPage() {
  return (
    <FeaturePage
      badge="CSV asset center"
      title="CSV Library"
      description="Browse uploaded CSV files, review import history, and prepare datasets for future processing."
      icon={FileSpreadsheet}
      cards={[
        {
          title: "Files",
          value: "24",
          description: "CSV files available in the workspace."
        },
        {
          title: "Reviewed",
          value: "18",
          description: "Datasets checked and ready for mapping."
        },
        {
          title: "Archived",
          value: "6",
          description: "Older imports kept for audit history."
        }
      ]}
    />
  );
}
