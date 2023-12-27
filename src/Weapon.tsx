import './Weapon.css'
import { useVisibilityObserver } from 'react-visibility-observer'
import { Item } from './bungieData'

interface WeaponProps {
  item: Item
}

const Weapon: React.FC<WeaponProps> = ({ item }: WeaponProps) => {
  const { isVisible } = useVisibilityObserver()
  const foundry = `https://d2foundry.gg/w/${item.itemHash}`

  return (
    <div className="weaponTile">
      <a href={foundry}>
        <div className="weaponIcon">
          <img
            alt="icon"
            src={isVisible ? `https://www.bungie.net${item.icon}` : ''}
          />
        </div>
      </a>
      <div className="weaponDetails">
        <div className="weaponName">{item.name}</div>
        <div className="weaponType">{item.weaponType}</div>
        {item.equipmentSlot} Weapon
        <br />
        {item.ammoType} Ammo
        <br />
        {item.damageType} Damage
        <br />
      </div>
    </div>
  )
}

export default Weapon
