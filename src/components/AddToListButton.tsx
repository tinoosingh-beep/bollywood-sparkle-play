import { Plus, Check } from 'lucide-react';
import { useMyList, type MyListItem } from '@/contexts/MyListContext';

interface AddToListButtonProps {
  item: Omit<MyListItem, 'addedAt'>;
  /** Visual variant to match the parent card's color scheme */
  variant?: 'default' | 'crimson' | 'cyan' | 'gold';
  className?: string;
}

const variantStyles = {
  default: {
    active: { background: 'hsla(45,100%,50%,0.15)', border: '1px solid hsla(45,100%,50%,0.4)', color: 'hsl(45, 100%, 55%)' },
    inactive: { background: 'hsla(0,0%,100%,0.05)', border: '1px solid hsla(0,0%,100%,0.15)', color: 'hsl(var(--muted-foreground))' },
  },
  crimson: {
    active: { background: 'hsla(340,85%,50%,0.15)', border: '1px solid hsla(340,85%,50%,0.4)', color: 'hsl(var(--crimson-glow))' },
    inactive: { background: 'hsla(340,85%,50%,0.06)', border: '1px solid hsla(340,85%,50%,0.25)', color: 'hsla(340,85%,70%,0.6)' },
  },
  cyan: {
    active: { background: 'hsla(180,100%,45%,0.15)', border: '1px solid hsla(180,100%,45%,0.4)', color: 'hsl(var(--neon-cyan))' },
    inactive: { background: 'hsla(180,100%,45%,0.06)', border: '1px solid hsla(180,100%,45%,0.25)', color: 'hsla(180,100%,70%,0.6)' },
  },
  gold: {
    active: { background: 'hsla(45,100%,50%,0.15)', border: '1px solid hsla(45,100%,50%,0.4)', color: 'hsl(var(--gold))' },
    inactive: { background: 'hsla(45,100%,50%,0.06)', border: '1px solid hsla(45,100%,50%,0.25)', color: 'hsla(45,100%,70%,0.5)' },
  },
};

export function AddToListButton({ item, variant = 'default', className = '' }: AddToListButtonProps) {
  const { isInList, toggleItem } = useMyList();
  const inList = isInList(item.id);
  const styles = variantStyles[variant];
  const currentStyle = inList ? styles.active : styles.inactive;

  return (
    <button
      onClick={(e) => { e.stopPropagation(); toggleItem(item); }}
      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover:brightness-110 ${className}`}
      style={{
        ...currentStyle,
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '0.8rem',
        letterSpacing: '0.08em',
      }}
      aria-label={inList ? `Remove ${item.title} from my list` : `Add ${item.title} to my list`}
    >
      {inList ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
      {inList ? 'In My List' : 'My List'}
    </button>
  );
}
