// A single 4-digit PIN field, used for creating, confirming and unlocking.
// - numbers only, exactly 4 digits
// - masked as dots (type="password"), numeric keypad on mobile
// - short "••••" placeholder that can never overflow the box
// - font-size 20px so iOS Safari doesn't auto-zoom on focus
export default function PinInput({ value, onChange, ...rest }) {
  return (
    <input
      type="password"
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="off"
      maxLength={4}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
      placeholder="••••"
      // text-xl → 20px (>=16px avoids iOS zoom). overflow/ellipsis + block so the
      // placeholder or digits can never spill outside the rounded box.
      className="block w-40 max-w-full mx-auto text-center text-xl font-display font-bold
                 tracking-[0.35em] rounded-2xl border-4 border-slate-200 py-3 px-2
                 outline-none focus:border-brand-purple
                 overflow-hidden text-ellipsis whitespace-nowrap"
      {...rest}
    />
  )
}
