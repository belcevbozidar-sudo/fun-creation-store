import { checkAdminAuth } from "./actions";
import { convexClient } from "@/lib/convex-client";
import { api } from "../../../convex/_generated/api";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAuthenticated = await checkAdminAuth();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Fetch initial data from Convex on the server
  const products = await convexClient.query(api.products.list);
  const categories = await convexClient.query(api.categories.list);
  const orders = await convexClient.query(api.orders.list);
  const customOrders = await convexClient.query(api.custom_orders.list);
  const messages = await convexClient.query(api.contact_messages.list);

  return (
    <AdminDashboard
      initialProducts={products}
      initialCategories={categories}
      initialOrders={orders}
      initialCustomOrders={customOrders}
      initialMessages={messages}
    />
  );
}
