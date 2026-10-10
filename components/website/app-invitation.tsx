"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { CareObject } from "./care-objects";
import { MotionScene } from "./motion";

/** The published app screen in a blue care pocket. */
export function AppInvitation() {
  return <section className="app-invitation" aria-labelledby="app-invitation-title">
    <h2 id="app-invitation-title" className="sr-only">Uygulamayı keşfet</h2>
    <MotionScene className="app-pocket-scene">
      <div className="app-pocket-circles" aria-hidden="true"><i/><i/></div>
      <div className="app-pocket-phone"><Image className="app-product-screen" src="/images/app/published-home.webp" alt="Yıkat Gitsin uygulamasının gerçek ana ekranı; hizmet seçimi ve siparişler" width={720} height={1564} sizes="(max-width: 600px) 265px, 360px"/></div>
      <div className="app-pocket-camera"><CareObject kind="camera"/></div>
      <div className="app-pocket-front" aria-hidden="true"><span/><span/></div>
      <div className="app-pocket-action">
        <Logo width={155}/>
        <Link className="object-discover" href="/urun">Uygulamayı keşfet <ArrowRight size={20} aria-hidden="true"/></Link>
      </div>
    </MotionScene>
  </section>;
}
