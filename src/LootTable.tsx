import './LootTable.css'
import React, { Fragment, useEffect, useState } from 'react'
import VisibilityObserver from 'react-visibility-observer'
import { fetchData, groupBy, Item } from './bungieData'
import Header from './Header'
import Loading from './Loading'
import SearchBar from './SearchBar'
import Weapon from './Weapon'

const searchByName = (search: string, loot?: Item[]) => {
  if (search.length === 0) {
    return loot
  }
  const searchTerm = search.toLowerCase()

  return (
    loot?.filter((item) => {
      const name = item.name.toLowerCase()
      const source = item.source.toLowerCase()
      const type = item.weaponType.toLowerCase()

      return (
        name.includes(searchTerm) ||
        source.includes(searchTerm) ||
        type.includes(searchTerm)
      )
    }) || []
  )
}
const LootTable: React.FC = () => {
  const [loot, setLoot] = useState<Item[]>()
  const [data, setData] = useState<Item[]>()

  useEffect(() => {
    fetchData().then((loot) => {
      setLoot(loot)
      setData(loot)
    })
  }, [])

  const handleSearchOnChange = (search: string) => {
    const result = searchByName(search, loot)

    setData(result)
  }

  if (loot === undefined || data === undefined) {
    return <Loading />
  }

  if (data.length === 0) {
    return <Header title="Nothing found..." />
  }

  const lootGrouped = groupBy(data, (item) =>
    item.source === undefined || item.source === '' ? 'Unknown' : item.source
  )

  return (
    <div className="lootTable">
      <SearchBar searchChange={handleSearchOnChange} />

      {Object.entries(lootGrouped).map(([title, loot], key) => (
        <Fragment key={key}>
          <Header title={title} />
          {loot.map((item, key) => (
            <VisibilityObserver key={key}>
              <Weapon item={item} />
            </VisibilityObserver>
          ))}
        </Fragment>
      ))}
    </div>
  )
}

export default LootTable
