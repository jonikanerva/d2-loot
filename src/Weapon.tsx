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
    <a href={`https://d2gunsmith.com/w/${item.itemHash}`}>
      <div
        className="weaponTile"
        style={{
          backgroundImage: `url("${src}")`,
        }}
      >
        <div className="weaponName">{item.name}</div>
        <div className="details">
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
    </a>
  )
}

export default Weapon
