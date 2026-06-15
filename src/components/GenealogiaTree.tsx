import { Link } from "@tanstack/react-router";
import type { EquinoGenealogia } from "@/lib/types";
import { cn } from "@/lib/utils";

function PersonNode({
  label,
  name,
  equinoId,
  highlight,
}: {
  label: string;
  name?: string | null;
  equinoId?: number;
  highlight?: boolean;
}) {
  const displayName = name?.trim() || "Sin registro";
  const body = (
    <div
      className={cn(
        "rounded-lg border px-4 py-3 min-w-[9.5rem] text-center transition-colors",
        highlight
          ? "border-accent bg-accent/10 shadow-sm"
          : "bg-card hover:border-accent/60",
        equinoId && name ? "cursor-pointer" : "",
      )}
    >
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={cn("mt-1 font-medium", !name && "text-muted-foreground italic")}>{displayName}</div>
    </div>
  );

  if (equinoId && name) {
    return (
      <Link to="/equinos/$id/genealogia" params={{ id: String(equinoId) }} className="block no-underline text-inherit">
        {body}
      </Link>
    );
  }

  return body;
}

function Branch({
  sideLabel,
  ancestro,
  abueloLabel,
  abuelaLabel,
}: {
  sideLabel: string;
  ancestro?: EquinoGenealogia["padre"];
  abueloLabel: string;
  abuelaLabel: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <PersonNode label={sideLabel} name={ancestro?.nombre} equinoId={ancestro?.equinoId} />
      <div className="h-5 w-px bg-border" />
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <PersonNode
          label={abueloLabel}
          name={ancestro?.padre?.nombre}
          equinoId={ancestro?.padre?.id}
        />
        <PersonNode
          label={abuelaLabel}
          name={ancestro?.madre?.nombre}
          equinoId={ancestro?.madre?.id}
        />
      </div>
    </div>
  );
}

export function GenealogiaTree({ g }: { g: EquinoGenealogia }) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="mx-auto flex min-w-[20rem] max-w-3xl flex-col items-center gap-6">
        <PersonNode label="Equino consultado" name={g.nombre} equinoId={g.equinoId} highlight />

        <div className="relative flex w-full justify-center gap-8 sm:gap-16">
          <div className="pointer-events-none absolute top-0 left-[25%] right-[25%] h-px bg-border" />
          <div className="pointer-events-none absolute top-0 left-1/2 h-6 w-px -translate-x-1/2 bg-border" />
          <div className="pointer-events-none absolute top-0 left-[25%] h-6 w-px bg-border" />
          <div className="pointer-events-none absolute top-0 right-[25%] h-6 w-px bg-border" />

          <Branch
            sideLabel="Padre"
            ancestro={g.padre}
            abueloLabel="Abuelo paterno"
            abuelaLabel="Abuela paterna"
          />
          <Branch
            sideLabel="Madre"
            ancestro={g.madre}
            abueloLabel="Abuelo materno"
            abuelaLabel="Abuela materna"
          />
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Haz clic en un ancestro registrado para ver su propia genealogía.
        </p>
      </div>
    </div>
  );
}
