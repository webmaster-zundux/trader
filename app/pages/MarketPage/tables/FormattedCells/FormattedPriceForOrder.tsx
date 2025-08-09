export function FormattedPriceForOrder({ value }: { value: unknown }) {
  return (
    <>
      {(typeof value === 'number') ? value.toFixed(2) : (0).toFixed(2)}
    </>
  )
}
