/**
 * Formats a bigint nanoseconds timestamp to a readable date string.
 */
export function formatNanoDate(nanos: bigint): string {
  const ms = Number(nanos / BigInt(1_000_000));
  const date = new Date(ms);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatNanoDateTime(nanos: bigint): string {
  const ms = Number(nanos / BigInt(1_000_000));
  const date = new Date(ms);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
