'use client';

import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

type MobileMenuProps = {
  links: Array<{ name: string; path: string }>;
};

export function MobileMenu({ links }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-cyan-400"
        aria-label="Menú"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-16 right-4 bg-gray-900 border border-gray-800 rounded-lg shadow-lg p-4 z-50 w-64">
          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className="block px-4 py-2 text-gray-300 hover:text-cyan-400 hover:bg-gray-800 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}