export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags?: string[];
  featured?: boolean;
  customizationOptions?: {
    id: string;
    name: string;
    price: number;
  }[];
}

const locuraExtras = [
  { id: "extra-cheddar", name: "Extra cheddar", price: 2000 },
  { id: "extra-bacon", name: "Extra bacon", price: 2000 },
  { id: "extra-carne-smash", name: "Extra carne smash", price: 10000 },
  { id: "extra-salsa", name: "Extra salsa", price: 1000 },
  { id: "extra-pepinillos", name: "Extra pepinillos", price: 1000 },
];

export const menuItems: MenuItem[] = [
  {
    id: "smash-burger",
    name: "Smash Burger",
    description:
      "Pan tostado, 100g carne, queso cheddar, cebolla caramelizada, repollo picado y salsa.",
    price: 15000,
    image: "/images/burgers/smash-burger.png",
    category: "burgers",
    tags: ["popular"],
    featured: true,
    customizationOptions: locuraExtras,
  },
  {
    id: "doble-smash",
    name: "Doble Smash",
    description:
      "Pan tostado, doble carne 100g, doble queso cheddar, cebolla caramelizada, repollo picado, salsa especial y pepinillos.",
    price: 25000,
    image: "/images/burgers/doble-smash.png",
    category: "burgers",
    tags: ["recomendado"],
    featured: true,
    customizationOptions: locuraExtras,
  },
  {
    id: "triple-smash",
    name: "Triple Smash",
    description:
      "Pan tostado, triple carne 100g, triple queso cheddar, cebolla caramelizada, repollo picado, salsa especial y pepinillos.",
    price: 35000,
    image: "/images/burgers/triple-smash.png",
    category: "burgers",
    tags: ["brutal", "premium"],
    featured: true,
    customizationOptions: locuraExtras,
  },
  {
    id: "smash-especial",
    name: "Smash Especial",
    description:
      "Pan tostado, 100g carne, doble queso cheddar, cebolla caramelizada, repollo picado, salsa especial y bacon crujiente.",
    price: 25000,
    image: "/images/burgers/smash-especial.png",
    category: "burgers",
    tags: ["bacon"],
    customizationOptions: locuraExtras,
  },
  {
    id: "smash-premium",
    name: "Smash Premium",
    description:
      "Pan tostado, doble carne 100g, doble queso cheddar, cebolla caramelizada, repollo picado, bacon crujiente, pepinillos, salsa especial y salsa BBQ.",
    price: 35000,
    image: "/images/burgers/smash-premium.png",
    category: "burgers",
    tags: ["premium", "destacado"],
    featured: true,
    customizationOptions: locuraExtras,
  },
  {
    id: "burger-parrilla",
    name: "Burger a la parrilla",
    description:
      "150 g de carne, pan tostado, cebolla caramelizada, queso cheddar, queso muzzarella y salsa especial.",
    price: 22000,
    image: "/images/parrilla/burger-parrilla.png",
    category: "parrilla",
    tags: ["parrilla"],
    customizationOptions: locuraExtras,
  },
  {
    id: "papas-chicas",
    name: "Papas fritas Chicas",
    description: "Porción chica de papas fritas.",
    price: 10000,
    image: "/images/papas/papas-chicas.png",
    category: "papas",
  },
  {
    id: "papas-medianas",
    name: "Papas fritas Medianas",
    description: "Porción mediana de papas fritas.",
    price: 15000,
    image: "/images/papas/papas-medianas.png",
    category: "papas",
  },
  {
    id: "papas-locura",
    name: "Papas Locura",
    description: "Papas fritas con lluvia de bacon y queso cheddar.",
    price: 20000,
    image: "/images/papas/papas-locura.png",
    category: "papas",
    tags: ["destacado"],
    featured: true,
    customizationOptions: locuraExtras,
  },
  {
    id: "coca-250",
    name: "Coca Cola 250 ml",
    description: "",
    price: 4000,
    image: "/images/bebidas/coca-250.png",
    category: "bebidas",
  },
  {
    id: "coca-500",
    name: "Coca Cola 500 ml",
    description: "",
    price: 8000,
    image: "/images/bebidas/coca-500.png",
    category: "bebidas",
  },
  {
    id: "coca-1l",
    name: "Coca Cola 1 litro",
    description: "",
    price: 10000,
    image: "/images/bebidas/coca-1l.png",
    category: "bebidas",
  },
  {
    id: "sprite-250",
    name: "Sprite 250 ml",
    description: "",
    price: 4000,
    image: "/images/bebidas/sprite-250.png",
    category: "bebidas",
  },
  {
    id: "sprite-500",
    name: "Sprite 500 ml",
    description: "",
    price: 8000,
    image: "/images/bebidas/sprite-500.png",
    category: "bebidas",
  },
  {
    id: "fanta-250",
    name: "Fanta Naranja 250 ml",
    description: "",
    price: 4000,
    image: "/images/bebidas/fanta-250.png",
    category: "bebidas",
  },
  {
    id: "fanta-500",
    name: "Fanta Naranja 500 ml",
    description: "",
    price: 8000,
    image: "/images/bebidas/fanta-500.png",
    category: "bebidas",
  },
  {
    id: "extra-cheddar-item",
    name: "Extra cheddar",
    description: "",
    price: 2000,
    image: "/images/extras/extra-cheddar.png",
    category: "extras",
  },
  {
    id: "extra-bacon-item",
    name: "Extra bacon",
    description: "",
    price: 2000,
    image: "/images/extras/extra-bacon.png",
    category: "extras",
  },
  {
    id: "extra-carne-smash-item",
    name: "Extra carne smash",
    description: "",
    price: 10000,
    image: "/images/extras/extra-carne-smash.png",
    category: "extras",
  },
  {
    id: "extra-salsa-item",
    name: "Extra salsa",
    description: "",
    price: 1000,
    image: "/images/extras/extra-salsa.png",
    category: "extras",
  },
  {
    id: "extra-pepinillos-item",
    name: "Extra pepinillos",
    description: "",
    price: 1000,
    image: "/images/extras/extra-pepinillos.png",
    category: "extras",
  },
];
