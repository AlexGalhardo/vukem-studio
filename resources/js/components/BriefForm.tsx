import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";

import FieldTip from "@/components/FieldTip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  styles: string[];
  ratios: string[];
}

const tips = {
  goal: "What the viewer should think, feel or do after watching. One sentence, one outcome: \"Get neighbors to visit the Saturday market\".",
  audience: "Who watches, in plain words: \"parents of toddlers in Lisbon\". A specific audience sets the vocabulary, the pace and the hook.",
  subject: "The one thing the video is about, or the offer. If you need \"and\" twice, split it into two videos.",
  duration: "Length in seconds, 5 to 300. Short vertical videos hold attention best at 15 to 45 seconds; cut anything that does not earn its time.",
  ratio: "Frame shape. 9:16 for Reels, Shorts and TikTok (keep text and faces inside the safe area, away from the top and bottom UI). 1:1 and 4:5 for feeds, 16:9 for YouTube and the web.",
  style: "The visual recipe the planner follows: shot types, pacing and captions. Pick the one closest to the tone you want.",
  language: "Language of the voice and captions, as a code such as en or pt. Captions matter: most people watch with the sound off.",
  facts: "Claims the video must keep, one per line: prices, dates, names, numbers. The planner will not invent or change them.",
  links: "Pages with extra context, such as the product page or an article. They are references for you and the plan, not downloaded footage.",
  cta: "The single action at the end: \"Visit studio.example\". Say it once, say it plainly, and keep it on screen long enough to read.",
  voice: "Silent needs nothing and relies on captions. Local text to speech reads the script on this server. Upload a WAV to use your own recording.",
  music: "Name the license or source of the music bed, such as \"Pixabay 123\". Leave it empty to ship without music; never use tracks you cannot license.",
  voiceFile: "A WAV recording of the narration. Record in a quiet room, close to the microphone, and keep it close to the chosen duration.",
};

export default function BriefForm({ styles, ratios }: Props) {
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
    onChange: (e: { target: { value: string } }) => form.setData(name, e.target.value),
  });

  const choose = (name: "ratio" | "style_skill" | "voice", options: { value: string; label: string }[]) => (
    <Select value={form.data[name]} onValueChange={(value) => form.setData(name, value)}>
      <SelectTrigger id={name} className="w-full" aria-invalid={err(name) ? true : undefined}>
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
      <FieldTip id="goal" label="Goal" tip={tips.goal} error={err("goal")}>
        <Input {...bind("goal")} />
      </FieldTip>
      <FieldTip id="audience" label="Audience" tip={tips.audience} error={err("audience")}>
        <Input {...bind("audience")} />
      </FieldTip>
      <FieldTip id="subject" label="Offer or subject" tip={tips.subject} error={err("subject")}>
        <Input {...bind("subject")} />
      </FieldTip>
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldTip id="duration" label="Duration (seconds)" tip={tips.duration} error={err("duration")}>
          <Input {...bind("duration")} type="number" min={5} max={300} />
        </FieldTip>
        <FieldTip id="ratio" label="Aspect ratio" tip={tips.ratio} error={err("ratio")}>
          {choose("ratio", ratios.map((r) => ({ value: r, label: r })))}
        </FieldTip>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldTip id="style_skill" label="Style skill" tip={tips.style} error={err("style_skill")}>
          {choose("style_skill", styles.map((s) => ({ value: s, label: s })))}
        </FieldTip>
        <FieldTip id="language" label="Spoken language" tip={tips.language} error={err("language")}>
          <Input {...bind("language")} />
        </FieldTip>
      </div>
      <FieldTip id="facts" label="Must-keep facts" tip={tips.facts} error={err("facts")}>
        <Textarea {...bind("facts")} rows={4} placeholder="One fact per line" />
      </FieldTip>
      <FieldTip id="links" label="Reference links" tip={tips.links} error={err("links")}>
        <Textarea {...bind("links")} rows={2} />
      </FieldTip>
      <FieldTip id="call_to_action" label="Call to action" tip={tips.cta} error={err("call_to_action")}>
        <Input {...bind("call_to_action")} />
      </FieldTip>
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldTip id="voice" label="Voice" tip={tips.voice} error={err("voice")}>
          {choose("voice", [
            { value: "none", label: "Silent" },
            { value: "tts", label: "Local text to speech" },
            { value: "upload", label: "Upload a WAV" },
          ])}
        </FieldTip>
        <FieldTip id="music_license" label="Music license" tip={tips.music} error={err("music_license")}>
          <Input {...bind("music_license")} placeholder="Leave empty to ship without a bed" />
        </FieldTip>
      </div>
      {form.data.voice === "upload" ? (
        <FieldTip id="voice_file" label="Voice recording (WAV)" tip={tips.voiceFile} error={err("voice_file")}>
          <Input
            id="voice_file"
            type="file"
            accept="audio/wav,audio/wave,.wav"
            onChange={(e) => form.setData("voice_file", e.target.files?.[0] ?? null)}
          />
        </FieldTip>
      ) : null}
      <Button type="submit" disabled={form.processing}>
        Render
      </Button>
    </form>
  );
}
