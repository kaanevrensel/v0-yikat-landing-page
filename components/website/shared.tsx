"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowDown, Menu, MoveUpRight, Smartphone, X } from "lucide-react";
import { WebsiteMotionProvider } from "./motion";
import { motion, useReducedMotion } from "framer-motion";
import {
  LensFilter,
  LENS_FILTER_ID,
  useLensCapable,
  useLiquidLens,
} from "@/components/liquid-lens";
import { Logo } from "@/components/logo";
import { PaymentBand } from "@/components/payment-band";
import { siteConfig } from "@/lib/site";
import { useDirectionsUrl } from "@/hooks/use-directions-url";

export const APP_STORE_URL = "https://apps.apple.com/tr/app/id6806875753";
const DownloadContext = createContext<() => void>(() => {
  window.location.assign("/urun");
});
export function useDownload() {
  return useContext(DownloadContext);
}

export function SiteShell({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  function openDownload() {
    opener.current = document.activeElement as HTMLElement;
    dialog.current?.showModal();
  }
  return (
    <WebsiteMotionProvider>
      <DownloadContext.Provider value={openDownload}>
        <a className="skip-link" href="#main">
          İçeriğe geç
        </a>
        <Navbar />
        {children}
        <WebsiteFooter />
        <dialog
          ref={dialog}
          className="download-dialog"
          aria-labelledby="download-title"
          onClose={() => opener.current?.focus()}
        >
          <div className="download-content">
            <button
              type="button"
              className="icon-button close-dialog"
              aria-label="Pencereyi kapat"
              onClick={() => dialog.current?.close()}
            >
              <X size={22} />
            </button>
            <div className="app-icon">
              <Logo width={66} />
            </div>
            <h2 id="download-title" className="sr-only">Uygulamayı indir</h2>
            <a
              className="app-store-badge"
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/images/app/app-store-tr.svg" alt="App Store’dan indir" width={227} height={60}/>
            </a>
            <div className="android-note">
              <Smartphone size={23} />
              <div>
                <strong>Android çok yakında</strong>
              </div>
            </div>
            <a
              className="text-link"
              href={siteConfig.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp’tan yaz
            </a>
          </div>
        </dialog>
      </DownloadContext.Provider>
    </WebsiteMotionProvider>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const [position, setPosition] = useState({ x: 0, width: 0 });
  const capable = useLensCapable();
  const lens = useLiquidLens(pillRef, capable);
  const reduced = useReducedMotion();
  const download = useDownload();
  const links = [
    { href: "/", label: "Ana sayfa" },
    { href: "/urun", label: "Ürün" },
    { href: "/partnerler", label: "İş ortakları" },
  ];
  const target = hovered ?? pathname;
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    const measure = () => {
      const el = linkRefs.current.get(target);
      if (el) setPosition({ x: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [target]);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);
  const frost = lens
    ? `url(#${LENS_FILTER_ID}) blur(2px) saturate(165%) brightness(1.05)`
    : "blur(18px) saturate(170%)";
  return (
    <header
      className={`site-header glass-header ${scrolled || open ? "glass-solid" : ""}`}
    >
      <div
        className="glass-capsule liquid-glass"
        ref={pillRef}
        style={{ backdropFilter: frost, WebkitBackdropFilter: frost }}
      >
        <span className="glass-sheen" aria-hidden="true" />
        <div className="nav-inner">
          <Link href="/" aria-label="Yıkat ana sayfa" className="brand-link">
            <Logo width={68} />
          </Link>
          <nav
            className="desktop-nav"
            aria-label="Ana gezinme"
            onPointerLeave={() => setHovered(null)}
          >
            <motion.span
              className="glass-selection"
              aria-hidden="true"
              initial={false}
              animate={{
                x: position.x,
                width: position.width,
                opacity: position.width ? 1 : 0,
              }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 420, damping: 36 }
              }
            />
            {links.map((link) => (
              <Link
                key={link.href}
                ref={(el) => {
                  if (el) linkRefs.current.set(link.href, el);
                  else linkRefs.current.delete(link.href);
                }}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                onPointerEnter={() => setHovered(link.href)}
                onFocus={() => setHovered(link.href)}
                onBlur={() => setHovered(null)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <button type="button" className="nav-download" onClick={download}>
              <span className="nav-download-long">Uygulamayı indir</span>
              <span className="nav-download-short">İndir</span>
            </button>
            <button
              className="icon-button menu-toggle"
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-menu"
          className="mobile-nav liquid-glass"
          aria-label="Mobil gezinme"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
      {lens && <LensFilter lens={lens} />}
    </header>
  );
}

export function ActionGroup({
  light = false,
  compact = false,
}: {
  light?: boolean;
  compact?: boolean;
}) {
  const directions = useDirectionsUrl();
  const download = useDownload();
  return (
    <div
      className={`action-group ${light ? "on-blue" : ""} ${compact ? "compact" : ""}`}
    >
      <a
        className="button primary"
        href={siteConfig.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>WhatsApp’tan yaz</span>
      </a>
      <button type="button" className="button secondary" onClick={download}>
        <span>Uygulamayı indir</span>
      </button>
      <a
        className="button directions"
        href={directions}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>Yol tarifi al</span>
      </a>
    </div>
  );
}

export function DownloadButton({
  children = "Uygulamayı indir",
  className = "button primary",
}: {
  children?: ReactNode;
  className?: string;
}) {
  const download = useDownload();
  return (
    <button type="button" className={className} onClick={download}>
      {children}
    </button>
  );
}

export function SectionHeading({
  title,
  text,
}: {
  title: ReactNode;
  text?: string;
}) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

export function ScrollHint({ to }: { to: string }) {
  return (
    <a className="scroll-hint" href={to}>
      <span>Biraz aşağı, her şey daha kolay.</span>
      <ArrowDown size={17} />
    </a>
  );
}

export function CleanSplash({ replay = 0 }: { replay?: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (!replay && sessionStorage.getItem("yikat-clean-intro")) return;
      sessionStorage.setItem("yikat-clean-intro", "seen");
    } catch {
      /* Private browsers can deny session storage. */
    }
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 1550);
    return () => clearTimeout(timer);
  }, [replay]);
  if (!visible) return null;
  return (
    <div className="clean-splash" aria-hidden="true" key={replay}>
      <div className="splash-brand">
        <Logo width={148} />
      </div>
      <div className="foam-edge">
        {Array.from({ length: 14 }, (_, i) => (
          <i
            key={i}
            style={{
              left: `${i * 8 - 4}%`,
              transform: `scale(${1 + (i % 3) * 0.18})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function WebsiteFooter() {
  const pathname = usePathname();
  return (
    <footer className="website-footer">
      <div className="wide footer-top">
        <div className="footer-brand">
          <Link href="/" aria-label="Yıkat ana sayfa">
            <Logo width={112} />
          </Link>
        </div>
        <div className="footer-links">
          <Link href="/">Ana sayfa</Link>
          <Link href="/urun">Ürün</Link>
          <Link href="/partnerler">İş ortakları</Link>
        </div>
        <div className="footer-contact">
          <p>Bir mesaj uzağındayız.</p>
          <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <span>Bakırköy, İstanbul</span>
        </div>
      </div>
      <div className="wide footer-bottom">
        <div className="legal-links">
          <Link href="/kvkk">KVKK</Link>
          <Link href="/gizlilik-politikasi">Gizlilik</Link>
          <Link href="/mesafeli-satis-sozlesmesi">Mesafeli satış</Link>
          <Link href="/teslimat-ve-iade">Teslimat ve iade</Link>
          <Link href="/hesap-silme">Hesap silme</Link>
          <Link href="/iletisim">İletişim</Link>
        </div>
        <PaymentBand tone="light" />
        <div className="copyright">
          <span>© {new Date().getFullYear()} Yıkat. Tüm hakları saklıdır.</span>
          {pathname === "/" && (
            <a
              href="https://benian.ai/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Teknoloji desteği: BENIAN <MoveUpRight size={12} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
