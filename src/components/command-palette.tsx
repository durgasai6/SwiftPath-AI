"use client";

import { useRouter } from "next/navigation";
import { BarChart3, Bell, Bot, FileText, Home, Search, Truck, Workflow } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command";

const commandItems = [
  {
    heading: "Navigation",
    items: [
      { label: "Dashboard overview", href: "/dashboard", icon: Home, shortcut: "G D" },
      { label: "Suppliers", href: "/dashboard/suppliers", icon: Truck, shortcut: "G S" },
      { label: "Alerts", href: "/dashboard/alerts", icon: Bell, shortcut: "G A" },
      { label: "Agent activity", href: "/dashboard/agents", icon: Bot, shortcut: "G G" },
      { label: "Agentic ops", href: "/dashboard/ops", icon: Workflow, shortcut: "G O" },
      { label: "Reports", href: "/dashboard/reports", icon: FileText, shortcut: "G R" }
    ]
  },
  {
    heading: "Quick actions",
    items: [
      { label: "Generate a new executive report", href: "/dashboard/reports", icon: BarChart3, shortcut: "Ctrl R" },
      { label: "Investigate current high-risk suppliers", href: "/dashboard/suppliers", icon: Search, shortcut: "Ctrl I" }
    ]
  }
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0">
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
        <Command>
          <CommandInput placeholder="Search pages, actions, and workflows..." />
          <CommandList className="scrollbar-thin">
            <CommandEmpty>No matching command found.</CommandEmpty>
            {commandItems.map((group, index) => (
              <div key={group.heading}>
                {index > 0 ? <CommandSeparator /> : null}
                <CommandGroup heading={group.heading}>
                  {group.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <CommandItem
                        key={item.label}
                        onSelect={() => {
                          router.push(item.href);
                          onOpenChange(false);
                        }}
                      >
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="flex-1">{item.label}</span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
                          {item.shortcut}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </div>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
