// Thin wrapper around the browser Notification API. All calls are guarded so
// the app works even where notifications are unsupported or blocked.

export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function notificationPermission(): NotificationPermission {
  return notificationsSupported() ? Notification.permission : 'denied'
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!notificationsSupported()) return 'denied'
  if (Notification.permission !== 'default') return Notification.permission
  try {
    return await Notification.requestPermission()
  } catch {
    return 'denied'
  }
}

export function showNotification(title: string, body?: string): void {
  if (!notificationsSupported() || Notification.permission !== 'granted') return
  try {
    new Notification(title, { body, icon: 'favicon.svg' })
  } catch {
    /* Some browsers throw if constructed without a service worker — ignore. */
  }
}
