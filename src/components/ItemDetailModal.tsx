import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Minus, Plus, X } from "lucide-react";
import { formatGs } from "../lib/utils";
import type { MenuItem as MenuItemType } from "./MenuData";

interface ItemDetailModalProps {
  item?: MenuItemType;
  isOpen?: boolean;
  onClose?: () => void;
  onAddToCart?: (
    item: MenuItemType,
    quantity: number,
    selectedOptions: string[],
  ) => void;
}

const ItemDetailModal = ({
  item,
  isOpen = false,
  onClose = () => {},
  onAddToCart = () => {},
}: ItemDetailModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setQuantity(1);
    setSelectedOptions([]);
    setImgFailed(false);
  }, [isOpen, item?.id]);

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const toggleOption = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId],
    );
  };

  const total = useMemo(() => {
    if (!item) return 0;
    const addOns =
      item.customizationOptions
        ?.filter((o) => selectedOptions.includes(o.id))
        .reduce((sum, o) => sum + o.price, 0) || 0;
    return (item.price + addOns) * quantity;
  }, [item, quantity, selectedOptions]);

  const handleAddToCart = () => {
    if (!item) return;
    onAddToCart(item, quantity, selectedOptions);
    onClose();
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-[720px] bg-zinc-950 text-white rounded-xl border border-orange-900/40 shadow-xl overflow-hidden p-0">
        <div className="relative w-full bg-zinc-950">
          <div className="h-[280px] w-full flex items-center justify-center p-6 pb-12">
            {!imgFailed ? (
              <img
                src={item.image}
                alt={item.name}
                className="block max-h-full max-w-full object-contain"
                onError={() => setImgFailed(true)}
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-[radial-gradient(circle_at_30%_20%,rgba(234,88,12,0.20),transparent_55%),radial-gradient(circle_at_80%_60%,rgba(220,38,38,0.18),transparent_55%)]" />
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-3 right-3 text-white hover:bg-white/10 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
          <h2 className="absolute bottom-4 left-6 text-2xl font-bold text-white">
            {item.name}
          </h2>
        </div>

        <div className="grid gap-6 p-6">
          {item.description ? (
            <p className="text-zinc-200 leading-relaxed">{item.description}</p>
          ) : (
            <p className="text-zinc-400">Sin descripción</p>
          )}

          <div className="mt-2">
            <h3 className="text-lg font-semibold mb-2 text-amber-300">
              Precio: {formatGs(item.price)}
            </h3>
          </div>

          {item.customizationOptions &&
            item.customizationOptions.length > 0 && (
              <div className="mt-4 bg-zinc-900/40 p-4 rounded-xl border border-orange-900/40">
                <h3 className="text-lg font-semibold mb-3 flex items-center text-white">
                  <span className="w-6 h-6 rounded-full bg-orange-600/15 border border-orange-900/50 flex items-center justify-center mr-2 text-orange-300 text-sm">
                    +
                  </span>
                  Extras
                </h3>
                <div className="space-y-3">
                  {item.customizationOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center justify-between hover:bg-zinc-900 p-2 rounded-lg transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`option-${option.id}`}
                          checked={selectedOptions.includes(option.id)}
                          onChange={() => toggleOption(option.id)}
                          className="h-5 w-5 rounded border-orange-900/60 bg-zinc-950 text-orange-500 focus:ring-orange-500"
                        />
                        <label
                          htmlFor={`option-${option.id}`}
                          className="text-sm font-medium text-zinc-200 cursor-pointer"
                        >
                          {option.name}
                        </label>
                      </div>
                      <span className="text-sm font-medium text-orange-300">
                        +{formatGs(option.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-3 text-white">
              Cantidad
            </h3>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDecreaseQuantity}
                disabled={quantity <= 1}
                className="rounded-full border-orange-900/40 text-orange-300 hover:bg-zinc-900 hover:border-orange-800 h-10 w-10 bg-transparent"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-20 text-center rounded-lg border-orange-900/40 bg-zinc-950 focus:ring-orange-500 focus:border-orange-500"
                min="1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleIncreaseQuantity}
                className="rounded-full border-orange-900/40 text-orange-300 hover:bg-zinc-900 hover:border-orange-800 h-10 w-10 bg-transparent"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-5 bg-zinc-900/40 p-4 rounded-xl border border-orange-900/40 flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Total:</h3>
            <span className="text-xl font-bold text-amber-300">{formatGs(total)}</span>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-full border-orange-900/40 bg-transparent text-zinc-200 hover:bg-zinc-900"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAddToCart}
            className="bg-orange-600 hover:bg-orange-700 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
          >
            Agregar al carrito
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDetailModal;
