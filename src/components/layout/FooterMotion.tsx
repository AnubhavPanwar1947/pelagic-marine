"use client";

import { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

export function FooterMotion({ children }: { children: ReactNode }) {
  return <Reveal variant="fade">{children}</Reveal>;
}
