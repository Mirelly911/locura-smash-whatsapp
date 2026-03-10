import React from "react";
import { Button } from "./ui/button";
import { Plus, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { motion } from "framer-motion";
import { formatGs } from "../lib/utils";

interface MenuItemProps {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
  onAddToCart?: () => void;
  onViewDetails?: () => void;
  featured?: boolean;
  tags?: string[];
}

const MenuItem = ({
  id = "1",
  name = "Producto",
  description = "Descripción del producto.",
  price = 15000,
  image = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
  category = "",
  onAddToCart = () => console.log("Item added to cart"),
  onViewDetails = () => console.log("View details clicked"),
  featured = false,
  tags = [],
}: MenuItemProps) => {
  const allowedBadges = new Set([
    "popular",
    "recomendado",
    "premium",
    "bacon",
    "brutal",
    "destacado",
    "parrilla",
  ]);

  const normalizedTags = (tags || [])
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t !== "" && allowedBadges.has(t));

  const uniqueTags: string[] = [];
  for (const t of normalizedTags) {
    if (!uniqueTags.includes(t)) uniqueTags.push(t);
  }

  const visibleBadges: string[] = [];
  if (featured) visibleBadges.push("destacado");
  for (const t of uniqueTags) {
    if (visibleBadges.length >= 2) break;
    if (t === "destacado") continue;
    visibleBadges.push(t);
  }

  const [imgFailed, setImgFailed] = React.useState(false);
  React.useEffect(() => setImgFailed(false), [image]);

  const isBeverage = category.trim().toLowerCase() === "bebidas";

  return (
    <Card
      data-card-version="locura-struct-v3"
      className="w-full h-[320px] sm:h-[340px] overflow-hidden bg-zinc-950 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl border border-orange-900/50 relative group flex flex-col"
    >
      <button
        type="button"
        onClick={onViewDetails}
        className="relative block w-full text-left"
        aria-label={`Ver detalles de ${name}`}
      >
        <div
          className={
            isBeverage
              ? "relative w-full h-36 sm:h-40 bg-zinc-950"
              : "relative w-full h-36 sm:h-40 overflow-hidden"
          }
        >
          {isBeverage && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(234,88,12,0.14),transparent_60%),radial-gradient(circle_at_80%_60%,rgba(220,38,38,0.12),transparent_60%)]" />
          )}

          {!imgFailed ? (
            isBeverage ? (
              <div className="relative w-full h-full flex items-center justify-center p-3 sm:p-4">
                <img
                  src={image}
                  alt={name}
                  className="block max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                  onError={() => setImgFailed(true)}
                />
              </div>
            ) : (
              <img
                src={image}
                alt={name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                loading="lazy"
                onError={() => setImgFailed(true)}
              />
            )
          ) : (
            <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(234,88,12,0.20),transparent_55%),radial-gradient(circle_at_80%_60%,rgba(220,38,38,0.18),transparent_55%)] flex items-end">
              <div className="p-3">
                <p className="text-xs font-semibold text-orange-200/90">
                  Locura Smash
                </p>
                <p className="text-[10px] text-zinc-300">Imagen pendiente</p>
              </div>
            </div>
          )}

          {!isBeverage && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          )}
        </div>

        {visibleBadges.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-nowrap gap-1 max-w-[85%] overflow-hidden">
            {visibleBadges.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-zinc-950/80 text-orange-200 border border-orange-900/50 px-2 py-0.5 text-[10px] font-semibold backdrop-blur"
              >
                {tag === "destacado" && (
                  <Star className="h-3 w-3 mr-1 fill-orange-200 text-orange-200" />
                )}
                {tag}
              </span>
            ))}
          </div>
        )}
      </button>

      <div className="flex flex-1 flex-col">
        <CardContent className="p-4 pb-3 flex flex-col flex-1">
          <h3
            className="text-sm sm:text-base font-bold tracking-tight text-white leading-snug cursor-pointer hover:text-orange-200 transition-colors line-clamp-1"
            onClick={onViewDetails}
          >
            {name}
          </h3>

          <p className="mt-1 text-xs sm:text-sm text-zinc-300 line-clamp-2 h-[2.5rem]">
            {description || "Bebida o extra"}
          </p>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0 mt-auto">
          <div className="w-full flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] text-zinc-400">Precio</p>
              <p className="text-base sm:text-lg font-black text-amber-300 leading-none">
                {formatGs(price)}
              </p>
            </div>

            <motion.div whileTap={{ scale: 0.98 }} className="shrink-0">
              <Button
                onClick={onAddToCart}
                className="h-10 sm:h-11 px-4 sm:px-5 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-orange-600/10"
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </motion.div>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default MenuItem;
