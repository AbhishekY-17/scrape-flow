"use client";

import useExecutionPlan from '@/components/hooks/useExecutionPlan';
import { Button } from '@/components/ui/button';
import { PlayIcon } from 'lucide-react';
import React from 'react'

function ExecuteBtn({ workflowId }: { workflowId: string }) {
  const generate = useExecutionPlan();
  return (
    <Button 
      variant={"outline"} 
      className="flex items-center gap-2"
      onClick={() => {
        const plan = generate();
        console.log("-- PLAN --");
        console.table(plan);
      }}
      >
        <PlayIcon size={16} className="stroke-orange-400" />
        Execute
    </Button>
  )
}

export default ExecuteBtn