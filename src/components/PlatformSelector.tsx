import React from 'react';
import { Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';
import type { Platform } from '../types';

interface PlatformSelectorProps {
  selectedPlatform: Platform;
  onSelect: (platform: Platform) => void;
}

const platforms: { id: Platform; icon: React.ElementType; label: string }[] = [
  { id: 'twitter', icon: Twitter, label: 'Twitter' },
  { id: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
  { id: 'facebook', icon: Facebook, label: 'Facebook' },
  { id: 'instagram', icon: Instagram, label: 'Instagram' },
];

export function PlatformSelector({ selectedPlatform, onSelect }: PlatformSelectorProps) {
  return (
    <div className="flex gap-4 mb-6">
      {platforms.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={`flex flex-col items-center p-4 rounded-lg transition-all ${
            selectedPlatform === id
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <Icon className="w-6 h-6 mb-2" />
          <span className="text-sm font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}