"use client";

import { useState, useTransition } from "react";
import { 
  Package, FolderTree, ShoppingBag, Send, MessagesSquare, 
  Trash2, Edit, Plus, LogOut, Check, X, FileDown, AlertTriangle 
} from "lucide-react";
import { 
  adminLogoutAction,
  addProductAction, updateProductAction, deleteProductAction,
  addCategoryAction, updateCategoryAction, deleteCategoryAction,
  updateOrderStatusAction, deleteOrderAction,
  updateCustomOrderStatusAction, deleteCustomOrderAction,
  deleteMessageAction
} from "./actions";

type Variant = {
  label: string;
  options: string[];
};

type Product = {
  _id: string;
  slug: string;
  category: string;
  name: string;
  tagline: string;
  description: string;
  details: string[];
  price: number;
  image: string;
  gallery: string[];
  variants: Variant[];
  badge?: string;
  isCustomRequest?: boolean;
  orderIndex?: number;
};

type Category = {
  _id: string;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  image: string;
  customOrderHref?: string;
  customOrderLabel?: string;
};

type OrderItem = {
  slug: string;
  name: string;
  price: number;
  qty: number;
  variantLabel: string;
};

type Order = {
  _id: string;
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes?: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
};

type CustomOrder = {
  _id: string;
  id: string;
  type: string;
  name: string;
  phone: string;
  email: string;
  description: string;
  attachment?: string;
  status: string;
  createdAt: string;
};

