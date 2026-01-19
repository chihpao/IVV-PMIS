import { Bold, Code, Heading1, Heading2, Italic, Link, List, ListOrdered, Quote } from 'lucide-react';

import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface MarkdownToolbarProps {
  onAction: (prefix: string, suffix?: string) => void;
  disabled?: boolean;
}

export const MarkdownToolbar = ({ onAction, disabled }: MarkdownToolbarProps) => {
  const actions = [
    { icon: Heading1, label: '標題 1', action: () => onAction('# ') },
    { icon: Heading2, label: '標題 2', action: () => onAction('## ') },
    { icon: Bold, label: '加粗', action: () => onAction('**', '**') },
    { icon: Italic, label: '斜體', action: () => onAction('_', '_') },
    { icon: List, label: '無序清單', action: () => onAction('- ') },
    { icon: ListOrdered, label: '有序清單', action: () => onAction('1. ') },
    { icon: Quote, label: '引用', action: () => onAction('> ') },
    { icon: Code, label: '程式碼', action: () => onAction('```\n', '\n```') },
    { icon: Link, label: '連結', action: () => onAction('[', '](url)') },
  ];

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-1 p-1 bg-neutral-100/50 border rounded-t-md">
        {actions.map((item, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="sm" disabled={disabled} className="h-8 w-8 p-0" onClick={item.action}>
                <item.icon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">{item.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};
