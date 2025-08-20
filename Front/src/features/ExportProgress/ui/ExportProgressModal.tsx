"use client";

import React from "react";
import Dialog from "@/shared/ui/atoms/Dialog/ui/Dialog";
import Button from "@/shared/ui/atoms/Button/ui/Button";

interface ExportProgressModalProps {
  open: boolean;
  onClose: () => void;
  progress: number;
  status: "idle" | "exporting" | "completed" | "error";
  error?: string;
  outputPath?: string;
  cancel: () => void;
}

export default function ExportProgressModal({
  open,
  onClose,
  progress,
  status,
  error,
  outputPath,
  cancel,
}: ExportProgressModalProps) {
  const getStatusText = () => {
    switch (status) {
      case "exporting":
        return "Exporting...";
      case "completed":
        return "Export completed!";
      case "error":
        return "Export failed";
      default:
        return "Waiting...";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "exporting":
        return "text-blue-400";
      case "completed":
        return "text-green-400";
      case "error":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const handleCancel = async () => {
    await cancel();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title="Export Video">
      <div className="space-y-6">
        {/* Status Header */}
        <div className="flex items-center gap-3">
          {/* {getStatusIcon()} */}
          <div>
            <h3 className={`text-lg font-semibold ${getStatusColor()}`}>
              {getStatusText()}
            </h3>
            {/* {jobId && <p className="text-sm text-gray-400">Job ID: {jobId}</p>} */}
          </div>
        </div>

        {/* Progress Bar */}
        {status === "exporting" && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">진행률</span>
            <span className="text-white font-medium">{progress}%</span>
          </div>
        )}

        {/* Error Message */}
        {status === "error" && error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {status === "completed" && (
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
            <p className="text-green-300 text-sm">
              Video has been successfully created!
            </p>
            {outputPath && (
              <p className="text-gray-400 text-xs mt-2">
                File path: {outputPath}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex w-full">
          {(status === "error" || status === "completed") && (
            <Button onClick={onClose}>Close</Button>
          )}
          {status === "exporting" && (
            <div className="flex justify-between w-full ">
              <Button onClick={onClose}>Continue in background</Button>

              <Button onClick={handleCancel}>Cancel</Button>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
