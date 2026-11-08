import { Lightbulb } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const videoTips = [
  ["Hook in 2-3 seconds", "Open on the payoff, a question or motion. No logo, no greeting."],
  ["One idea per video", "A single message and a single call to action at the end."],
  ["Captions for silent viewing", "Most people scroll with sound off. Keep lines short and high contrast."],
  ["Pace the cuts", "Change the picture every 2-4 seconds for fast content; hold longer to let a detail land."],
  ["Mind the safe area", "In 9:16, keep text and faces away from the top and bottom, where app buttons sit."],
  ["Loudness", "Master the mix near -14 LUFS (about -1 dBTP peak) so platforms do not turn you down."],
];

const techniques = [
  ["Rule of thirds", "Place the subject on a third line, not the centre; leave look room in the direction they face."],
  ["Wide, medium, close-up", "Wide sets the place, medium carries the action, close-up shows emotion or a detail. Mix them."],
  ["J and L cuts", "Let the audio of the next shot start before the picture (J) or the previous audio run over it (L). It smooths cuts."],
  ["B-roll", "Cover talking or text with relevant footage to hide jump cuts and show what you describe."],
  ["Colour consistency", "Use one look across shots: same white balance and contrast, a small palette."],
  ["Audio first", "Viewers forgive soft picture, not bad sound. Record close, cut silences, duck music under voice."],
];

function List({ items }: { items: string[][] }) {
  return (
    <dl className="space-y-3 text-sm">
      {items.map(([term, text]) => (
        <div key={term}>
          <dt className="font-medium">{term}</dt>
          <dd className="text-muted-foreground">{text}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function Tips() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb aria-hidden="true" className="size-4" />
          Tips
        </CardTitle>
        <CardDescription>Short rules for good short videos.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="video">
          <TabsList>
            <TabsTrigger value="video">Good videos</TabsTrigger>
            <TabsTrigger value="technique">Techniques</TabsTrigger>
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
