import { Info } from "lucide-react";
import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useT } from "@/lib/i18n";

interface Props {
  id: string;
  label: string;
  tip: string;
  error?: string;
  children: ReactNode;
}

// FieldTip is a labelled control with a keyboard-focusable tooltip button and
// its validation error. The button label avoids the field name so
// getByLabel(field) still finds exactly one control.
export default function FieldTip({ id, label, tip, error, children }: Props) {
  const t = useT();
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Label htmlFor={id}>{label}</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={t("ui.brief.showTip")}
              className="rounded-full text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <Info aria-hidden="true" className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-64 text-pretty">{tip}</TooltipContent>
        </Tooltip>
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
