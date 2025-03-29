"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PhoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification: any | null;
}

export function PhoneDialog({
  open,
  onOpenChange,
  notification,
}: PhoneDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!notification) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-white dark:bg-gray-800 border-0 shadow-2xl max-w-md rounded-xl"
        dir="rtl"
      >
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text">
            معلومات الهاتف
          </DialogTitle>
          <DialogDescription>
            تفاصيل معلومات الهاتف ورمز التحقق
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div className="p-5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col">
                <span className="text-xs text-blue-100 mb-1">صاحب الهاتف</span>
                <span className="font-medium">
                  {notification.full_name ||
                    notification.document_owner_full_name ||
                    "غير محدد"}
                </span>
              </div>
              <Phone className="h-8 w-8 text-white opacity-80" />
            </div>

            <div className="mb-4">
              <span className="text-xs text-blue-100 mb-1 block">
                رقم الهاتف
              </span>
              <span className="font-mono text-lg tracking-wider" dir="ltr">
                {notification.phone || notification.phone1 || "غير محدد"}
              </span>
            </div>

            <div className="flex justify-between">
              <div>
                <span className="text-xs text-blue-100 block">
                  شركة الاتصالات
                </span>
                <span className="font-mono">
                  {notification.operator || "غير محدد"}
                </span>
              </div>
              <div>
                <span className="text-xs text-blue-100 block">رمز التحقق</span>
                <span className="font-mono">
                  {notification.phoneOtp || "غير محدد"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
            <h3 className="font-medium mb-2 text-sm">معلومات إضافية</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">الحالة:</span>
                <Badge
                  variant={
                    notification.status === "approved"
                      ? "default"
                      : notification.status === "rejected"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {notification.status === "approved"
                    ? "مقبول"
                    : notification.status === "rejected"
                    ? "مرفوض"
                    : "قيد الانتظار"}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">الصفحة الحالية:</span>
                <span>{notification.pagename || "غير محدد"}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4 pt-3 border-t">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full"
            variant="outline"
          >
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
