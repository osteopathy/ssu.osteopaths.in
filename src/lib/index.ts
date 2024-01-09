// place files you want to import through the `$lib` alias in this folder.
import { clsx, type ClassValue } from 'clsx/lite';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
