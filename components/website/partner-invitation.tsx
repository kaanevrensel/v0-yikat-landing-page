"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { CareObject } from "./care-objects";
import { MotionScene } from "./motion";

export function PartnerInvitation() {
  return <section className="partner-invitation" aria-labelledby="home-partner-title">
    <h2 id="home-partner-title" className="sr-only">Yıkat iş ortaklığı</h2>
    <MotionScene className="invitation-scene">
      <div className="invitation-spool" aria-hidden="true"><span/><span/></div>
      <svg className="invitation-thread" viewBox="0 0 1100 350" fill="none" aria-hidden="true"><path d="M-30 222C95 82 148 291 303 176s246-84 285 5 172 43 240-16 176-56 321 71" stroke="#91c7ed" strokeWidth="3" strokeDasharray="1 8" strokeLinecap="round"/></svg>
      <CareObject kind="tag" className="invitation-tag"/>
      <div className="invitation-label">
        <Logo width={100}/>
        <Link href="/partnerler" className="object-discover">Birlikte çalışalım <ArrowRight size={20} aria-hidden="true"/></Link>
      </div>
      <CareObject kind="parcel" className="invitation-parcel"/>
    </MotionScene>
  </section>;
}
