import { readFile, mkdir, copyFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
const output = "storage/marketing/output";
const delivery = "films/vukem-launch/deliverables";
await mkdir(delivery, { recursive: true });
for (const format of ["horizontal", "vertical"]) {
  const filename = `vukem-launch-${format}.mp4`;
  const qa = JSON.parse(await readFile(`${output}/${format}-qa.json`, "utf8"));
  const data = await readFile(`${output}/${filename}`);
  if (createHash("sha256").update(data).digest("hex") !== qa.sha256)
    throw Error(`QA report does not match ${filename}`);
  if (!qa.faststart || !qa.fullDecode) throw Error("Incomplete media QA");
  await copyFile(`${output}/${filename}`, `${delivery}/${filename}`);
  await copyFile(
    `${output}/${format}-qa.json`,
    `${delivery}/${format}-qa.json`,
  );
  await copyFile(
    `${output}/${filename}.source.json`,
    `${delivery}/${format}-source.json`,
  );
}
const scenes = JSON.parse(await readFile("scripts/film/scenes.json", "utf8"));
const stamp = (n) =>
  `00:${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}.000`;
let cursor = 0;
const cues = scenes.map((s) => {
  const seconds = Number(s.seconds) > 0 ? Number(s.seconds) : 8;
  const start = cursor;
  cursor += seconds;
  return `${stamp(start)} --> ${stamp(cursor)}\n${s.title.replaceAll("\n", " ")}\n${s.sub.replaceAll("\n", " ")}`;
});
await writeFile(
  `${delivery}/vukem-launch.vtt`,
  "WEBVTT\n\n" + cues.join("\n\n") + "\n",
);
execFileSync(
  process.env.FFMPEG || "ffmpeg",
  [
    "-y",
    "-v",
    "error",
    "-ss",
    "102",
    "-i",
    `${delivery}/vukem-launch-horizontal.mp4`,
    "-frames:v",
    "1",
    `${delivery}/vukem-launch-poster.jpg`,
  ],
  { timeout: 60000 },
);
console.log("Packaged verified launch films", delivery);
