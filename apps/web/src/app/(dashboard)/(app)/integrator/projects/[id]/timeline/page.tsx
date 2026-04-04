'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, History } from 'lucide-react';
import { ProjectTimeline } from '@/components/timeline/project-timeline';

export default function ProjectTimelinePage() {
  const { id } = useParams();
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                <History className="w-6 h-6 text-primary" /> Histórico do Projeto
            </h1>
            <p className="text-slate-500 font-medium tracking-tight">Timeline completa de eventos e mudanças de status.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <ProjectTimeline projectId={id as string} />
      </div>
    </div>
  );
}
