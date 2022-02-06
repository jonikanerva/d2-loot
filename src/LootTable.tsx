import './LootTable.css'
import React, { Fragment, useEffect, useState } from 'react'
import { fetchData, Item } from './bungieData'
import Header from './Header'
import Weapon from './Weapon'
import SearchBar from './SearchBar'

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
  let previousTitle = ''
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
    return <h1>Loading...</h1>
  }

  return (
    <div className="lootTable">
      <SearchBar searchChange={handleSearchOnChange} />
      {data.map((item, key) => {
        const titleChanged = previousTitle !== item.source
        previousTitle = item.source

        return (
          <Fragment key={key}>
            {titleChanged && <Header title={item.source} />}
            <Weapon item={item} />
          </Fragment>
        )
      })}
      {data.length === 0 && <Header title="Nothing found..." />}
    </div>
  )
}

export default LootTable
