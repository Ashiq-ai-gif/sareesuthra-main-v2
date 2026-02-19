import { FormEvent, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { orderService, Order } from "@/lib/services/orderService";
import { formatPrice } from "@/lib/products";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";

const TrackOrder = () => {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!mobile.trim()) {
      toast.error("Please enter your mobile number");
      return;
    }

    setLoading(true);
    try {
      const results = await orderService.getOrdersByMobile(mobile.trim());
      setOrders(results || []);
      if (!results || results.length === 0) {
        toast.info("No orders found for this number");
      }
    } catch (error) {
      console.error("Track order failed", error);
      toast.error("Unable to fetch orders right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <section className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="font-heading text-4xl md:text-5xl mb-4 text-puniora-orange">Track Your Order</h1>
            <p className="text-muted-foreground text-lg">
              Enter the same mobile number used at checkout to view your order status.
            </p>
          </div>

          <Card className="border-gold/20">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                <Input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter mobile number"
                  className="h-12"
                  inputMode="tel"
                />
                <Button type="submit" className="h-12 bg-gold hover:bg-gold/90 text-white" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-2" />} Check Status
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">Order #{order.order_number || order.id.slice(0, 8)}</p>
                    <span className="text-xs px-3 py-1 rounded-full bg-gold/10 text-gold font-semibold">
                      {order.tracking_status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Date: {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                  <p className="text-sm text-muted-foreground">Total: {formatPrice(order.total_amount)}</p>
                  {order.tracking_id && <p className="text-sm">Tracking ID: {order.tracking_id}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Footer />
      <SEO
        title="Track Order"
        description="Track your Saree Sutra order with your checkout mobile number and get real-time order status updates."
        url="/track-order"
      />
    </main>
  );
};

export default TrackOrder;
