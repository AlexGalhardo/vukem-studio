import { Head, usePage } from "@inertiajs/react";
import { ArrowRight, Captions, LockKeyhole, Video, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import type { SharedProps } from "@/types";

const steps = [
  { icon: Wand2, text: "ui.login.step1" },
  { icon: Captions, text: "ui.login.step2" },
  { icon: Video, text: "ui.login.step3" },
];

export default function Login() {
  const t = useT();
  const error = usePage<SharedProps>().flash?.error;

  return (
    <>
      <Head title={t("ui.login.title")} />
      <div className="grid min-h-dvh bg-background lg:grid-cols-2">
        <section className="relative hidden flex-col justify-between overflow-hidden border-r bg-[#0d0b1e] p-14 text-white lg:flex">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(129,140,248,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(129,140,248,.05)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="relative flex items-center gap-3">
            <Video aria-hidden="true" className="text-indigo-300" />
            <span className="text-2xl font-semibold tracking-tight">
              Studio<span className="text-indigo-300">.</span>
            </span>
          </div>
          <div className="relative max-w-lg">
            <p className="mb-5 text-xs tracking-[.3em] text-indigo-300 uppercase">{t("ui.login.kicker")}</p>
            <h1 className="text-5xl leading-[1.12] font-medium tracking-tight xl:text-6xl">
              {t("ui.login.headline")} <span className="text-indigo-300">{t("ui.login.headlineAccent")}</span>
            </h1>
            <p className="mt-7 max-w-md text-base leading-relaxed text-zinc-300">
              {t("ui.login.pitch")}
            </p>
            <ol className="mt-10 space-y-4 text-sm text-zinc-300">
              {steps.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <Icon aria-hidden="true" className="size-4 shrink-0 text-indigo-300" />
                  {t(text)}
                </li>
              ))}
            </ol>
          </div>
          <p className="relative text-[11px] text-zinc-400 uppercase">{t("ui.login.restricted")}</p>
        </section>
        <main className="flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <div className="mb-10 flex size-12 items-center justify-center rounded-2xl border bg-muted/40">
              <LockKeyhole aria-hidden="true" className="size-5 text-indigo-600 dark:text-indigo-300" />
            </div>
            <p className="text-xs tracking-widest text-muted-foreground uppercase">{t("ui.login.welcome")}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">{t("ui.login.heading")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t("ui.login.help")}
            </p>
            {typeof error === "string" ? (
              <p role="alert" className="mt-6 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <Button asChild className="mt-8 h-12 w-full">
              <a href="/auth/google/redirect">
                <svg viewBox="0 0 24 24" className="mr-2 size-4" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M21.6 12.2c0-.7-.1-1.5-.2-2.2H12v4.2h5.4c-.3 1.3-1 2.3-2 2.9v2.4h3.2c1.9-1.7 3-4.2 3-7.3ZM12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.4c-.9.6-2 .9-3.4.9-2.6 0-4.9-1.8-5.7-4.2H3v2.5C4.6 19.7 8 22 12 22ZM6.3 13.9A6 6 0 0 1 6 12c0-.7.1-1.3.3-1.9V7.6H3A10 10 0 0 0 2 12c0 1.6.4 3.1 1 4.4l3.3-2.5ZM12 5.9c1.5 0 2.8.5 3.9 1.5l2.9-2.9A10 10 0 0 0 12 2c-4 0-7.4 2.3-9 5.6l3.3 2.5c.8-2.4 3.1-4.2 5.7-4.2Z"
                  />
                </svg>
                {t("ui.login.google")}
                <ArrowRight aria-hidden="true" className="ml-auto size-4" />
              </a>
            </Button>
          </div>
        </main>
      </div>
    </>
  );
}
