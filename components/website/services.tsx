"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { useDownload } from "./shared";

export const serviceItems = [
  {
    name: "Ayakkabı",
    image: "ayakkabi",
    title: "O çiftin daha çok yolu var",
    description:
      "Sevdiğin ayakkabıları kirlenir diye dolapta bırakma. Deri, süet ya da sneaker; malzemesine uygun yöntemle temizleyelim.",
    details: ["Malzemeye özel temizlik", "Bakırköy atölyemizde özenli bakım"],
    availability: "Kapıdan alım ve mağazaya teslim seçenekleri",
    color: "shoe",
  },
  {
    name: "Kuru temizleme",
    image: "dry-cleaning",
    title: "Hassas parçalarını bize bırak",
    description:
      "Ceketini, elbiseni ve hassas kumaşlarını düşünmeden giy. Bakımını malzemesine uygun yöntemle tamamlayalım.",
    details: ["Kumaşına uygun işlem", "Özenli hazırlık ve paketleme"],
    availability: "Adresindeki uygunluğu uygulamada kontrol et",
    color: "dry",
  },
  {
    name: "Çamaşır",
    image: "kiloyla",
    title: "Çamaşır günü diye bir gün olmasın",
    description:
      "Çamaşırları yıkamak ve asmak için hafta sonunu ayırma. İhtiyacına uygun paketi seç, alım zamanını planla.",
    details: ["İhtiyacına uygun paketler", "Alım ve teslim zamanı seçimi"],
    availability: "Adresindeki uygunluğu uygulamada kontrol et",
    color: "laundry",
  },
  {
    name: "Ütü",
    image: "utu",
    title: "Ütü masasını hiç açma",
    description:
      "Yarının gömleği hazır olsun diye bu akşamı ütü başında geçirme. Kıyafetlerini giyilmeye hazır teslim al.",
    details: ["Parçana uygun özen", "Giyilmeye hazır teslim"],
    availability: "Adresindeki uygunluğu uygulamada kontrol et",
    color: "iron",
  },
  {
    name: "Yorgan & battaniye",
    image: "hacimli",
    title: "Büyük parçaları bize bırak",
    description:
      "Yorganı, battaniyeyi taşımakla uğraşma. Büyük parçalarının temizliğini kapından alım seçeneğiyle planla.",
    details: ["Hacimli parçalara uygun temizlik", "Kapıdan alım kolaylığı"],
    availability: "Adresindeki uygunluğu uygulamada kontrol et",
    color: "home",
  },
] as const;

export function ServiceShowcase() {
  const [active, setActive] = useState(0);
  const dragging = useRef(false);
  const reduced = useReducedMotion();
  const service = serviceItems[active];
  const download = useDownload();
  const select = (index: number) =>
    setActive(Math.max(0, Math.min(serviceItems.length - 1, index)));
  return (
    <div className="service-showcase service-gallery">
      <div className="service-rail">
        <motion.div
          className="service-track"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.22}
          onDragStart={() => {
            dragging.current = true;
          }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -35 || info.velocity.x < -350)
              select(active + 1);
            else if (info.offset.x > 35 || info.velocity.x > 350)
              select(active - 1);
            setTimeout(() => {
              dragging.current = false;
            }, 100);
          }}
        >
          {serviceItems.map((item, index) => (
            <motion.button
              type="button"
              className="service-piece"
              key={item.name}
              tabIndex={-1}
              aria-label={item.name}
              aria-hidden={Math.abs(index - active) > 1}
              onClick={() => {
                if (!dragging.current) select(index);
              }}
              initial={false}
              animate={{
                x: `${(index - active) * 84}%`,
                scale: index === active ? 1 : 0.63,
                opacity:
                  Math.abs(index - active) > 1
                    ? 0
                    : index === active
                      ? 1
                      : 0.45,
                rotate: index === active ? -3 : (index - active) * 8,
              }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 230, damping: 27 }
              }
            >
              <Image unoptimized
                draggable={false}
                src={`/images/services/${item.image}.png`}
                alt=""
                width={500}
                height={500}
              />
            </motion.button>
          ))}
        </motion.div>
      </div>
      <div
        className="service-tabs"
        role="tablist"
        aria-label="Temizlik hizmetleri"
      >
        {serviceItems.map((item, index) => (
          <button
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-controls="service-panel"
            id={`service-tab-${index}`}
            tabIndex={active === index ? 0 : -1}
            key={item.name}
            onClick={() => select(index)}
            onKeyDown={(e) => {
              let next = index;
              if (e.key === "ArrowRight") next = (index + 1) % 5;
              else if (e.key === "ArrowLeft") next = (index + 4) % 5;
              else if (e.key === "Home") next = 0;
              else if (e.key === "End") next = 4;
              else return;
              e.preventDefault();
              select(next);
              document.getElementById(`service-tab-${next}`)?.focus();
            }}
          >
            {item.name}
            {active === index && (
              <motion.span
                className="service-active-line"
                layoutId="service-line"
                transition={
                  reduced
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 300, damping: 32 }
                }
              />
            )}
          </button>
        ))}
      </div>
      <div
        className="service-panel"
        id="service-panel"
        role="tabpanel"
        aria-labelledby={`service-tab-${active}`}
        tabIndex={0}
      >
        <motion.div
          className="service-copy"
          key={service.name}
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        >
          <h3>{service.title}</h3>
          <p>{service.description}</p>
          <button className="text-link" type="button" onClick={download}>
            Uygulamada keşfet
          </button>
          <small>{service.availability}</small>
        </motion.div>
      </div>
    </div>
  );
}
