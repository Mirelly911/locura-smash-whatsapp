import React, { useMemo, useState } from "react";
import Header from "./Header";
import MenuItems from "./MenuItems";
import Cart from "./Cart";
import ItemDetailModal from "./ItemDetailModal";
import { Sheet, SheetContent } from "./ui/sheet";
import { menuItems, MenuItem as MenuItemType } from "./MenuData";
import { useCart } from "../context/cart";
import { formatGs } from "../lib/utils";

const Home = () => {
  const cart = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);

  const subtotal = useMemo(() => {
    return cart.items.reduce((sum, line) => {
      const addOnsTotal = (line.addOns || []).reduce((s, o) => s + o.price, 0);
      return sum + (line.basePrice + addOnsTotal) * line.quantity;
    }, 0);
  }, [cart.items]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header
        restaurantName="Locura Smash"
        logoUrl="/logo.JPG"
        cartItemCount={cart.itemCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      <div className="container mx-auto px-3 sm:px-6 py-6 grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="min-w-0">
          <MenuItems
            selectedCategory="burgers"
            items={menuItems}
            onItemClick={(item) => setSelectedItem(item)}
            onAddToCart={(item) =>
              cart.addItem(
                {
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  category: item.category,
                  image: item.image,
                },
                1,
              )
            }
          />
        </div>

        <div className="hidden lg:block">
          <div id="cart-panel" className="sticky top-24">
            <Cart
              items={cart.items}
              onUpdateQuantity={cart.updateQuantity}
              onRemoveItem={cart.removeItem}
              onClear={cart.clear}
            />
          </div>
        </div>
      </div>

      {cart.itemCount > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-orange-900/40 bg-zinc-950/95 backdrop-blur">
          <div className="container mx-auto px-3 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-zinc-400">Total parcial</p>
              <p className="font-semibold text-amber-300 truncate">
                {formatGs(subtotal)}
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="shrink-0 rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-600/10 hover:bg-orange-700 transition-colors"
            >
              Ver carrito ({cart.itemCount})
            </button>
          </div>
        </div>
      )}

      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 bg-zinc-950 border-orange-900/40">
          <Cart
            items={cart.items}
            onUpdateQuantity={cart.updateQuantity}
            onRemoveItem={cart.removeItem}
            onClear={cart.clear}
          />
        </SheetContent>
      </Sheet>

      <ItemDetailModal
        item={selectedItem || undefined}
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        onAddToCart={(item, quantity, selectedOptions) => {
          const addOns =
            item.customizationOptions
              ?.filter((o) => selectedOptions.includes(o.id))
              .map((o) => ({ id: o.id, name: o.name, price: o.price })) || [];

          cart.addItem(
            {
              id: item.id,
              name: item.name,
              price: item.price,
              category: item.category,
              image: item.image,
            },
            quantity,
            addOns,
          );
        }}
      />
    </div>
  );
};

export default Home;
