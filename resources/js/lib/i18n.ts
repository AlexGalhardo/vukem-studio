import { usePage } from "@inertiajs/react";

// Props shared by inertia.I18n("ui.") in routes/web.go (vukem.dev/docs/frontend/inertia-i18n).
export type Message = string | Record<string, string>;

export interface I18nProps {
  locale: string;
  locales: string[];
  messages: Record<string, Message>;
  [key: string]: unknown;
}

export type Translate = (
  key: string,
  params?: Record<string, string | number>,
) => string;

// translate fills {name} placeholders and picks plural forms; a missing key
// returns the key itself, as the server does, so a typo shows on screen.
export function translate(
  messages: Record<string, Message>,
  locale: string,
  key: string,
  params: Record<string, string | number> = {},
): string {
  let msg = messages[key];
  if (msg === undefined) return key;
  if (typeof msg !== "string") {
    const n = Number(params.count);
    const category = new Intl.PluralRules(locale).select(n);
    msg = (n === 0 && msg.zero) || msg[category] || msg.other || key;
  }
  return msg.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

export function useT(): Translate {
  const { messages = {}, locale = "en" } = usePage<I18nProps>().props;
  return (key, params = {}) => translate(messages, locale, key, params);
}
