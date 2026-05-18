import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface Props {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({ options, value, onChange, placeholder = "Chọn..." }: Props) {
  const [open, setOpen] = useState(false);
  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="w-full min-h-9 border border-input rounded-md px-3 py-1.5 text-sm bg-transparent flex items-center justify-between gap-2 hover:bg-accent/30"
        >
          <div className="flex flex-wrap gap-1 flex-1 text-left">
            {value.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              value.map((v) => (
                <span
                  key={v}
                  className="inline-flex items-center gap-1 bg-[#FCEAED] text-[#A32638] px-2 py-0.5 rounded-full text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(v);
                  }}
                >
                  {v}
                  <X className="w-3 h-3" />
                </span>
              ))
            )}
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-1" align="start">
        <div className="max-h-64 overflow-y-auto">
          {options.map((o) => {
            const checked = value.includes(o);
            return (
              <button
                key={o}
                type="button"
                onClick={() => toggle(o)}
                className="w-full flex items-center gap-2 px-2 py-2 text-sm rounded hover:bg-[#FCEAED] text-left"
              >
                <span className={`w-4 h-4 rounded border flex items-center justify-center ${checked ? "bg-[#A32638] border-[#A32638]" : "border-gray-300"}`}>
                  {checked && <Check className="w-3 h-3 text-white" />}
                </span>
                {o}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
