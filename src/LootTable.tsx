import { useEffect, useState } from 'react'
import { fetchData, Item } from './bungieData'
import SourceDropdown from './SourceDropdown'
import Weapon from './Weapon'
import './LootTable.css'

const LootTable: React.FC = () => {
  const [loot, setLoot] = useState<Item[]>()
  const [source, setSource] = useState<string>(
    'Complete strikes and earn rank-up packages from Commander Zavala.'
  )

  useEffect(() => {
    fetchData().then((loot) => setLoot(loot))
  }, [])

  if (loot === undefined) {
    return <h1>Loading...</h1>
  }

  const data = loot.filter((loot) => loot.source === source)
  const sourceList = [...new Set(loot.map((item) => item.source))].sort(
    (a, b) => (a > b ? 1 : -1)
  )

  return (
    <div>
      <SourceDropdown
        values={sourceList}
        defaultValue={source}
        onChangeFunction={(event) => setSource(event.target.value)}
      />
      <h3>{data[0]?.source}</h3>
      <div className="lootTable">
        {data.map((item, key) => (
          <Weapon item={item} key={key} />
        ))}
      </div>
    </div>
  )
}

export default LootTable
