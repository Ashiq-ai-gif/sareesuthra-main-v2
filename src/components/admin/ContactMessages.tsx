import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Phone, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

const ContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setMessages((data || []) as ContactMessage[]);
    } catch (err) {
      console.error("Failed to load messages:", err);
      toast.error("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) {
      toast.error("Could not delete message.");
      return;
    }
    setMessages((prev) => prev.filter((m) => m.id !== id));
    toast.success("Message deleted.");
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("en-IN", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {messages.length} message{messages.length === 1 ? "" : "s"} from the website contact form.
        </p>
        <Button variant="outline" size="sm" onClick={fetchMessages}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {messages.length === 0 ? (
        <div className="text-center text-muted-foreground py-16 italic">No messages yet.</div>
      ) : (
        messages.map((m) => (
          <Card key={m.id} className="border-border">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-bold">{m.name}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                    <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 hover:text-gold">
                      <Mail className="h-3.5 w-3.5" /> {m.email}
                    </a>
                    {m.phone && (
                      <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1 hover:text-gold">
                        <Phone className="h-3.5 w-3.5" /> {m.phone}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(m.created_at)}</span>
                  <Button variant="ghost" size="icon" onClick={() => deleteMessage(m.id)} aria-label="Delete">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-foreground/90">{m.message}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ContactMessages;
