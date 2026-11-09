import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";

import FieldTip from "@/components/FieldTip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useT } from "@/lib/i18n";

interface Props {
  styles: string[];
  ratios: string[];
}

export default function BriefForm({ styles, ratios }: Props) {
  const t = useT();
  const form = useForm({
    goal: "",
    audience: "",
    subject: "",
    duration: "6",
    ratio: "9:16",
    style_skill: styles[0] ?? "traco-simples",
    language: "en",
    facts: "",
    links: "",
    call_to_action: "",
    voice: "none",
    music_license: "",
    voice_file: null as File | null,
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    form.post("/jobs", { forceFormData: true });
  };

  const err = (name: keyof typeof form.data) => form.errors[name];
  const bind = (name: Exclude<keyof typeof form.data, "voice_file">) => ({
    id: name,
    value: form.data[name],
    "aria-invalid": err(name) ? true : undefined,
    "aria-describedby": err(name) ? `${name}-error` : undefined,
    onChange: (e: { target: { value: string } }) =>
      form.setData(name, e.target.value),
  });

  const choose = (
    name: "ratio" | "style_skill" | "voice",
    options: { value: string; label: string }[],
  ) => (
    <Select
      value={form.data[name]}
      onValueChange={(value) => form.setData(name, value)}
    >
      <SelectTrigger
        id={name}
        className="w-full"
        aria-invalid={err(name) ? true : undefined}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <form onSubmit={submit} className="space-y-5">
      <FieldTip
        id="goal"
        label={t("ui.brief.goal")}
        tip={t("ui.brief.tips.goal")}
        error={err("goal")}
      >
        <Input
          {...bind("goal")}
          placeholder={t("ui.brief.placeholders.goal")}
        />
      </FieldTip>
      <FieldTip
        id="audience"
        label={t("ui.brief.audience")}
        tip={t("ui.brief.tips.audience")}
        error={err("audience")}
      >
        <Input
          {...bind("audience")}
          placeholder={t("ui.brief.placeholders.audience")}
        />
      </FieldTip>
      <FieldTip
        id="subject"
        label={t("ui.brief.subject")}
        tip={t("ui.brief.tips.subject")}
        error={err("subject")}
      >
        <Input
          {...bind("subject")}
          placeholder={t("ui.brief.placeholders.subject")}
        />
      </FieldTip>
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldTip
          id="duration"
          label={t("ui.brief.duration")}
          tip={t("ui.brief.tips.duration")}
          error={err("duration")}
        >
          <Input {...bind("duration")} type="number" min={5} max={300} />
        </FieldTip>
        <FieldTip
          id="ratio"
          label={t("ui.brief.ratio")}
          tip={t("ui.brief.tips.ratio")}
          error={err("ratio")}
        >
          {choose(
            "ratio",
            ratios.map((r) => ({ value: r, label: r })),
          )}
        </FieldTip>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldTip
          id="style_skill"
          label={t("ui.brief.style")}
          tip={t("ui.brief.tips.style")}
          error={err("style_skill")}
        >
          {choose(
            "style_skill",
            styles.map((s) => ({ value: s, label: s })),
          )}
        </FieldTip>
        <FieldTip
          id="language"
          label={t("ui.brief.language")}
          tip={t("ui.brief.tips.language")}
          error={err("language")}
        >
          <Input
            {...bind("language")}
            placeholder={t("ui.brief.placeholders.language")}
          />
        </FieldTip>
      </div>
      <FieldTip
        id="facts"
        label={t("ui.brief.facts")}
        tip={t("ui.brief.tips.facts")}
        error={err("facts")}
      >
        <Textarea
          {...bind("facts")}
          rows={4}
          placeholder={t("ui.brief.placeholders.facts")}
        />
      </FieldTip>
      <FieldTip
        id="links"
        label={t("ui.brief.links")}
        tip={t("ui.brief.tips.links")}
        error={err("links")}
      >
        <Textarea
          {...bind("links")}
          rows={2}
          placeholder={t("ui.brief.placeholders.links")}
        />
      </FieldTip>
      <FieldTip
        id="call_to_action"
        label={t("ui.brief.cta")}
        tip={t("ui.brief.tips.cta")}
        error={err("call_to_action")}
      >
        <Input
          {...bind("call_to_action")}
          placeholder={t("ui.brief.placeholders.cta")}
        />
      </FieldTip>
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldTip
          id="voice"
          label={t("ui.brief.voice")}
          tip={t("ui.brief.tips.voice")}
          error={err("voice")}
        >
          {choose("voice", [
            { value: "none", label: t("ui.brief.voiceNone") },
            { value: "tts", label: t("ui.brief.voiceTts") },
            { value: "upload", label: t("ui.brief.voiceUpload") },
          ])}
        </FieldTip>
        <FieldTip
          id="music_license"
          label={t("ui.brief.music")}
          tip={t("ui.brief.tips.music")}
          error={err("music_license")}
        >
          <Input
            {...bind("music_license")}
            placeholder={t("ui.brief.placeholders.music")}
          />
        </FieldTip>
      </div>
      {form.data.voice === "upload" ? (
        <FieldTip
          id="voice_file"
          label={t("ui.brief.voiceFile")}
          tip={t("ui.brief.tips.voiceFile")}
          error={err("voice_file")}
        >
          <Input
            id="voice_file"
            type="file"
            accept="audio/wav,audio/wave,.wav"
            onChange={(e) =>
              form.setData("voice_file", e.target.files?.[0] ?? null)
            }
          />
        </FieldTip>
      ) : null}
      <Button type="submit" disabled={form.processing}>
        {t("ui.brief.render")}
      </Button>
    </form>
  );
}
