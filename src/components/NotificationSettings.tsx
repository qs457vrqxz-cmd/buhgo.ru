"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Bell,
  BellOff,
  FileText,
  MessageSquare,
  Clock,
  AlertCircle,
  Gift,
  Moon,
  CheckCircle2,
  XCircle,
  Loader2,
  Send,
} from "lucide-react";
import {
  isPushSupported,
  getPermissionStatus,
  requestPermission,
  subscribe,
  unsubscribe,
  getSubscription,
  getPreferences,
  savePreferences,
  showLocalNotification,
  initializePushNotifications,
  type NotificationPreferences,
} from "@/lib/push-notifications";

export function NotificationSettings() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enabled: true,
    documents: true,
    messages: true,
    reminders: true,
    statusUpdates: true,
    promo: false,
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
  });

  // Load initial state
  useEffect(() => {
    const init = async () => {
      const supported = isPushSupported();
      setIsSupported(supported);

      if (supported) {
        setPermission(getPermissionStatus());
        const subscription = await getSubscription();
        setIsSubscribed(!!subscription);
        setPreferences(getPreferences());
      }

      setIsLoading(false);
    };

    init();
  }, []);

  // Handle subscribe/unsubscribe
  const handleToggleSubscription = useCallback(async () => {
    setIsSubscribing(true);

    try {
      if (isSubscribed) {
        const success = await unsubscribe();
        if (success) {
          setIsSubscribed(false);
          toast.success('Уведомления отключены');
        }
      } else {
        const subscription = await subscribe();
        if (subscription) {
          setIsSubscribed(true);
          setPermission('granted');
          toast.success('Уведомления включены!');

          // Show welcome notification
          setTimeout(() => {
            showLocalNotification('Уведомления включены', {
              body: 'Теперь вы будете получать важные уведомления от BuhGo',
              type: 'system',
            });
          }, 1000);
        }
      }
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message === 'Notification permission denied') {
        toast.error('Вы заблокировали уведомления в браузере. Разрешите их в настройках.');
        setPermission('denied');
      } else {
        toast.error('Ошибка при настройке уведомлений');
      }
    } finally {
      setIsSubscribing(false);
    }
  }, [isSubscribed]);

  // Handle preference changes
  const handlePreferenceChange = useCallback((key: keyof NotificationPreferences, value: boolean | string) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    savePreferences(updated);
  }, [preferences]);

  // Send test notification
  const handleTestNotification = useCallback(async () => {
    if (!isSubscribed) {
      toast.error('Сначала включите уведомления');
      return;
    }

    await showLocalNotification('Тестовое уведомление', {
      body: 'Это тестовое уведомление от BuhGo. Всё работает!',
      type: 'system',
      url: '/dashboard',
    });

    toast.success('Тестовое уведомление отправлено');
  }, [isSubscribed]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground mt-2">Загрузка настроек...</p>
        </CardContent>
      </Card>
    );
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Push-уведомления
          </CardTitle>
          <CardDescription>
            Ваш браузер не поддерживает push-уведомления
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Для получения уведомлений используйте современный браузер (Chrome, Firefox, Edge)
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Push-уведомления
            </CardTitle>
            <CardDescription>
              Получайте уведомления о новых документах и сообщениях
            </CardDescription>
          </div>
          {permission === 'granted' && isSubscribed && (
            <Badge className="bg-green-100 text-green-800">Активно</Badge>
          )}
          {permission === 'denied' && (
            <Badge variant="destructive">Заблокировано</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main toggle */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            {isSubscribed ? (
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <BellOff className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div>
              <p className="font-medium">
                {isSubscribed ? 'Уведомления включены' : 'Уведомления выключены'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isSubscribed
                  ? 'Вы будете получать уведомления на это устройство'
                  : 'Включите, чтобы не пропустить важное'
                }
              </p>
            </div>
          </div>
          <Button
            onClick={handleToggleSubscription}
            disabled={isSubscribing || permission === 'denied'}
            variant={isSubscribed ? 'outline' : 'default'}
          >
            {isSubscribing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSubscribed ? (
              'Выключить'
            ) : (
              'Включить'
            )}
          </Button>
        </div>

        {permission === 'denied' && (
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Уведомления заблокированы</p>
              <p className="text-sm text-red-700 mt-1">
                Вы заблокировали уведомления для этого сайта. Чтобы их включить,
                нажмите на иконку замка в адресной строке браузера и разрешите уведомления.
              </p>
            </div>
          </div>
        )}

        {/* Notification types */}
        {isSubscribed && (
          <>
            <div className="space-y-4">
              <h3 className="font-medium">Типы уведомлений</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="documents">Новые документы</Label>
                  </div>
                  <Switch
                    id="documents"
                    checked={preferences.documents}
                    onCheckedChange={(checked) => handlePreferenceChange('documents', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="messages">Сообщения</Label>
                  </div>
                  <Switch
                    id="messages"
                    checked={preferences.messages}
                    onCheckedChange={(checked) => handlePreferenceChange('messages', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="reminders">Напоминания</Label>
                  </div>
                  <Switch
                    id="reminders"
                    checked={preferences.reminders}
                    onCheckedChange={(checked) => handlePreferenceChange('reminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="statusUpdates">Изменения статусов</Label>
                  </div>
                  <Switch
                    id="statusUpdates"
                    checked={preferences.statusUpdates}
                    onCheckedChange={(checked) => handlePreferenceChange('statusUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Gift className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="promo">Акции и новости</Label>
                  </div>
                  <Switch
                    id="promo"
                    checked={preferences.promo}
                    onCheckedChange={(checked) => handlePreferenceChange('promo', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Quiet hours */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="quietHours">Тихие часы</Label>
                    <p className="text-xs text-muted-foreground">
                      Не беспокоить в указанное время
                    </p>
                  </div>
                </div>
                <Switch
                  id="quietHours"
                  checked={preferences.quietHoursEnabled}
                  onCheckedChange={(checked) => handlePreferenceChange('quietHoursEnabled', checked)}
                />
              </div>

              {preferences.quietHoursEnabled && (
                <div className="flex items-center gap-4 pl-7">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="quietStart" className="text-sm">С</Label>
                    <Input
                      id="quietStart"
                      type="time"
                      value={preferences.quietHoursStart}
                      onChange={(e) => handlePreferenceChange('quietHoursStart', e.target.value)}
                      className="w-28"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="quietEnd" className="text-sm">До</Label>
                    <Input
                      id="quietEnd"
                      type="time"
                      value={preferences.quietHoursEnd}
                      onChange={(e) => handlePreferenceChange('quietHoursEnd', e.target.value)}
                      className="w-28"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Test notification */}
            <div className="pt-4 border-t">
              <Button variant="outline" onClick={handleTestNotification} className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Отправить тестовое уведомление
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
