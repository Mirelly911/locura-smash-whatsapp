import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Clock, Instagram, ArrowRight, MessageCircle } from "lucide-react";
import Header from "./Header";
import { Button } from "./ui/button";
import { useCart } from "../context/cart";

const WHATSAPP_NUMBER = "595992114596";
const MAPS_URL = "https://maps.app.goo.gl/K1qDnazUd5F1UiJQ6";

function openWhatsapp(text: string) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}

const LandingPage = () => {
  const cart = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header
        restaurantName="Locura Smash"
        logoUrl="/logo.JPG"
        cartItemCount={cart.itemCount}
        onCartClick={() => navigate("/menu")}
      />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(234,88,12,0.20),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(220,38,38,0.18),transparent_50%)]" />
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.6))]" />
        <div className="relative container mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-3xl">
            <p className="inline-flex items-center rounded-full border border-orange-900/40 bg-orange-600/10 px-3 py-1 text-xs font-semibold text-orange-200">
              Pedidos por WhatsApp • Retiro o delivery
            </p>
            <h1 className="mt-5 text-4xl sm:text-6xl font-black tracking-tight">
              Locura Smash
            </h1>
            <p className="mt-4 text-lg sm:text-2xl text-zinc-200">
              Pedí tus smash burgers favoritas por WhatsApp.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild className="h-12 px-6 bg-orange-600 hover:bg-orange-700 text-white font-semibold">
                <Link to="/menu">
                  Ver menú <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-12 px-6 border-orange-900/50 bg-transparent text-orange-200 hover:bg-orange-950 font-semibold"
                onClick={() => openWhatsapp("Hola! Quiero hacer un pedido en Locura Smash.")}
              >
                Pedir ahora <MessageCircle className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-orange-900/40 bg-zinc-900/30 p-4">
                <p className="text-sm font-semibold text-orange-200">Pedido rapido</p>
                <p className="text-sm text-zinc-300">Armas tu pedido en minutos.</p>
              </div>
              <div className="rounded-xl border border-orange-900/40 bg-zinc-900/30 p-4">
                <p className="text-sm font-semibold text-orange-200">Retiro o delivery</p>
                <p className="text-sm text-zinc-300">Vos elegis como lo queres.</p>
              </div>
              <div className="rounded-xl border border-orange-900/40 bg-zinc-900/30 p-4">
                <p className="text-sm font-semibold text-orange-200">Sabor brutal</p>
                <p className="text-sm text-zinc-300">Smash premium, street food.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-orange-900/40 bg-zinc-900/20 p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-300" />
              <h2 className="text-xl font-bold">Horarios</h2>
            </div>
            <div className="mt-4 space-y-2 text-zinc-200">
              <p className="flex justify-between gap-4">
                <span className="text-zinc-300">Viernes</span>
                <span className="font-semibold">19:00 a 00:00 hs</span>
              </p>
              <p className="flex justify-between gap-4">
                <span className="text-zinc-300">Sabados</span>
                <span className="font-semibold">18:30 a 01:00 hs</span>
              </p>
              <p className="pt-3 text-sm text-amber-200/90">
                Delivery fijo de 10.000 Gs hasta 3.5 km
              </p>
            </div>
          </div>

          <a
            href={MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-orange-900/40 bg-zinc-900/20 p-6 hover:bg-zinc-900/35 transition-colors"
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-300" />
              <h2 className="text-xl font-bold">Ubicacion</h2>
            </div>
            <p className="mt-4 text-zinc-300">
              Ver en Google Maps
            </p>
            <p className="mt-2 text-sm text-orange-200 underline underline-offset-4">
              Abrir ubicacion
            </p>
          </a>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 pb-20">
        <div className="rounded-2xl border border-orange-900/40 bg-[radial-gradient(circle_at_30%_20%,rgba(234,88,12,0.16),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(220,38,38,0.14),transparent_55%)] p-8">
          <h2 className="text-2xl sm:text-3xl font-black">Listo para romperla?</h2>
          <p className="mt-2 text-zinc-200">
            Elegi tu combo y envia el pedido directo por WhatsApp.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button asChild className="h-12 px-6 bg-orange-600 hover:bg-orange-700 font-semibold">
              <Link to="/menu">
                Ver menú
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-12 px-6 border-orange-900/50 bg-transparent text-orange-200 hover:bg-orange-950 font-semibold"
              onClick={() => openWhatsapp("Hola! Quiero hacer un pedido en Locura Smash.")}
            >
              Enviar WhatsApp <MessageCircle className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-orange-900/40 bg-zinc-950">
        <div className="container mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-lg font-bold">Locura Smash</p>
            <p className="mt-2 text-sm text-zinc-300">Pedidos por WhatsApp • Retiro o delivery</p>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-zinc-400">Contacto</p>
            <p className="text-zinc-200">WhatsApp: 0992 114 596</p>
            <a
              className="inline-flex items-center gap-2 text-orange-200 hover:text-orange-100 underline underline-offset-4"
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="h-4 w-4" /> Abrir WhatsApp
            </a>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-zinc-400">Redes</p>
            <a
              className="inline-flex items-center gap-2 text-orange-200 hover:text-orange-100 underline underline-offset-4"
              href="https://instagram.com/locurasmashpy"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram className="h-4 w-4" /> @locurasmashpy
            </a>
            <a
              className="inline-flex items-center gap-2 text-orange-200 hover:text-orange-100 underline underline-offset-4"
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
            >
              <MapPin className="h-4 w-4" /> Ubicacion
            </a>
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 pb-10 text-xs text-zinc-500">
          © {new Date().getFullYear()} Locura Smash. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

