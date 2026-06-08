'use client';
import { HexColorPicker } from 'react-colorful';
import { useState } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-10 h-10 rounded-lg border-2 border-slate-600 hover:border-slate-400 transition-colors flex-shrink-0"
          style={{ backgroundColor: value }}
          title="Pick colour"
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-28 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="#6366f1"
        />
      </div>
      {open && (
        <div className="absolute top-12 left-0 z-20 p-3 bg-slate-800 border border-slate-700 rounded-xl shadow-xl">
          <HexColorPicker color={value} onChange={onChange} />
          <button
            onClick={() => setOpen(false)}
            className="mt-2 w-full text-xs text-slate-400 hover:text-white py-1"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
