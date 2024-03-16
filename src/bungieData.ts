/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import {
  DestinyCollectibleDefinition,
  DestinyInventoryItemDefinition,
  DestinyManifest,
  ServerResponse,
} from 'bungie-api-ts/destiny2'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const groupBy = <T, K extends keyof any>(
  array: T[],
  getKey: (item: T) => K,
): Record<K, T[]> =>
  array.reduce<Record<K, T[]>>(
    (accumulator, currentItem) => {
      const key = getKey(currentItem)

      if (!accumulator[key]) {
        accumulator[key] = []
      }

      accumulator[key].push(currentItem)
      return accumulator
    },
    {} as Record<K, T[]>,
  )

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
    case 3949783978:
      return 'Strand'
    default:
      return 'Unkown'
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      'X-API-Key': '',
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  waterMark: string
}

const getDefinitions = (paths: Record<string, string>): Promise<Item[]> => {
  const weapons = new Map<number, Item>()

  return Promise.all([
    getContent(paths.DestinyCollectibleDefinition) as Promise<
      DestinyCollectibleDefinition[]
    >,
    getContent(paths.DestinyInventoryItemDefinition) as Promise<
      DestinyInventoryItemDefinition[]
    >,
  ]).then(([collectibles, items]) => {
    Object.values(items)
      .filter(
        (item) =>
          item.itemType === 3 &&
          (item.inventory?.tierType === 5 || item.inventory?.tierType === 6),
      )
      .forEach((item) => {
        const weapon = {
          name: item.displayProperties.name,
          source: '',
          itemHash: item.hash,
          damageType: damageTypeName(item.defaultDamageTypeHash || 0),
          weaponType: item.itemTypeDisplayName,
          ammoType: ammoName(item.equippingBlock?.ammoType || 0),
          equipmentSlot: equipmentSlotName(
            item.equippingBlock?.equipmentSlotTypeHash || 0,
          ),
          icon: item.displayProperties.icon,
          waterMark: item.iconWatermark,
        }
        weapons.set(item.hash, weapon)
      })
    return Object.values(collectibles)
      .filter(
        (item) => weapons.has(item.itemHash) === true && item.redacted !== true,
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
          waterMark,
        } = weapons.get(item.itemHash) as Item

        return {
          name,
          source: item.sourceString.replace(/^Source: /, ''),
          itemHash,
          damageType,
          weaponType,
          ammoType,
          equipmentSlot,
          icon,
          waterMark,
        }
      })
      .sort((a, b) => {
        if (a.source === b.source) {
          return a.name > b.name ? 1 : -1
        }

        return a.source > b.source ? 1 : -1
      })
  })
}

export const fetchData = (): Promise<Item[]> =>
  getManifest().then((paths) => getDefinitions(paths))
