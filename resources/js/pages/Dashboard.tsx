import { Head, Link, usePage } from "@inertiajs/react";

import BriefForm from "@/components/BriefForm";
import Tips from "@/components/Tips";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { JobListItem, SharedProps } from "@/types";

interface Props {
  jobs: JobListItem[];
  styles: string[];
  ratios: string[];
}

const statusVariant = (status: string) => (status === "ready" ? "default" : status === "failed" ? "destructive" : "secondary");

export default function Dashboard({ jobs, styles, ratios }: Props) {
  const user = usePage<SharedProps>().props.auth?.user;

  return (
    <>
      <Head title="Dashboard" />
      <h1 className="text-2xl font-semibold tracking-tight">Hello, {user?.name}</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
        The form is the brief. The server compiles the prompt, plans the cut and renders a file. A silent cut needs no API key.
      </p>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>New video</CardTitle>
            <CardDescription>Hover or focus the info icons for how to fill each field.</CardDescription>
          </CardHeader>
          <CardContent>
            <BriefForm styles={styles} ratios={ratios} />
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent videos</CardTitle>
              <CardDescription>
                <Link href="/jobs" className="underline-offset-4 hover:underline focus-visible:underline">
                  See all videos
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {jobs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No videos yet.</p>
              ) : (
                <ul className="divide-y">
                  {jobs.map((job) => (
                    <li key={job.id} className="flex items-center justify-between gap-3 py-2 text-sm first:pt-0 last:pb-0">
                      <Link href={`/jobs/${job.id}`} className="min-w-0 truncate underline-offset-4 hover:underline focus-visible:underline">
                        {job.subject}
                      </Link>
                      <Badge variant={statusVariant(job.status)}>{job.status}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          <Tips />
        </div>
      </div>
    </>
  );
}
