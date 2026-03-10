import React, { useMemo, useState } from "react";
import { Trash2, Plus, Minus, ShoppingBag, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { formatGs } from "../lib/utils";
import type { CartLine } from "../context/cart";
import { getStoreStatus } from "../lib/storeHours";

type DeliveryMethod = "retiro" | "delivery";
type PaymentMethod = "efectivo" | "transferencia";

interface CartProps {
  items: CartLine[];
  onUpdateQuantity: (key: string, quantity: number) => void;
  onRemoveItem: (key: string) => void;
  onClear?: () => void;
  whatsappNumber?: string;
}

const DELIVERY_FEE = 10000;

function lineUnitPrice(line: CartLine) {
  const addOnsTotal = (line.addOns || []).reduce((sum, o) => sum + o.price, 0);
  return line.basePrice + addOnsTotal;
}

function buildWhatsappMessage(params: {
  name: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  address: string;
  paymentMethod: PaymentMethod;
  cashGiven: string;
  notes: string;
  lines: CartLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}) {
  const {
    name,
    phone,
    deliveryMethod,
    address,
    paymentMethod,
    cashGiven,
    notes,
    lines,
    subtotal,
    deliveryFee,
    total,
  } = params;

  const products = lines.filter((l) => l.category !== "extras");

  // Extras include:
  // - explicit "extras" category items (each is its own line)
  // - addOns attached to product lines (aggregated by name + unit price)
  type ExtraAgg = { name: string; unitPrice: number; qty: number };
  const extrasAgg = new Map<string, ExtraAgg>();

  for (const line of lines) {
    if (line.category === "extras") {
      const key = `${line.name}__${line.basePrice}`;
      const existing = extrasAgg.get(key);
      const nextQty = (existing?.qty || 0) + line.quantity;
      extrasAgg.set(key, { name: line.name, unitPrice: line.basePrice, qty: nextQty });
      continue;
    }

    for (const addOn of line.addOns || []) {
      const key = `${addOn.name}__${addOn.price}`;
      const existing = extrasAgg.get(key);
      const nextQty = (existing?.qty || 0) + line.quantity;
      extrasAgg.set(key, { name: addOn.name, unitPrice: addOn.price, qty: nextQty });
    }
  }

  const pedidoText =
    products.length > 0
      ? products
          .map((l) => `- ${l.quantity}x ${l.name} - ${formatGs(l.basePrice * l.quantity)}`)
          .join("\n")
      : "- (sin productos)";

  const extrasList = Array.from(extrasAgg.values())
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((e) => `- ${e.qty}x ${e.name} - ${formatGs(e.unitPrice * e.qty)}`);

  const deliveryLabel = deliveryMethod === "delivery" ? "Delivery" : "Retiro";
  const paymentLabel = paymentMethod === "transferencia" ? "Transferencia" : "Efectivo";

  const parts = [
    "🍔 Nuevo pedido - Locura Smash",
    "",
    `👤 Nombre: ${name}`,
    `📞 Teléfono: ${phone}`,
    `🛍️ Entrega: ${deliveryLabel}`,
    ...(deliveryMethod === "delivery" ? [`📍 Dirección/Referencia: ${address}`] : []),
    `💳 Pago: ${paymentLabel}`,
    ...(paymentMethod === "efectivo" && cashGiven.trim() !== "" ? [`💵 Paga con: ${cashGiven}`] : []),
    "",
    "🧾 Pedido:",
    pedidoText,
    ...(extrasList.length > 0 ? ["", "➕ Extras:", ...extrasList] : []),
    "",
    `🧮 Subtotal productos: ${formatGs(subtotal)}`,
    `🚚 Delivery: ${formatGs(deliveryFee)}`,
    `💰 Total final: ${formatGs(total)}`,
    ...(notes.trim() !== "" ? ["", "📝 Observaciones:", notes.trim()] : []),
  ];

  return parts.join("\n");
}

const Cart = ({ items, onUpdateQuantity, onRemoveItem, onClear, whatsappNumber = "595992114596" }: CartProps) => {
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("retiro");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("efectivo");
  const [cashGiven, setCashGiven] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const subtotal = useMemo(() => {
    return items.reduce((sum, line) => sum + lineUnitPrice(line) * line.quantity, 0);
  }, [items]);

  React.useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const storeStatus = getStoreStatus(now);
  const deliveryFee = deliveryMethod === "delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const openCheckout = () => {
    if (!storeStatus.isOpen) return;
    setError(null);
    setIsCheckoutOpen(true);
  };

  const submit = () => {
    const name = customerName.trim();
    const phone = customerPhone.trim();
    const addr = address.trim();

    if (name === "" || phone === "") {
      setError("Completá tu nombre y teléfono.");
      return;
    }
    if (deliveryMethod === "delivery" && addr === "") {
      setError("Agregá una dirección o referencia para el delivery.");
      return;
    }

    const message = buildWhatsappMessage({
      name,
      phone,
      deliveryMethod,
      address: addr,
      paymentMethod,
      cashGiven,
      notes,
      lines: items,
      subtotal,
      deliveryFee,
      total,
    });

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setIsCheckoutOpen(false);
    onClear?.();
  };

  if (items.length === 0) {
    return (
      <div className="w-full h-full bg-zinc-950 text-white border border-orange-900/40 p-5 flex flex-col rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <ShoppingBag className="h-5 w-5 text-orange-400 mr-2" />
            Tu pedido
          </h2>
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold border ${
              storeStatus.isOpen
                ? "bg-emerald-500/10 text-emerald-200 border-emerald-900/40"
                : "bg-red-500/10 text-red-200 border-red-900/40"
            }`}
          >
            {storeStatus.label}
          </span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <ShoppingBag className="h-16 w-16 text-orange-500/50 mb-4" />
          <h3 className="text-lg font-medium mb-2 text-white">Tu carrito está vacío</h3>
          <p className="text-zinc-300">Sumá productos del menú para empezar.</p>
          {!storeStatus.isOpen && (
            <p className="mt-3 text-xs text-zinc-400 max-w-[26ch]">
              {storeStatus.closedMessage}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-zinc-950 text-white border border-orange-900/40 shadow-lg flex flex-col rounded-xl overflow-hidden">
      <div className="p-5 border-b border-orange-900/40 bg-zinc-950 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center">
            <ShoppingBag className="h-5 w-5 text-orange-400 mr-2" />
            Tu pedido
          </h2>
          {onClear && (
            <Button
              variant="ghost"
              className="text-zinc-300 hover:text-white hover:bg-zinc-900"
              onClick={() => onClear()}
            >
              Vaciar
            </Button>
          )}
        </div>

        <div className="mt-4 rounded-lg border border-orange-900/40 bg-zinc-900/40 p-3">
          <p className="text-xs text-zinc-400 mb-2">Entrega</p>
          <div className="flex gap-2">
            <button
              onClick={() => setDeliveryMethod("retiro")}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors border ${
                deliveryMethod === "retiro"
                  ? "bg-orange-600 text-white border-orange-700"
                  : "bg-zinc-950 text-zinc-200 border-orange-900/40 hover:bg-zinc-900"
              }`}
            >
              Retiro
            </button>
            <button
              onClick={() => setDeliveryMethod("delivery")}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors border ${
                deliveryMethod === "delivery"
                  ? "bg-orange-600 text-white border-orange-700"
                  : "bg-zinc-950 text-zinc-200 border-orange-900/40 hover:bg-zinc-900"
              }`}
            >
              Delivery
            </button>
          </div>
          {deliveryMethod === "delivery" && (
            <p className="mt-2 text-xs text-amber-200/90">
              Delivery fijo de 10.000 Gs hasta 3.5 km
            </p>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-5">
        <div className="space-y-4">
          {items.map((line) => {
            const unit = lineUnitPrice(line);
            const lineTotal = unit * line.quantity;

            return (
              <div key={line.key} className="rounded-xl border border-orange-900/30 bg-zinc-900/30 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3 min-w-0">
                    {line.image ? (
                      <img
                        src={line.image}
                        alt={line.name}
                        className="h-14 w-14 rounded-lg object-cover border border-orange-900/30"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-lg bg-zinc-900 border border-orange-900/30" />
                    )}

                    <div className="min-w-0">
                      <p className="font-semibold truncate">{line.name}</p>
                      {line.addOns && line.addOns.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {line.addOns.map((a) => (
                            <span
                              key={a.id}
                              className="text-[11px] rounded-full border border-orange-900/40 bg-orange-600/10 text-orange-200 px-2 py-0.5"
                            >
                              {a.name}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="mt-2 text-sm text-amber-300 font-semibold">{formatGs(lineTotal)}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(line.key)}
                    className="text-zinc-300 hover:text-red-400 p-1.5 hover:bg-red-900/20 rounded-full transition-colors"
                    aria-label="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center border border-orange-900/40 rounded-md bg-zinc-950 overflow-hidden">
                    <button
                      onClick={() => onUpdateQuantity(line.key, Math.max(1, line.quantity - 1))}
                      className="p-2 hover:bg-zinc-900 text-orange-300 transition-colors"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-1 min-w-[40px] text-center font-semibold">{line.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(line.key, line.quantity + 1)}
                      className="p-2 hover:bg-zinc-900 text-orange-300 transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <span className="text-xs text-zinc-400">Unitario: {formatGs(unit)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-5 bg-zinc-950 border-t border-orange-900/40 sticky bottom-0 z-10">
        <div className="space-y-3 mb-5">
          <div className="flex justify-between text-zinc-300">
            <span>Subtotal productos</span>
            <span>{formatGs(subtotal)}</span>
          </div>
          <div className="flex justify-between text-zinc-300">
            <span>Delivery</span>
            <span>{formatGs(deliveryFee)}</span>
          </div>
          <Separator className="bg-orange-900/40" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span className="text-amber-300">{formatGs(total)}</span>
          </div>
          <p className="text-xs text-amber-200/90">Delivery fijo de 10.000 Gs hasta 3.5 km</p>
        </div>

        <Button
          onClick={openCheckout}
          disabled={!storeStatus.isOpen}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-md py-6 font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
        >
          <Send className="mr-2 h-5 w-5" />
          Finalizar por WhatsApp
        </Button>
        {!storeStatus.isOpen && (
          <p className="mt-3 text-xs text-zinc-400">{storeStatus.closedMessage}</p>
        )}
      </div>

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-[640px] bg-zinc-950 text-white border border-orange-900/40">
          <DialogHeader>
            <DialogTitle className="text-xl">Datos para tu pedido</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {error && (
              <div className="rounded-md border border-red-900/40 bg-red-900/10 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="bg-zinc-950 border-orange-900/40"
                placeholder="Tu nombre"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="bg-zinc-950 border-orange-900/40"
                placeholder="Ej: 0992 114 596"
              />
            </div>

            <div className="grid gap-2">
              <Label>Tipo de entrega</Label>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeliveryMethod("retiro")}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors border ${
                    deliveryMethod === "retiro"
                      ? "bg-orange-600 text-white border-orange-700"
                      : "bg-zinc-950 text-zinc-200 border-orange-900/40 hover:bg-zinc-900"
                  }`}
                >
                  Retiro
                </button>
                <button
                  onClick={() => setDeliveryMethod("delivery")}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors border ${
                    deliveryMethod === "delivery"
                      ? "bg-orange-600 text-white border-orange-700"
                      : "bg-zinc-950 text-zinc-200 border-orange-900/40 hover:bg-zinc-900"
                  }`}
                >
                  Delivery
                </button>
              </div>
              <p className="text-xs text-amber-200/90">Delivery fijo de 10.000 Gs hasta 3.5 km</p>
            </div>

            {deliveryMethod === "delivery" && (
              <div className="grid gap-2">
                <Label htmlFor="address">Dirección o referencia</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-zinc-950 border-orange-900/40"
                  placeholder="Barrio, calle, casa, referencia"
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label>Forma de pago</Label>
              <div className="flex gap-2">
                <button
                  onClick={() => setPaymentMethod("efectivo")}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors border ${
                    paymentMethod === "efectivo"
                      ? "bg-orange-600 text-white border-orange-700"
                      : "bg-zinc-950 text-zinc-200 border-orange-900/40 hover:bg-zinc-900"
                  }`}
                >
                  Efectivo
                </button>
                <button
                  onClick={() => setPaymentMethod("transferencia")}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors border ${
                    paymentMethod === "transferencia"
                      ? "bg-orange-600 text-white border-orange-700"
                      : "bg-zinc-950 text-zinc-200 border-orange-900/40 hover:bg-zinc-900"
                  }`}
                >
                  Transferencia
                </button>
              </div>
            </div>

            {paymentMethod === "efectivo" && (
              <div className="grid gap-2">
                <Label htmlFor="cash">Paga con cuánto</Label>
                <Input
                  id="cash"
                  value={cashGiven}
                  onChange={(e) => setCashGiven(e.target.value)}
                  className="bg-zinc-950 border-orange-900/40"
                  placeholder="Ej: 100.000"
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="notes">Observaciones</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-zinc-950 border-orange-900/40"
                placeholder="Sin cebolla, sin pepinillos, etc."
              />
            </div>

            <div className="rounded-lg border border-orange-900/40 bg-zinc-900/30 p-4">
              <p className="text-sm text-zinc-300 flex justify-between">
                <span>Subtotal</span>
                <span>{formatGs(subtotal)}</span>
              </p>
              <p className="mt-1 text-sm text-zinc-300 flex justify-between">
                <span>Delivery</span>
                <span>{formatGs(deliveryFee)}</span>
              </p>
              <p className="mt-3 text-base font-bold flex justify-between">
                <span>Total</span>
                <span className="text-amber-300">{formatGs(total)}</span>
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsCheckoutOpen(false)}
              className="border-orange-900/40 bg-transparent text-zinc-200 hover:bg-zinc-900"
            >
              Volver
            </Button>
            <Button
              onClick={submit}
              disabled={!storeStatus.isOpen}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Enviar a WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;
