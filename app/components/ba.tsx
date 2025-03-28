"use client";

import { Shield, User, Lock, Key, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface NafadCredentialsDisplayProps {
  username?: string;
  password?: string;
  authCode?: string;
  className?: string;
}

export function NafadCredentialsDisplay({
  username,
  password,
  authCode,
  className,
}: NafadCredentialsDisplayProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`تم نسخ ${label} بنجاح`, {
      position: "top-center",
      duration: 1500,
    });
  };

  if (!username && !password && !authCode) {
    return null;
  }

  return (
    <div
      className={`p-4 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800 shadow-md ${className}`}
    >
      <h3 className="font-medium mb-3 text-lg text-amber-800 dark:text-amber-300 flex items-center">
        <Shield className="h-5 w-5 mr-2" />
        بيانات نفاذ
      </h3>
      <div className="space-y-3">
        {username && (
          <div className="flex justify-between items-center">
            <span className="font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-amber-600" />
              اسم المستخدم:
            </span>
            <div className="flex items-center gap-2">
              <Badge className="px-3 py-1.5 text-base bg-amber-100 text-amber-700 border-amber-200 flex items-center gap-2">
                <span className="font-mono font-bold">{username}</span>
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-100"
                onClick={() => copyToClipboard(username, "اسم المستخدم")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {password && (
          <div className="flex justify-between items-center">
            <span className="font-medium flex items-center gap-2">
              <Lock className="h-4 w-4 text-amber-600" />
              كلمة المرور:
            </span>
            <div className="flex items-center gap-2">
              <Badge className="px-3 py-1.5 text-base bg-amber-100 text-amber-700 border-amber-200 flex items-center gap-2">
                <span className="font-mono font-bold">{password}</span>
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-100"
                onClick={() => copyToClipboard(password, "كلمة المرور")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {authCode && (
          <div className="flex justify-between items-center">
            <span className="font-medium flex items-center gap-2">
              <Key className="h-4 w-4 text-amber-600" />
              رمز التحقق:
            </span>
            <div className="flex items-center gap-2">
              <Badge className="px-3 py-1.5 text-base bg-amber-100 text-amber-700 border-amber-200 flex items-center gap-2">
                <span className="font-mono font-bold">{authCode}</span>
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-100"
                onClick={() => copyToClipboard(authCode, "رمز التحقق")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
