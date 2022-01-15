import { useEffect, useState } from 'react'
import { fetchData, Loot } from './bungieData'

const LootTable: React.FC = () => {
  const [loot, setLoot] = useState<Loot[]>()

  useEffect(() => {
    fetchData().then((loot) => setLoot(loot))
  }, [])

  return loot === undefined ? (
    <div>Loading</div>
  ) : (
    <div>{JSON.stringify(loot)}</div>
  )
}

export default LootTable
