import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(string) {
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}

export function getUserInitials(name: string) {
  const [firstName, lastName] = name.split(' ');
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
}
