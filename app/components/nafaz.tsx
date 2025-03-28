import { useState } from "react";
import { Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
interface NafadAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string;
  initialUsername?: string;
  initialPassword?: string;
  initialAuthCode?: string;
  onUpdate?: () => void;
}

export function NafadAuthDialog({
  open,
  onOpenChange,
  documentId,
  initialUsername,
  initialPassword,
  initialAuthCode,
  onUpdate,
}: NafadAuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-white dark:bg-gray-800 border-0 shadow-2xl max-w-md rounded-xl"
        dir="rtl"
      >
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-transparent bg-clip-text flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" />
            إدارة بيانات نفاذ
          </DialogTitle>
          <DialogDescription>
            عرض وتحديث بيانات تسجيل الدخول لنظام نفاذ
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <NafadAuthForm
            documentId={documentId}
            initialUsername={initialUsername}
            initialPassword={initialPassword}
            initialAuthCode={initialAuthCode}
            onUpdate={() => {
              if (onUpdate) onUpdate();
              // Keep the dialog open to show the updated values
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
