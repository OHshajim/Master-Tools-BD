
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Platform {
  _id?: string;
  name: string;
}

interface SearchablePlatformSelectProps {
  platforms: Platform[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function SearchablePlatformSelect({
  platforms,
  value,
  onValueChange,
  placeholder = "Select a platform",
  disabled = false,
  className
}: SearchablePlatformSelectProps) {
  const [open, setOpen] = React.useState(false)

  const selectedPlatform = platforms.find((platform) => platform._id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {selectedPlatform ? selectedPlatform.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-50" align="start">
        <Command>
          <CommandInput placeholder="Search platforms..." className="h-9" />
          <CommandList>
            <CommandEmpty>No platform found.</CommandEmpty>
            <CommandGroup>
              {platforms.map((platform) => (
                <CommandItem
                  key={platform._id}
                  value={platform.name}
                  onSelect={() => {
                    onValueChange(platform._id)
                    setOpen(false)
                  }}
                >
                  {platform.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === platform._id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
