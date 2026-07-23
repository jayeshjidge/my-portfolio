import Image from "next/image";
import { portfolio } from "@/data/portfolio";

export function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden="true">
      <Image
        className="atmosphere-photo"
        src={portfolio.images.background}
        alt=""
        fill
        priority
        sizes="100vw"
        quality={80}
      />
      <div className="atmosphere-veil" />
    </div>
  );
}
