export default function deriveCategory(
  name: string
): 'Graphics Card' | 'Phone' | 'Laptop' {
  const t = name.toLocaleLowerCase()

  if (['gpu', 'rtx', 'rx'].some((kw) => t.includes(kw))) {
    return 'Graphics Card'
  }
  if (['book', 'pro', 'air', 'slim'].some((kw) => t.includes(kw))) {
    return 'Laptop'
  }
  return 'Phone'
}
