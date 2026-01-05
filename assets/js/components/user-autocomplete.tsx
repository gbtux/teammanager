import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

interface Props {
    options: { id: number; name: string }[];
    value: number | null;
    onChange: (value: number) => void;
    placeholder: string;
}

export function UserAutocomplete({ options, value, onChange, placeholder }: Props) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                    {value ? options.find((option) => option.id === value)?.name : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Rechercher un utilisateur..." />
                    <CommandEmpty>Aucun utilisateur trouvé.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-y-auto">
                        {options.map((option) => (
                            <CommandItem
                                key={option.id}
                                value={option.name} // Utilisé pour la recherche textuelle
                                onSelect={() => {
                                    onChange(option.id);
                                    setOpen(false);
                                }}
                            >
                                <Check className={cn('mr-2 h-4 w-4', value === option.id ? 'opacity-100' : 'opacity-0')} />
                                {option.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
