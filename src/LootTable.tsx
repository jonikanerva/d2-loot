import './LootTable.css'
import React, { Fragment, useEffect, useState } from 'react'
import { fetchData, Item } from './bungieData'
import Header from './Header'
import Weapon from './Weapon'

const LootTable: React.FC = () => {
  let previousTitle = ''
  const [loot, setLoot] = useState<Item[]>()

  useEffect(() => {
    fetchData().then((loot) => setLoot(loot))
  }, [])

  if (loot === undefined) {
    return <h1>Loading...</h1>
  }

  return (
    <div className="lootTable">
      {loot.map((item, key) => {
        const titleChanged = previousTitle !== item.source
        previousTitle = item.source

        return (
          <Fragment key={key}>
            {titleChanged && <Header title={item.source} />}
            <Weapon item={item} />
          </Fragment>
        )
      })}
    </div>
  )
}

export default LootTable
