import { Lightbulb } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useT } from "@/lib/i18n";

const videoTips = [
  "hook",
  "oneIdea",
  "captions",
  "pacing",
  "safeArea",
  "loudness",
].map((k) => `ui.tips.video.${k}`);
const techniques = ["thirds", "shots", "jl", "broll", "colour", "audio"].map(
  (k) => `ui.tips.technique.${k}`,
);

function List({ items }: { items: string[] }) {
  const t = useT();
  return (
    <dl className="space-y-3 text-sm">
      {items.map((key) => (
        <div key={key}>
          <dt className="font-medium">{t(`${key}.term`)}</dt>
          <dd className="text-muted-foreground">{t(`${key}.text`)}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function Tips() {
  const t = useT();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb aria-hidden="true" className="size-4" />
          {t("ui.tips.title")}
        </CardTitle>
        <CardDescription>{t("ui.tips.lead")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="video">
          <TabsList>
            <TabsTrigger value="video">{t("ui.tips.videoTab")}</TabsTrigger>
            <TabsTrigger value="technique">
              {t("ui.tips.techniqueTab")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="video" className="mt-4">
            <List items={videoTips} />
          </TabsContent>
          <TabsContent value="technique" className="mt-4">
            <List items={techniques} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
