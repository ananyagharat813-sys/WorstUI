// ═══════════════════════════════════════════════════════════════
// MAYBE™ Notification Engine
// Toast notification system with personality
// ═══════════════════════════════════════════════════════════════

export interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'rage' | 'easter_egg' | 'achievement' | 'match';
  duration: number;
  timestamp: number;
}

type ToastListener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
let listeners: ToastListener[] = [];

function notify() {
  listeners.forEach((l) => l([...toasts]));
}

export const NotificationEngine = {
  show(
    message: string,
    type: Toast['type'] = 'info',
    duration: number = 3000
  ): string {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const toast: Toast = { id, message, type, duration, timestamp: Date.now() };
    toasts.push(toast);
    notify();

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    return id;
  },

  dismiss(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  },

  dismissAll() {
    toasts = [];
    notify();
  },

  subscribe(listener: ToastListener): () => void {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },

  getActive(): Toast[] {
    return [...toasts];
  },

  // Convenience methods
  info(message: string, duration?: number) {
    return this.show(message, 'info', duration);
  },

  success(message: string, duration?: number) {
    return this.show(message, 'success', duration);
  },

  rage(message: string, duration?: number) {
    return this.show(message, 'rage', duration || 4000);
  },

  achievement(message: string) {
    return this.show(message, 'achievement', 5000);
  },

  easterEgg(message: string) {
    return this.show(message, 'easter_egg', 5000);
  },

  matchNotification(message: string) {
    return this.show(message, 'match', 4000);
  },
};
