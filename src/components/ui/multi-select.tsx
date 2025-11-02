"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, X, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

const multiSelectVariants = cva(
  "m-1",
  {
    variants: {
      variant: {
        default:
          "border-foreground bg-secondary text-secondary-foreground hover:bg-secondary/80",
        secondary:
          "border-foreground bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface MultiSelectOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface MultiSelectProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof multiSelectVariants> {
  options: MultiSelectOption[];
  selected: MultiSelectOption[];
  onChange: React.Dispatch<React.SetStateAction<MultiSelectOption[]>>;
  placeholder?: string;
  className?: string;
  creatable?: boolean;
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  ({ options, selected, onChange, className, variant, placeholder = 'Select options', creatable = false, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("");

    const handleUnselect = (item: MultiSelectOption) => {
      onChange(selected.filter((i) => i.value !== item.value))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && inputValue && creatable) {
          const newOption = { value: inputValue, label: inputValue };
          if (!options.some(o => o.value === newOption.value) && !selected.some(s => s.value === newOption.value)) {
            onChange([...selected, newOption]);
          }
          setInputValue("");
        }
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", className)}
            onClick={() => setOpen(!open)}
          >
            <div className="flex flex-wrap items-center gap-1">
              {selected.length > 0 ? (
                selected.map((item) => (
                  <Badge
                    key={item.value}
                    className={cn("mr-1", multiSelectVariants({ variant }))}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleUnselect(item);
                    }}
                  >
                    {item.label}
                    <X className="ml-1 h-3 w-3 cursor-pointer" />
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command onKeyDown={handleKeyDown}>
            <CommandInput 
                placeholder="Search ..." 
                value={inputValue}
                onValueChange={setInputValue}
            />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      const isSelected = selected.some(item => item.value === option.value);
                      if (isSelected) {
                        handleUnselect(option);
                      } else {
                        onChange([...selected, option]);
                      }
                      setOpen(true)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.some(item => item.value === option.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

MultiSelect.displayName = "MultiSelect"

export { MultiSelect }
