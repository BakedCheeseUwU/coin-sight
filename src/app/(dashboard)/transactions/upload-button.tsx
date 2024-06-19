import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { useCSVReader } from "react-papaparse";

type Props = {
  onUpload: (results: any) => void;
};

export const UploadButton = ({ onUpload }: Props) => {
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader onUploadAccepted={onUpload}>
      {({ getRootProps }: any) => (
        <Button
          size="sm"
          className="w-full lg:w-auto bg-purple-700 hover:bg-purple-700/90"
          {...getRootProps()}
        >
          <UploadIcon className="size-4 mr-2" />
          Import
        </Button>
      )}
    </CSVReader>
  );
};
