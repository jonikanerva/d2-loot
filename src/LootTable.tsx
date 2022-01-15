import { useEffect, useState } from 'react'
import { fetchData, Loot } from './bungieData'

const LootTable: React.FC = () => {
  const [loot, setLoot] = useState<Loot[]>()

  useEffect(() => {
    fetchData().then((loot) => setLoot(loot))
  }, [])

  if (loot === undefined) {
    return <h1>Loading...</h1>
  }

  let prev = ''
  const data = loot
    .sort((a, b) => (a.source > b.source ? 1 : -1))
    .map(({ name, source }) => {
      const data =
        prev !== source
          ? {
              name,
              source,
            }
          : { name, source: undefined }
      prev = source

      return data
    })

  return (
    <div>
      {data.map(({ name, source }) => (
        <div>
          {source ? <h3>{source}</h3> : ''}
          <li>{name}</li>
        </div>
      ))}
    </div>
  )
}

export default LootTable
