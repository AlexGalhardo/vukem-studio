import { router, usePage } from "@inertiajs/react";
import { Languages } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type I18nProps, useT } from "@/lib/i18n";

// LocaleSwitcher posts the choice to /locale, which stores it in the lang
// cookie; preserveState keeps a half-filled brief while the page reloads.
export default function LocaleSwitcher({ className = "" }: { className?: string }) {
  const t = useT();
  const { locale, locales = [] } = usePage<I18nProps>().props;

  if (locales.length < 2) return null;

  return (
    <Select
      value={locale}
      onValueChange={(next) => router.post("/locale", { locale: next }, { preserveState: true, preserveScroll: true })}
    >
      <SelectTrigger size="sm" aria-label={t("ui.nav.language")} className={`w-auto gap-2 ${className}`}>
        <Languages aria-hidden="true" className="size-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" align="end">
        {locales.map((l) => (
          <SelectItem key={l} value={l}>
            {t(`ui.nav.languages.${l}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
