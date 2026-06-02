import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { clearBaseUrl, getBaseUrl, setBaseUrl } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/configuracion")({ component: Conf });

function Conf() {
  const [url, setUrl] = useState(getBaseUrl());
  const proxyTarget =
    (import.meta.env.VITE_API_PROXY_TARGET as string | undefined) || "https://localhost:7202/";

  return (
    <AppLayout>
      <PageHeader title="Configuración" subtitle="Define la URL base del API de Horse Pedigree." />
      <Card className="max-w-xl">
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="url">URL base del API</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={import.meta.env.DEV ? "(vacío = proxy local)" : proxyTarget}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Sin barra al final. En desarrollo, deja el campo <strong>vacío</strong> para usar el proxy
              de Vite (<code>/api</code> → <code>{proxyTarget}</code>) y evitar errores CORS.
              Si guardaste <code>{proxyTarget}</code> antes, usa &quot;Restaurar proxy&quot;.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => { setBaseUrl(url); toast.success("URL guardada"); }}>Guardar</Button>
            {import.meta.env.DEV && (
              <Button
                variant="secondary"
                onClick={() => {
                  clearBaseUrl();
                  setUrl("");
                  toast.success("Proxy de desarrollo activado");
                }}
              >
                Restaurar proxy
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
