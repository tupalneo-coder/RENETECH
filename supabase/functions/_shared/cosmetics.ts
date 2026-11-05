export const COSMETIC_RULES = {
  nameColors: [
    { id: 'navy', label: 'Benchmark navy', value: '#202b3a', points: 0, levels: 0 },
    { id: 'teal', label: 'Circuit teal', value: '#087f8c', points: 50, levels: 0 },
    { id: 'violet', label: 'Violet', value: '#7047a3', points: 100, levels: 0 },
    { id: 'coral', label: 'Coral', value: '#c34b55', points: 0, levels: 3 }
  ],
  fonts: [
    { id: 'default', label: 'Sans serif', value: 'Arial, Helvetica, sans-serif', points: 0, levels: 0 },
    { id: 'serif', label: 'Serif', value: 'Georgia, serif', points: 75, levels: 0 },
    { id: 'mono', label: 'Monospace', value: '"Courier New", monospace', points: 200, levels: 0 }
  ],
  backgrounds: [
    { id: 'white', label: 'White', value: '#ffffff', points: 0, levels: 0 },
    { id: 'ocean', label: 'Ocean blue', value: '#e5f1fb', points: 0, levels: 2 },
    { id: 'sunset', label: 'Warm sunset', value: '#fff0d6', points: 150, levels: 0 }
  ],
  glows: [
    { id: 'none', label: 'Off', value: false, points: 0, levels: 0 },
    { id: 'soft', label: 'Soft glow', value: true, points: 0, levels: 1 }
  ]
} as const;

export type CosmeticField = keyof typeof COSMETIC_RULES;

export function getUnlockedCosmetics(points: number, completedLevels: number[]) {
  return Object.fromEntries(
    Object.entries(COSMETIC_RULES).map(([field, options]) => [
      field,
      options
        .filter(option => points >= option.points && completedLevels.length >= option.levels)
        .map(option => option.id)
    ])
  );
}
