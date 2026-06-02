import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getBaseUrl, setBaseUrl } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/configuracion")({ component: Conf });

function Conf() {
  const [url, setUrl] = useState(getBaseUrl());
  return (
    <AppLayout>
      <PageHeader title="Configuración" subtitle="Define la URL base del API de Horse Pedigree." />
      <Card className="max-w-xl">
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="url">URL base del API</Label>
            <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="http://localhost:5203" />
            <p className="text-xs text-muted-foreground mt-2">
              Sin barra al final. Por defecto: <code>http://localhost:5203</code> o <code>https://localhost:7202</code>.
            </p>
          </div>
          <Button onClick={() => { setBaseUrl(url); toast.success("URL guardada"); }}>Guardar</Button>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
