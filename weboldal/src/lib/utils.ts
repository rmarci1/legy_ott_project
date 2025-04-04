import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Különböző Tailwind CSS osztályneveket kombináló segédfüggvény.
 * A `cn` függvény a `clsx` és a `tailwind-merge` könyvtárakat használja,
 * hogy dinamikusan kezelje a CSS osztályokat, és biztosítsa azok megfelelő összeolvasztását.
 *
 * Ez a függvény elősegíti a könnyű és tiszta Tailwind osztályok használatát
 * különböző feltételek és kombinációk esetén, miközben biztosítja az ütközések elkerülését.
 *
 * @param inputs A CSS osztályok (stringek) és/vagy logikai értékek, amelyekből a végső osztály stringet képezzük.
 *
 * @returns {string} A kombinált és optimalizált CSS osztályok stringje.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
