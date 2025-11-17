export default function SafeDate({ value }) {
  if (typeof window === "undefined") return null;

  try {
    return new Date(value).toLocaleString("ar-EG");
  } catch {
    return "";
  }
}