type Message = {
  _id: string;
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

type Props = {
  initialProducts: any[];
  initialCategories: any[];
  initialOrders: any[];
  initialCustomOrders: any[];
  initialMessages: any[];
};

export default function AdminDashboard({
  initialProducts,
  initialCategories,
  initialOrders,
  initialCustomOrders,
  initialMessages,
}: Props) {
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "orders" | "custom_orders" | "messages">("products");
  
  // State from Convex (client-side copies so edits take place instantly, though page updates on reload)
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>(initialCustomOrders);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  // Form Modals State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const [isPending, startTransition] = useTransition();

  async function handleLogout() {
    await adminLogoutAction();
    window.location.reload();
  }

  // Parse variants textarea to array: Label: Option1, Option2
  function parseVariants(text: string): Variant[] {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split(":");
        if (parts.length < 2) return null;
        const label = parts[0].trim();
        const options = parts[1]
          .split(",")
          .map((o) => o.trim())
          .filter(Boolean);
        return { label, options };
      })
      .filter((v): v is Variant => v !== null);
  }

  // Format variants array back to textarea format
  function formatVariants(variantsList: Variant[]): string {
    return (variantsList || [])
      .map((v) => `${v.label}: ${v.options.join(", ")}`)
      .join("\n");
  }

  // Delete product action
  async function handleDeleteProduct(id: string) {
    if (!confirm("Сигурни ли сте, че искате да изтриете този продукт? (Ще бъде скрит, но ще остане в базата данни за сигурност)")) return;
    await deleteProductAction(id);
    setProducts(products.filter((p) => p._id !== id));
  }

  // Add/Edit product submit
  async function handleProductSubmit(e: React.FormEvent<HTMLFormElement>, isEdit: boolean) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Parse variants field
    const rawVariants = formData.get("variants_text")?.toString() || "";
    const parsed = parseVariants(rawVariants);
    formData.set("variants", JSON.stringify(parsed));

    startTransition(async () => {
      if (isEdit && editingProduct) {
        await updateProductAction(editingProduct._id, formData);
        alert("Продуктът е обновен успешно!");
      } else {
        await addProductAction(formData);
        alert("Продуктът е добавен успешно!");
      }
      window.location.reload();
    });
  }

  // Delete category action
  async function handleDeleteCategory(id: string) {
    if (!confirm("Сигурни ли сте, че искате да изтриете тази категория? (Всички продукти в нея ще се запазят)")) return;
    await deleteCategoryAction(id);
    setCategories(categories.filter((c) => c._id !== id));
  }

  // Add/Edit category submit
  async function handleCategorySubmit(e: React.FormEvent<HTMLFormElement>, isEdit: boolean) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      if (isEdit && editingCategory) {
        await updateCategoryAction(editingCategory._id, formData);
        alert("Категорията е обновена успешно!");
      } else {
        await addCategoryAction(formData);
        alert("Категорията е добавена успешно!");
      }
      window.location.reload();
    });
  }

  // Change order status
  async function handleOrderStatusChange(id: string, status: string) {
    await updateOrderStatusAction(id, status);
    setOrders(orders.map((o) => (o._id === id ? { ...o, status } : o)));
  }

  // Delete order
  async function handleDeleteOrder(id: string) {
    if (!confirm("Сигурни ли сте, че искате да изтриете тази поръчка?")) return;
    await deleteOrderAction(id);
    setOrders(orders.filter((o) => o._id !== id));
  }

  // Change custom order status
  async function handleCustomOrderStatusChange(id: string, status: string) {
    await updateCustomOrderStatusAction(id, status);
    setCustomOrders(customOrders.map((o) => (o._id === id ? { ...o, status } : o)));
  }

  // Delete custom order
  async function handleDeleteCustomOrder(id: string) {
    if (!confirm("Сигурни ли сте, че искате да изтриете тази заявка?")) return;
    await deleteCustomOrderAction(id);
    setCustomOrders(customOrders.filter((o) => o._id !== id));
  }

  // Delete message
  async function handleDeleteMessage(id: string) {
    if (!confirm("Сигурни ли сте, че искате да изтриете това съобщение?")) return;
    await deleteMessageAction(id);
    setMessages(messages.filter((m) => m._id !== id));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-ink-line pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="font-head text-xs uppercase tracking-[0.25em] text-spark">
            Защитен достъп
          </span>
          <h1 className="font-display mt-1 text-3xl text-bone uppercase tracking-wider">
            FUN CREATION АДМИН
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-fit items-center gap-2 rounded-sm border border-ink-line px-4 py-2 font-head text-sm uppercase tracking-wider text-bone-dim transition-colors hover:border-ember hover:text-ember"
        >
          <LogOut size={16} /> Изход
        </button>
      </div>

      {/* Warning Notice about soft delete */}
      <div className="mb-8 flex items-start gap-3 rounded-sm border border-spark/20 bg-spark/5 p-4 text-sm text-bone-dim">
        <AlertTriangle className="shrink-0 mt-0.5 text-spark" size={18} />
        <div>
          <span className="font-bold text-bone">Защита от изтриване (Soft Delete): </span>
          Всички изтрити от този панел продукти, категории, поръчки и съобщения се скриват веднага от сайта и панела, но се запазват в базата данни на Convex. Дори и хакер да влезе в панела, той не може да изтрие окончателно съдържанието.
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="mb-8 flex flex-wrap gap-2 border-b border-ink-line pb-4 font-head text-sm uppercase tracking-wider">
        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 transition-all ${
            activeTab === "products" ? "border-ember text-ember" : "border-transparent text-bone-dim hover:text-bone"
          }`}
        >
          <Package size={16} /> Продукти ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 transition-all ${
            activeTab === "categories" ? "border-ember text-ember" : "border-transparent text-bone-dim hover:text-bone"
          }`}
        >
          <FolderTree size={16} /> Категории ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 transition-all ${
            activeTab === "orders" ? "border-ember text-ember" : "border-transparent text-bone-dim hover:text-bone"
          }`}
        >
          <ShoppingBag size={16} /> Поръчки ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("custom_orders")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 transition-all ${
            activeTab === "custom_orders" ? "border-ember text-ember" : "border-transparent text-bone-dim hover:text-bone"
          }`}
        >
          <Send size={16} /> Custom Поръчки ({customOrders.length})
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 transition-all ${
            activeTab === "messages" ? "border-ember text-ember" : "border-transparent text-bone-dim hover:text-bone"
          }`}
        >
          <MessagesSquare size={16} /> Съобщения ({messages.length})
        </button>
      </div>

      {/* Tab content */}
      <div className="rounded-sm border border-ink-line bg-ink-card p-4 sm:p-6">
        
        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl text-bone uppercase tracking-wider">Списък Продукти</h2>
              <button
                onClick={() => setIsAddingProduct(true)}
                className="flex items-center gap-1.5 rounded-sm bg-ember px-4 py-2.5 font-head text-xs uppercase tracking-wider text-bone transition-colors hover:bg-ember-dark"
              >
                <Plus size={16} /> Нов Продукт
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-bone-dim">
                <thead>
                  <tr className="border-b border-ink-line font-head text-xs uppercase tracking-wider text-bone">
                    <th className="pb-3 pl-2">Име / Slug</th>
                    <th className="pb-3">Категория</th>
                    <th className="pb-3">Цена</th>
                    <th className="pb-3">Сортиране</th>
                    <th className="pb-3 text-right pr-2">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-ink-line/50 hover:bg-ink-soft/40 transition-colors">
                      <td className="py-4 pl-2 font-bold text-bone">
                        <div>{product.name}</div>
                        <div className="font-mono text-xs font-normal text-bone-dim/60">/{product.slug}</div>
                      </td>
                      <td className="py-4 font-mono text-xs uppercase tracking-wider">{product.category}</td>
                      <td className="py-4 font-head text-spark text-base">{product.isCustomRequest ? "Оферта" : `${product.price.toFixed(2)} €`}</td>
                      <td className="py-4 font-mono text-xs">{product.orderIndex ?? 10}</td>
                      <td className="py-4 text-right pr-2">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="flex h-8 w-8 items-center justify-center rounded-sm border border-ink-line text-bone-dim hover:border-spark hover:text-spark transition-colors"
                            title="Редактирай"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="flex h-8 w-8 items-center justify-center rounded-sm border border-ink-line text-bone-dim hover:border-ember hover:text-ember transition-colors"
                            title="Изтрий"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-bone-dim">Няма намерени продукти.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === "categories" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl text-bone uppercase tracking-wider">Списък Категории</h2>
              <button
                onClick={() => setIsAddingCategory(true)}
                className="flex items-center gap-1.5 rounded-sm bg-ember px-4 py-2.5 font-head text-xs uppercase tracking-wider text-bone transition-colors hover:bg-ember-dark"
              >
                <Plus size={16} /> Нова Категория
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-bone-dim">
                <thead>
                  <tr className="border-b border-ink-line font-head text-xs uppercase tracking-wider text-bone">
                    <th className="pb-3 pl-2">Име / Slug</th>
                    <th className="pb-3">Кратко Име</th>
                    <th className="pb-3">Слоган</th>
                    <th className="pb-3 text-right pr-2">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat._id} className="border-b border-ink-line/50 hover:bg-ink-soft/40 transition-colors">
                      <td className="py-4 pl-2 font-bold text-bone">
                        <div>{cat.name}</div>
                        <div className="font-mono text-xs font-normal text-bone-dim/60">/{cat.slug}</div>
                      </td>
                      <td className="py-4">{cat.shortName}</td>
                      <td className="py-4 italic text-bone-dim/80">{cat.tagline}</td>
                      <td className="py-4 text-right pr-2">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingCategory(cat)}
                            className="flex h-8 w-8 items-center justify-center rounded-sm border border-ink-line text-bone-dim hover:border-spark hover:text-spark transition-colors"
                            title="Редактирай"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat._id)}
                            className="flex h-8 w-8 items-center justify-center rounded-sm border border-ink-line text-bone-dim hover:border-ember hover:text-ember transition-colors"
                            title="Изтрий"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-bone-dim">Няма намерени категории.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div>
            <h2 className="font-display mb-6 text-xl text-bone uppercase tracking-wider">Поръчки</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-bone-dim">
                <thead>
                  <tr className="border-b border-ink-line font-head text-xs uppercase tracking-wider text-bone">
                    <th className="pb-3 pl-2">ID / Дата</th>
                    <th className="pb-3">Клиент</th>
                    <th className="pb-3">Град / Адрес</th>
                    <th className="pb-3">Продукти</th>
                    <th className="pb-3">Общо</th>
                    <th className="pb-3">Статус</th>
                    <th className="pb-3 text-right pr-2">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-ink-line/50 hover:bg-ink-soft/40 transition-colors">
                      <td className="py-4 pl-2 font-mono text-xs">
                        <div className="font-bold text-spark">#{order.id}</div>
                        <div className="text-bone-dim/50">{new Date(order.createdAt).toLocaleDateString("bg-BG")}</div>
                      </td>
                      <td className="py-4">
                        <div className="font-bold text-bone">{order.name}</div>
                        <div className="text-xs text-bone-dim/80">{order.phone}</div>
                        <div className="text-xs text-bone-dim/60">{order.email}</div>
                      </td>
                      <td className="py-4 max-w-[150px] truncate">
                        <div className="font-bold text-bone">{order.city}</div>
                        <div className="text-xs">{order.address}</div>
                        {order.notes && <div className="text-[11px] text-spark italic">Бел: {order.notes}</div>}
                      </td>
                      <td className="py-4">
                        <ul className="list-disc pl-4 text-xs space-y-0.5">
                          {order.items.map((item, idx) => (
                            <li key={idx}>
                              {item.name} ({item.variantLabel || "без вариант"}) x{item.qty} - {item.price.toFixed(2)} €
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-4 font-head text-bone text-base">{order.total.toFixed(2)} €</td>
                      <td className="py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                          className="rounded-sm border border-ink-line bg-ink text-xs text-bone py-1 px-2 focus:border-ember focus:outline-none"
                        >
                          <option value="нова">Нова</option>
                          <option value="обработена">Обработена</option>
                          <option value="изпратена">Изпратена</option>
                          <option value="завършена">Завършена</option>
                        </select>
                      </td>
                      <td className="py-4 text-right pr-2">
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-sm border border-ink-line text-bone-dim hover:border-ember hover:text-ember transition-colors ml-auto"
                          title="Скрий поръчка"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-bone-dim">Няма намерени поръчки.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CUSTOM ORDERS TAB */}
        {activeTab === "custom_orders" && (
          <div>
            <h2 className="font-display mb-6 text-xl text-bone uppercase tracking-wider">Индивидуални (Custom) Заявки</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-bone-dim">
                <thead>
                  <tr className="border-b border-ink-line font-head text-xs uppercase tracking-wider text-bone">
                    <th className="pb-3 pl-2">ID / Тип / Дата</th>
                    <th className="pb-3">Клиент</th>
                    <th className="pb-3">Описание на поръчката</th>
                    <th className="pb-3">Файл</th>
                    <th className="pb-3">Статус</th>
                    <th className="pb-3 text-right pr-2">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {customOrders.map((co) => (
                    <tr key={co._id} className="border-b border-ink-line/50 hover:bg-ink-soft/40 transition-colors">
                      <td className="py-4 pl-2 font-mono text-xs">
                        <div className="font-bold text-spark">#{co.id}</div>
                        <div className="font-head text-[10px] uppercase tracking-wider text-bone-dim">{co.type === "3d-printing" ? "3D Печат" : "Принт"}</div>
                        <div className="text-bone-dim/50">{new Date(co.createdAt).toLocaleDateString("bg-BG")}</div>
                      </td>
                      <td className="py-4">
                        <div className="font-bold text-bone">{co.name}</div>
                        <div className="text-xs text-bone-dim/80">{co.phone}</div>
                        <div className="text-xs text-bone-dim/60">{co.email}</div>
                      </td>
                      <td className="py-4 max-w-sm whitespace-pre-line text-xs">{co.description}</td>
                      <td className="py-4">
                        {co.attachment ? (
                          <a
                            href={`/uploads/${co.attachment}`}
                            download
                            className="inline-flex items-center gap-1 text-xs text-spark hover:underline"
                          >
                            <FileDown size={14} /> Изтегли
                          </a>
                        ) : (
                          <span className="text-xs text-bone-dim/40 italic">няма файл</span>
                        )}
                      </td>
                      <td className="py-4">
                        <select
                          value={co.status}
                          onChange={(e) => handleCustomOrderStatusChange(co._id, e.target.value)}
                          className="rounded-sm border border-ink-line bg-ink text-xs text-bone py-1 px-2 focus:border-ember focus:outline-none"
                        >
                          <option value="нова">Нова</option>
                          <option value="обработена">Обработена</option>
                          <option value="изпратена">Изпратена</option>
                          <option value="завършена">Завършена</option>
                        </select>
                      </td>
                      <td className="py-4 text-right pr-2">
                        <button
                          onClick={() => handleDeleteCustomOrder(co._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-sm border border-ink-line text-bone-dim hover:border-ember hover:text-ember transition-colors ml-auto"
                          title="Скрий поръчка"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {customOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-bone-dim">Няма намерени индивидуални заявки.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === "messages" && (
          <div>
            <h2 className="font-display mb-6 text-xl text-bone uppercase tracking-wider">Входящи Съобщения</h2>
            <div className="overflow-y-auto max-h-[600px] space-y-4">
              {messages.map((msg) => (
                <div key={msg._id} className="relative rounded-sm border border-ink-line bg-ink p-5">
                  <button
                    onClick={() => handleDeleteMessage(msg._id)}
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-sm border border-ink-line text-bone-dim hover:border-ember hover:text-ember transition-colors"
                    title="Скрий съобщение"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="mb-2 flex items-center justify-between border-b border-ink-line/40 pb-2">
                    <div>
                      <div className="font-bold text-bone">{msg.name}</div>
                      <div className="text-xs text-spark">{msg.email}</div>
                    </div>
                    <div className="text-xs text-bone-dim/50 pr-10">{new Date(msg.createdAt).toLocaleDateString("bg-BG")}</div>
                  </div>
                  <p className="whitespace-pre-line text-sm text-bone-dim">{msg.message}</p>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="py-8 text-center text-bone-dim">Няма входящи съобщения.</div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* =======================================================================
          MODAL: ADD/EDIT PRODUCT
          ======================================================================= */}
      {(isAddingProduct || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-sm border border-ink-line bg-ink-card p-6 shadow-2xl my-8">
            <div className="mb-5 flex items-center justify-between border-b border-ink-line pb-3">
              <h3 className="font-display text-lg text-bone uppercase tracking-wider">
                {editingProduct ? "Редактирай Продукт" : "Добави Нов Продукт"}
              </h3>
              <button
                onClick={() => {
                  setIsAddingProduct(false);
                  setEditingProduct(null);
                }}
                className="text-bone-dim hover:text-bone"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => handleProductSubmit(e, !!editingProduct)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">Име *</span>
                  <input name="name" required defaultValue={editingProduct?.name} className="input" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">Slug (напр: teniska-metal) *</span>
                  <input name="slug" required defaultValue={editingProduct?.slug} className="input" />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">Категория *</span>
                  <select name="category" defaultValue={editingProduct?.category} className="input">
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.shortName}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">Цена (в EUR) *</span>
                  <input name="price" type="number" step="0.01" required defaultValue={editingProduct?.price ?? 0} className="input" />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">Кратък рекламен слоган (Tagline) *</span>
                <input name="tagline" required defaultValue={editingProduct?.tagline} className="input" />
              </label>

              <label className="block">
                <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">Описание *</span>
                <textarea name="description" rows={3} required defaultValue={editingProduct?.description} className="input resize-none" />
              </label>

              <label className="block">
                <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">
                  Основни характеристики (по един ред за всяка)
                </span>
                <textarea 
                  name="details" 
                  rows={3} 
                  defaultValue={editingProduct?.details?.join("\n")} 
                  placeholder="Напр:&#10;100% органичен памук&#10;Ситопечат с висока трайност"
                  className="input resize-none" 
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">Основна снимка (Път/URL)</span>
                  <input name="image" defaultValue={editingProduct?.image} className="input" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">Етикет (badge)</span>
                  <input name="badge" defaultValue={editingProduct?.badge} placeholder="напр: Бестселър, Нов" className="input" />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">
                  Галерия със снимки (пътища на нови редове)
                </span>
                <textarea 
                  name="gallery" 
                  rows={2} 
                  defaultValue={editingProduct?.gallery?.join("\n")} 
                  className="input resize-none" 
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">
                  Варианти (Формат: Label: Option1, Option2, Option3)
                </span>
                <textarea 
                  name="variants_text" 
                  rows={3} 
                  defaultValue={editingProduct ? formatVariants(editingProduct.variants) : "Размер: S, M, L, XL, XXL"} 
                  placeholder="Размер: S, M, L, XL, XXL&#10;Цвят: Черна, Бяла"
                  className="input resize-none" 
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">Поредност при сортиране</span>
                  <input name="orderIndex" type="number" defaultValue={editingProduct?.orderIndex ?? 10} className="input" />
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none pt-7">
                  <input
                    name="isCustomRequest"
                    type="checkbox"
                    defaultChecked={editingProduct?.isCustomRequest}
                    className="h-4 w-4 rounded-sm border-ink-line bg-ink accent-ember text-ember focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="font-head text-xs uppercase tracking-wider text-bone-dim">
                    Това е Custom поръчка (По оферта)
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-ink-line">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 rounded-sm bg-ember py-3 font-head text-sm uppercase tracking-wider text-bone transition-colors hover:bg-ember-dark disabled:opacity-60"
                >
                  {isPending ? "Запис..." : "Запиши продукта"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingProduct(false);
                    setEditingProduct(null);
                  }}
                  className="rounded-sm border border-ink-line px-6 py-3 font-head text-sm uppercase tracking-wider text-bone-dim hover:text-bone"
                >
                  Отказ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =======================================================================
          MODAL: ADD/EDIT CATEGORY
          ======================================================================= */}
      {(isAddingCategory || editingCategory) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-sm border border-ink-line bg-ink-card p-6 shadow-2xl my-8">
            <div className="mb-5 flex items-center justify-between border-b border-ink-line pb-3">
              <h3 className="font-display text-lg text-bone uppercase tracking-wider">
                {editingCategory ? "Редактирай Категория" : "Добави Нова Категория"}
              </h3>
              <button
                onClick={() => {
                  setIsAddingCategory(false);
                  setEditingCategory(null);
                }}
                className="text-bone-dim hover:text-bone"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => handleCategorySubmit(e, !!editingCategory)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">Име *</span>
                  <input name="name" required defaultValue={editingCategory?.name} className="input" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">Slug *</span>
                  <input name="slug" required defaultValue={editingCategory?.slug} className="input" />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">Кратко Име *</span>
                  <input name="shortName" required defaultValue={editingCategory?.shortName} className="input" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">Изображение (Път) *</span>
                  <input name="image" required defaultValue={editingCategory?.image} className="input" />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">Слоган (Tagline) *</span>
                <input name="tagline" required defaultValue={editingCategory?.tagline} className="input" />
              </label>

              <label className="block">
                <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">Описание *</span>
                <textarea name="description" rows={3} required defaultValue={editingCategory?.description} className="input resize-none" />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">Custom поръчка URL</span>
                  <input name="customOrderHref" defaultValue={editingCategory?.customOrderHref} placeholder="/custom-order/print-on-demand" className="input" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">Custom бутон текст</span>
                  <input name="customOrderLabel" defaultValue={editingCategory?.customOrderLabel} placeholder="Поръчай custom дизайн" className="input" />
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-ink-line">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 rounded-sm bg-ember py-3 font-head text-sm uppercase tracking-wider text-bone transition-colors hover:bg-ember-dark disabled:opacity-60"
                >
                  {isPending ? "Запис..." : "Запиши категория"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCategory(false);
                    setEditingCategory(null);
                  }}
                  className="rounded-sm border border-ink-line px-6 py-3 font-head text-sm uppercase tracking-wider text-bone-dim hover:text-bone"
                >
                  Отказ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
