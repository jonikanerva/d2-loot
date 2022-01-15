import { useEffect, useState } from 'react'
import { fetchData, Item } from './bungieData'
import Weapon from './Weapon'

const LootTable: React.FC = () => {
  const [loot, setLoot] = useState<Item[]>()

  useEffect(() => {
    fetchData().then((loot) => setLoot(loot))
  }, [])

  if (loot === undefined) {
    return <h1>Loading...</h1>
  }

  const data = loot.filter(
    (loot) =>
      loot.source ===
      'Source: Complete strikes and earn rank-up packages from Commander Zavala.'
  )

  return (
    <div>
      <h3>{data[0].source}</h3>

      {data.map((item, key) => (
        <Weapon item={item} key={key} />
      ))}
    </div>
  )
}

export default LootTable
