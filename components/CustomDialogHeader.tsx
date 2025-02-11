"use client";

import { DialogHeader, DialogTitle} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";


import React from 'react'

interface Props {
    title? : string;
    subTitle? : string;
    icon? : LucideIcon;

    iconClassName? : string;
    titleClassName? : string;
    subtitleClassName? : string;
}

function CustomDialogHeader({
  title,
  subTitle,
  icon: Icon,
  iconClassName,
  titleClassName,
  subtitleClassName,
}:Props) {
  return <DialogHeader className="py-6">
    <DialogTitle asChild>
        <div className="flex flex-col items-center gap-2 mb-2">
          {Icon && (
            <Icon size={30} className={cn("stroke-primary", iconClassName)}
            />
          )}
          {title && (
            <p className={cn("text-xl text-primary", title)}>
              {title}
            </p>
          )}
          {subTitle && (
            <p className={cn("text-sm text-muted-foreground", subTitle)}>
              {subTitle}
            </p>
          )}
        </div>
    </DialogTitle>
    <Separator/>
  </DialogHeader>
}

export default CustomDialogHeader