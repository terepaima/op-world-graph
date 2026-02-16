'use client';

import ControlsPanelContainer from '@/components/layout/ControlsPanelContainer';
import DetailsPanelContainer from '@/components/layout/DetailsPanelContainer';
import GraphStage from '@/components/layout/GraphStage';
import { useState } from 'react';

export default function Home() {
  const [detailsPanelsOpen, setDetailsPanelsOpen] = useState(true);
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <GraphStage />
      <ControlsPanelContainer />
      <DetailsPanelContainer
        isOpen={detailsPanelsOpen}
        onClose={() => setDetailsPanelsOpen(false)}
      />
    </div>
  );
}
