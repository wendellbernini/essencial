"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function EmailTest() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/email/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar e-mail");
      }

      toast.success("E-mail de teste enviado com sucesso!");
      setEmail("");
    } catch (error) {
      toast.error("Falha ao enviar e-mail de teste");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <Input
          type="email"
          placeholder="Digite seu e-mail para teste"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar E-mail Teste"}
        </Button>
      </div>
    </form>
  );
}
