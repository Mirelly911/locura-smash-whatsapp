import React, { useEffect, useState } from "react";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { getStoreStatus } from "../lib/storeHours";

interface HeaderProps {
  restaurantName?: string;
  logoUrl?: string;
  cartItemCount?: number;
  onCartClick?: () => void;
  onMenuClick?: () => void;
}

const Header = ({
  restaurantName = "Locura Smash",
  logoUrl = "/logo.JPG",
  cartItemCount = 0,
  onCartClick = () => {},
  onMenuClick = () => {},
}: HeaderProps) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const status = getStoreStatus(now);
  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-950/95 backdrop-blur border-b border-orange-900/40 shadow-md">
      <div className="container flex items-center justify-between h-16 sm:h-20 px-3 sm:px-4 mx-auto">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden text-orange-300 hover:text-orange-200 hover:bg-orange-950"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-orange-600/10 p-1 flex items-center justify-center shadow-md border border-orange-900/40 overflow-hidden">
              <img
                src={logoUrl}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold text-white tracking-tight flex items-center">
                {restaurantName}
              </h1>
              <div className="hidden sm:flex items-center gap-2 mt-0.5">
                <p className="text-[10px] sm:text-xs text-zinc-300">
                  Pedidos por WhatsApp • Retiro o delivery
                </p>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                    status.isOpen
                      ? "bg-emerald-500/10 text-emerald-200 border-emerald-900/40"
                      : "bg-red-500/10 text-red-200 border-red-900/40"
                  }`}
                >
                  {status.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            className="relative rounded-md border-orange-900/40 hover:border-orange-800 hover:bg-orange-950 transition-all duration-200 px-2 sm:px-4 text-white text-xs sm:text-sm py-1 h-8 sm:h-10"
            onClick={onCartClick}
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-orange-300" />
            <span className="hidden sm:inline">Pedido Actual</span>
            {cartItemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs bg-orange-600 hover:bg-orange-700 border border-orange-900/40">
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
