import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * A kártya komponens, amely tartalmazza a kártya külső konténerét.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - A div elemhez tartozó tulajdonságok.
 * @param {string} [className] - További CSS osztályok, amelyek a kártya stílusát módosítják.
 * @returns {JSX.Element} A kártyát tartalmazó elem.
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"


/**
 * A kártya fejlécét tartalmazó komponens.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - A div elemhez tartozó tulajdonságok.
 * @param {string} [className] - További CSS osztályok a kártya fejlécének stílusához.
 * @returns {JSX.Element} A kártya fejléce.
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

/**
 * A kártya címét tartalmazó komponens.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - A div elemhez tartozó tulajdonságok.
 * @param {string} [className] - További CSS osztályok a kártya címének stílusához.
 * @returns {JSX.Element} A kártya címe.
 */
const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

/**
 * A kártya leírását tartalmazó komponens.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - A div elemhez tartozó tulajdonságok.
 * @param {string} [className] - További CSS osztályok a kártya leírásának stílusához.
 * @returns {JSX.Element} A kártya leírása.
 */
const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

/**
 * A kártya tartalmát tartalmazó komponens.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - A div elemhez tartozó tulajdonságok.
 * @param {string} [className] - További CSS osztályok a kártya tartalmának stílusához.
 * @returns {JSX.Element} A kártya tartalma.
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

/**
 * A kártya láblécét tartalmazó komponens.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - A div elemhez tartozó tulajdonságok.
 * @param {string} [className] - További CSS osztályok a kártya láblécének stílusához.
 * @returns {JSX.Element} A kártya lábléce.
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

/**
 * A kártya komponensek exportálása.
 * Tartalmazza a kártya, a fejléc, a cím, a leírás, a tartalom és a lábléc komponenseket.
 */
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
