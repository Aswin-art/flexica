export function formatPrice(number: number | undefined | null) {
  if (number === undefined || number === null) {
    return "IDR 0";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
}

export function formatDate(
  date: string | Date | null | undefined,
  withTime: boolean = false
): string | undefined {
  if (!date) return undefined;

  const parsedDate = typeof date === "string" ? new Date(date) : date;

  if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) {
    return undefined;
  }

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime && { hour: "2-digit", minute: "2-digit" }),
  };

  return new Intl.DateTimeFormat("en-US", options).format(parsedDate);
}
