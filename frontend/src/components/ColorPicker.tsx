import { DEFAULT_TASK_COLORS } from '../types/planner';
import { Check } from 'lucide-react';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {DEFAULT_TASK_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onColorChange(color)}
          className={`
            w-10 h-10 rounded-full border-2 transition-all
            hover:scale-110 hover:shadow-md
            ${selectedColor === color
              ? 'border-gray-900 dark:border-gray-100 scale-110 shadow-md'
              : 'border-gray-300 dark:border-gray-600'
            }
          `}
          style={{ backgroundColor: color }}
          aria-label={`Select color ${color}`}
        >
          {selectedColor === color && (
            <Check size={16} className="text-white m-auto" />
          )}
        </button>
      ))}
    </div>
  );
}

