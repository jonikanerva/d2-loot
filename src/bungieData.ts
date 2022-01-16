import {
  DestinyManifest,
  ServerResponse,
  DestinyInventoryItemDefinition,
  DestinyCollectibleDefinition,
} from 'bungie-api-ts/destiny2'

const equipmentSlotName = (slot: number): string => {
  switch (slot) {
    case 2465295065:
      return 'Energy'
    case 953998645:
      return 'Power'
    case 1498876634:
      return 'Kinetic'
    default:
      return 'Unkown'
  }
}

const ammoName = (type: number): string => {
  switch (type) {
    case 1:
      return 'Primary'
    case 2:
      return 'Special'
    case 3:
      return 'Heavy'
    default:
      return 'Unkown'
  }
}

const damageTypeName = (type: number): string => {
  switch (type) {
    case 151347233:
      return 'Stasis'
    case 1847026933:
      return 'Solar'
    case 2303181850:
      return 'Arc'
    case 3373582085:
      return 'Kinetic'
    case 3454344768:
      return 'Void'
    default:
      return 'Unkown'
  }
}

const fetchUrl = (url: string, init?: RequestInit): Promise<any> => {
  console.log('Downloading: ', url)

  return fetch(url, init).then((res) => {
    if (res.ok === true) {
      return res.json()
    } else {
      throw new Error('Network response was not ok')
    }
  })
}

const getManifest = (): Promise<Record<string, string>> =>
  fetchUrl('https://www.bungie.net/Platform/Destiny2/Manifest/', {
    headers: {
      'X-API-Key': process.env.REACT_APP_BUNGIE_API_KEY || '',
    },
  })
    .then((manifest: ServerResponse<DestinyManifest>) => {
      if (manifest?.Response !== undefined) {
        console.log('Manifest version: ', manifest.Response.version)

        return manifest.Response
      } else {
        throw new Error('Error fetching manifest')
      }
    })
    .then((manifest) => manifest.jsonWorldComponentContentPaths.en)

const getContent = (path: string): Promise<any> =>
  fetchUrl(`https://www.bungie.net${path}`)

export interface Item {
  name: string
  source: string
  itemHash: number
  damageType: string
  weaponType: string
  ammoType: string
  equipmentSlot: string
  icon: string
}

const getDefinitions = (paths: Record<string, string>): Promise<Item[]> => {
  const weapons = new Map<number, Item>()

  return Promise.all([
    getContent(paths.DestinyCollectibleDefinition),
    getContent(paths.DestinyInventoryItemDefinition),
  ]).then(
    ([collectibles, items]: [
      collectibles: DestinyCollectibleDefinition,
      items: DestinyInventoryItemDefinition
    ]) => {
      Object.values(items)
        .filter((item) => item.itemType === 3)
        .forEach((item) => {
          const weapon = {
            name: item.displayProperties.name,
            source: '',
            itemHash: item.hash,
            damageType: damageTypeName(item.defaultDamageTypeHash),
            weaponType: item.itemTypeDisplayName,
            ammoType: ammoName(item.equippingBlock.ammoType),
            equipmentSlot: equipmentSlotName(
              item.equippingBlock.equipmentSlotTypeHash
            ),
            icon: item.displayProperties.icon,
          }
          weapons.set(item.hash, weapon)
        })
      return Object.values(collectibles)
        .filter(
          (item) =>
            weapons.has(item.itemHash) === true &&
            item.redacted !== true &&
            item.blacklisted !== true
        )
        .map((item) => {
          const {
            name,
            itemHash,
            damageType,
            weaponType,
            ammoType,
            equipmentSlot,
            icon,
          } = weapons.get(item.itemHash) as Item

          return {
            name,
            source: item.sourceString,
            itemHash,
            damageType,
            weaponType,
            ammoType,
            equipmentSlot,
            icon,
          }
        })
        .sort((a, b) => (a.name > b.name ? 1 : -1))
    }
  )
}

export const fetchData = (): Promise<Item[]> =>
  getManifest().then(getDefinitions)
