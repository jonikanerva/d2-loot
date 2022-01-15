import { Item } from './bungieData'
import './Weapon.css'

interface WeaponProps {
  item: Item
}

const screenshot = (hash: number) =>
  `https://www.bungie.net/common/destiny2_content/screenshots/${hash}.jpg`

const Weapon: React.FC<WeaponProps> = ({ item }) => {
  const src = screenshot(item.itemHash)

  return (
    <div
      className="weaponTile"
      style={{
        backgroundImage: `url("${src}")`,
      }}
    >
      <div className="weaponName">{item.name}</div>
      <div className="location">
        damagetype: {item.damageType}
        <br />
        type: {item.weaponType}
        <br />
        ammo: {item.ammoType}
        <br />
        slot:{item.equipmentSlot}
        <br />
        <img alt="icon" src={`https://www.bungie.net${item.icon}`} />
      </div>
    </div>
  )
}

export default Weapon
