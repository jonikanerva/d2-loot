import {
  DestinyManifest,
  ServerResponse,
  DestinyInventoryItemDefinition,
  DestinyCollectibleDefinition,
} from 'bungie-api-ts/destiny2'

const fetchUrl = (url: string): Promise<any> => {
  console.log('Downloading: ', url)

  return fetch(url).then((res) => {
    if (res.ok === true) {
      return res.json()
    } else {
      throw new Error('Network response was not ok')
    }
  })
}

const getManifest = (): Promise<Record<string, string>> =>
  fetchUrl('https://www.bungie.net/Platform/Destiny2/Manifest/')
    .then((manifest: ServerResponse<DestinyManifest>) => {
      if (manifest?.Response !== undefined) {
        console.log('Manifest version: ', manifest.Response.version)

        return manifest.Response
      } else {
        throw new Error('Error fetchting manifest')
      }
    })
    .then((manifest) => manifest.jsonWorldComponentContentPaths.en)

const getContent = (path: string): Promise<any> =>
  fetchUrl(`https://www.bungie.net${path}`)

export interface Loot {
  name: string
  source: string
}

const getDefinitions = (paths: Record<string, string>): Promise<Loot[]> => {
  const weapons = new Set<number>()

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
        .map((item) => weapons.add(item.hash))

      return Object.values(collectibles)
        .filter(
          (item) =>
            weapons.has(item.itemHash) === true &&
            item.redacted !== true &&
            item.blacklisted !== true
        )
        .map((item) => {
          return {
            name: item.displayProperties.name,
            source: item.sourceString,
          }
        })
    }
  )
}

export const fetchData = (): Promise<Loot[]> =>
  getManifest().then(getDefinitions)
