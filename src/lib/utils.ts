import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Opens the Booksy booking widget by triggering Booksy's native button
 */
export const openBooksyWidget = () => {
  // Try multiple selectors to find the Booksy button
  const selectors = [
    '.booksy-widget-button',
    '[class*="booksy-widget"]',
    'a[href*="booksy"]',
    'button[data-booksy]',
    '.booksy-trigger',
    'button.booksy',
  ]

  for (const selector of selectors) {
    const button = document.querySelector(selector) as HTMLElement
    if (button) {
      button.click()
      return
    }
  }

  // Try to access Booksy API directly
  const booksy = (window as any).booksy
  if (booksy && typeof booksy.open === 'function') {
    booksy.open()
    return
  }

  console.warn('Booksy widget not found. Please ensure Booksy script is loaded.')
};
