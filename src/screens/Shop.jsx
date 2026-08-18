import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { useProgress } from '../game/ProgressContext'
import { AVATARS, THEMES, TOKENS, PACKS, isOwned } from '../game/shop'

export default function Shop() {
  const navigate = useNavigate()
  const { progress, purchase, updateProgress } = useProgress()
  const [flash, setFlash] = useState(null)

  function buy(item) {
    const res = purchase(item)
    if (res.ok) setFlash({ id: item.id, text: item.type === 'token' ? 'Added ❄️' : 'Unlocked! 🎉' })
    else setFlash({ id: item.id, text: res.reason === 'coins' ? 'Not enough coins' : 'Owned' })
    setTimeout(() => setFlash(null), 1400)
  }

  return (
    <div className="min-h-screen safe-t safe-b safe-x">
      <div className="max-w-[30rem] mx-auto flex flex-col gap-4 px-4 py-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="h-12 w-12 shrink-0 grid place-items-center rounded-full bg-white shadow-pop font-bold text-slate-500 active:scale-90 transition-transform"
            aria-label="Back home"
          >
            ✕
          </button>
          <h1 className="font-display font-extrabold text-2xl text-brand-purple flex-1">🛒 Coin Shop</h1>
          <span className="pill bg-brand-yellow !text-slate-800">💰 {progress.coins}</span>
        </div>

        {/* Avatars */}
        <Section title="Avatars" hint="Pick your character">
          {AVATARS.map((item) => (
            <ShopItem
              key={item.id}
              item={item}
              coins={progress.coins}
              owned={isOwned(progress, item)}
              equipped={progress.avatar === item.id}
              flash={flash?.id === item.id ? flash.text : null}
              onBuy={() => buy(item)}
              onEquip={() => updateProgress({ avatar: item.id })}
            />
          ))}
        </Section>

        {/* Themes */}
        <Section title="Theme Skins" hint="Change the app's look">
          {THEMES.map((item) => (
            <ShopItem
              key={item.id}
              item={item}
              coins={progress.coins}
              owned={isOwned(progress, item)}
              equipped={progress.theme === item.id}
              flash={flash?.id === item.id ? flash.text : null}
              onBuy={() => buy(item)}
              onEquip={() => updateProgress({ theme: item.id })}
            />
          ))}
        </Section>

        {/* Power-ups */}
        <Section title="Power-ups" hint={`You have ${progress.freezeTokens} freeze token${progress.freezeTokens === 1 ? '' : 's'}`}>
          {TOKENS.map((item) => (
            <ShopItem
              key={item.id}
              item={item}
              coins={progress.coins}
              owned={false}
              buyLabel="Buy"
              flash={flash?.id === item.id ? flash.text : null}
              onBuy={() => buy(item)}
            />
          ))}
        </Section>

        {/* Fun-fact packs */}
        <Section title="Fun-Fact Card Packs" hint="Collect them all!">
          {PACKS.map((item) => (
            <ShopItem
              key={item.id}
              item={item}
              coins={progress.coins}
              owned={isOwned(progress, item)}
              ownedLabel="Collected ✓"
              flash={flash?.id === item.id ? flash.text : null}
              onBuy={() => buy(item)}
            />
          ))}
        </Section>

        <p className="text-center text-xs on-bg-muted pb-6">
          Everything here is just for fun — nothing changes the quiz itself. 💜
        </p>
      </div>
    </div>
  )
}

function Section({ title, hint, children }) {
  return (
    <div className="card-fun">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-display font-extrabold text-slate-700">{title}</h2>
        <span className="text-xs text-slate-400">{hint}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  )
}

function ShopItem({ item, coins, owned, equipped, buyLabel, ownedLabel, flash, onBuy, onEquip }) {
  const canAfford = coins >= item.price
  let action
  if (flash) {
    action = <span className="text-xs font-display font-bold text-brand-purple">{flash}</span>
  } else if (equipped) {
    action = <span className="text-xs font-display font-extrabold text-brand-green">✓ Equipped</span>
  } else if (owned && onEquip) {
    action = (
      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={onEquip}
        className="min-h-[48px] px-5 flex items-center rounded-full shadow-pop text-sm font-display font-bold bg-brand-mist text-brand-purple active:brightness-95"
      >
        Equip
      </motion.button>
    )
  } else if (owned) {
    action = <span className="text-xs font-display font-bold text-brand-green">{ownedLabel || 'Owned ✓'}</span>
  } else {
    // Keep the button tappable even when unaffordable, so tapping shows the
    // friendly "Not enough coins" hint instead of a dead, greyed-out button.
    action = (
      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={onBuy}
        className={`min-h-[48px] px-5 flex items-center text-sm font-display font-bold rounded-full shadow-pop active:brightness-95
          ${canAfford ? 'bg-brand-purple text-white' : 'bg-slate-200 text-slate-500'}`}
      >
        {buyLabel || `💰 ${item.price}`}
      </motion.button>
    )
  }

  return (
    <div
      className={`rounded-2xl border-4 p-3 flex flex-col items-center text-center gap-1
        ${equipped ? 'border-brand-green bg-brand-green/5' : 'border-slate-100 bg-white'}`}
    >
      <span className="text-4xl">{item.emoji}</span>
      <span className="font-display font-bold text-sm text-slate-700 leading-tight">{item.name}</span>
      <div className="mt-2 min-h-[48px] flex items-center">{action}</div>
    </div>
  )
}
