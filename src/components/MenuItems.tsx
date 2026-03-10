import React, { useState, useEffect } from "react";
import MenuItem from "./MenuItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import {
  Search,
  Utensils,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { MenuItem as MenuItemType } from "./MenuData";

interface MenuItemsProps {
  selectedCategory: string;
  onItemClick: (item: MenuItemType) => void;
  onAddToCart: (item: MenuItemType) => void;
  items: MenuItemType[];
}

const defaultItems: MenuItemType[] = [
  {
    id: "1",
    name: "Smash Burger",
    description:
      "Pan tostado, 100g carne, queso cheddar, cebolla caramelizada, repollo picado y salsa.",
    price: 15000,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
    category: "burgers",
    tags: ["popular"],
    featured: true,
  },
  {
    id: "2",
    name: "Papas Locura",
    description: "Papas fritas con lluvia de bacon y queso cheddar.",
    price: 20000,
    image:
      "https://images.unsplash.com/photo-1633896949252-e3b8b16edc64?w=800&q=80",
    category: "papas",
    tags: ["destacado"],
    featured: true,
  },
];

const noop = (_item: MenuItemType) => {};

const MenuItems = ({
  selectedCategory = "burgers",
  onItemClick = noop,
  onAddToCart = noop,
  items = defaultItems,
}: MenuItemsProps) => {
  const [filteredItems, setFilteredItems] = useState<MenuItemType[]>([]);
  const [activeCategory, setActiveCategory] = useState(selectedCategory);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const gridClassName =
    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 auto-rows-fr items-stretch";
  const cardWrapperClassName =
    "h-[320px] sm:h-[340px] transform hover:scale-[1.01] transition-all duration-300";

  useEffect(() => {
    setActiveCategory(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    let result = items.filter((item) => item.category === activeCategory);

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          (item.tags &&
            item.tags.some((tag) => tag.toLowerCase().includes(term))),
      );
    }

    if (activeFilter) {
      result = result.filter(
        (item) => item.tags && item.tags.includes(activeFilter),
      );
    }

    setFilteredItems(result);
  }, [activeCategory, items, searchTerm, activeFilter]);

  const categories = [
    {
      id: "burgers",
      name: "Burgers",
      icon: <Utensils className="h-4 w-4 mr-2" />,
    },
    {
      id: "parrilla",
      name: "Parrilla",
      icon: <Utensils className="h-4 w-4 mr-2" />,
    },
    {
      id: "bebidas",
      name: "Bebidas",
      icon: <Utensils className="h-4 w-4 mr-2" />,
    },
    {
      id: "papas",
      name: "Papas",
      icon: <Utensils className="h-4 w-4 mr-2" />,
    },
    {
      id: "extras",
      name: "Extras",
      icon: <Utensils className="h-4 w-4 mr-2" />,
    },
  ];

  const availableTags = Array.from(
    new Set(
      items
        .filter((item) => item.category === activeCategory)
        .flatMap((item) => item.tags || []),
    ),
  );

  return (
    <div className="w-full bg-gradient-to-b from-zinc-950 to-zinc-900 p-4 md:p-6">
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 h-4 w-4" />
          <Input
            placeholder="Buscar en el menú..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-orange-800 focus:border-orange-500 rounded-full bg-zinc-900/80 text-white"
          />
        </div>

        <Button
          variant="outline"
          className="md:w-auto w-full border-orange-800 text-orange-400 hover:bg-orange-950/50 hover:text-orange-300"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      <Tabs
        defaultValue={activeCategory}
        value={activeCategory}
        onValueChange={setActiveCategory}
        className="w-full"
      >
        <TabsList className="w-full mb-6 bg-zinc-900 rounded-full p-1 shadow-md border border-orange-900 overflow-x-auto overflow-y-hidden no-scrollbar flex gap-2">
          {categories.map((category) => (
    <TabsTrigger
      key={category.id}
      value={category.id}
      className="shrink-0 rounded-full data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 py-2.5 px-4 flex items-center justify-center text-orange-300 whitespace-nowrap"
    >
      {category.icon}
      {category.name}
    </TabsTrigger>
        ))}
        </TabsList>

        {showFilters && availableTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-6 bg-zinc-900/50 p-3 rounded-lg border border-orange-900/50"
          >
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  setActiveFilter(activeFilter === tag ? null : tag)
                }
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                  activeFilter === tag
                    ? "bg-orange-600 text-white"
                    : "bg-zinc-900 text-orange-300 border border-orange-800 hover:bg-orange-950"
                }`}
              >
                {tag}
              </button>
            ))}
            {activeFilter && (
              <button
                onClick={() => setActiveFilter(null)}
                className="px-3 py-1 rounded-full text-sm font-medium bg-orange-950 text-orange-300 hover:bg-orange-900 transition-colors duration-200"
              >
                Limpiar filtros
              </button>
            )}
          </motion.div>
        )}

        {categories.map((category) => (
          <TabsContent
            key={category.id}
            value={category.id}
            className="mt-0 animate-in fade-in-50 duration-300"
          >
            <ScrollArea className="h-[calc(100vh-300px)] md:h-[600px] pr-4">
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="h-12 w-12 text-orange-700 mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-white">
                    No encontramos items
                  </h3>
                  <p className="text-orange-300 mb-4">
                    Proba ajustando tu busqueda o filtros
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setActiveFilter(null);
                    }}
                    className="text-orange-400 font-medium hover:underline"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  <div className={gridClassName}>
                    {filteredItems
                      .slice()
                      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
                      .map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className={cardWrapperClassName}
                        >
                          <MenuItem
                            id={item.id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            image={item.image}
                            category={item.category}
                            onViewDetails={() => onItemClick(item)}
                            onAddToCart={() => onAddToCart(item)}
                            featured={item.featured}
                            tags={item.tags}
                          />
                        </motion.div>
                      ))}
                  </div>
                </AnimatePresence>
              )}
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MenuItems;
