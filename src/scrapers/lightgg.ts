const LIGHTGG_ITEMDB_URL = 'https://www.light.gg/db/items/'

export const LIGHTGG_MAIN_COLUMN_SELECTOR = '#main-column'
const LIGHTGG_COMMUNITYAVG_SELECTOR = '#community-average'

export const LightGGItemUrl = (itemHash: number) => `${LIGHTGG_ITEMDB_URL}${itemHash}${LIGHTGG_COMMUNITYAVG_SELECTOR}`

export interface PlugMetaUsageData {
  percent?: string
  column: number
  place: number
  color?: string
  perkId?: number
  imgUrl?: string
  name?: string
}

/**
 * Parses the HTML data for community average rolls
 * @param {string} htmldata Html string for the 'community-rolls' div element
 * @returns {Array<PlugMetaUsageData>}
 */
export function parseCommunityAvgRolls(html: string): Array<PlugMetaUsageData> {
  const rollData: Array<PlugMetaUsageData> = []

  if (!html) {
    console.error('Error: Invalid HTML input.')
  }

  const container = new DOMParser().parseFromString(html, 'text/html')
  const rollsHtml = container.querySelector(LIGHTGG_COMMUNITYAVG_SELECTOR)

  if (rollsHtml) {
    let column = 0
    rollsHtml.childNodes.forEach(elem => {
      if (elem instanceof HTMLUListElement) {
        column++
      } else {
        return
      }

      elem.querySelectorAll('li').forEach((liElem, rowIndex) => {
        const rollIndex = rollData.length
        rollData.push({
          percent: liElem.querySelector('.percent')?.textContent,
          column,
          place: rowIndex + 1,
        })

        const relativePercentContainer: HTMLDivElement = liElem.querySelector('.relative-percent-container')
        if (relativePercentContainer) {
          rollData[rollIndex].color = relativePercentContainer.style['border-color']
        }

        const itemShowHover = liElem.querySelector('.item.show-hover')
        if (itemShowHover) {
          rollData[rollIndex].perkId = new Number(itemShowHover.getAttribute('data-id').trim()).valueOf()
          const imgEl = itemShowHover.querySelector('img')
          if (imgEl) {
            rollData[rollIndex].imgUrl = imgEl.src
            rollData[rollIndex].name = imgEl.alt
          }
        }
      })
    })
  } else {
    console.error('Error: Community Avg Data not found in the HTML.')
  }

  return rollData
}

export interface MetaComboDescription {
  ids: number[]
  imgs: string[]
  names: string[]
  percentText: string | undefined
}

export interface MetaCombos {
  combos: MetaComboDescription[]
  masterwork?: MetaComboDescription[]
  mods?: MetaComboDescription[]
}

export function parseCommunityRollCombos(html: string): MetaCombos {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const parseSection = (htmlSection: Element): MetaComboDescription[] => {
    const data: MetaComboDescription[] = []

    for (const groupElem of htmlSection.children) {
      const idsElems = groupElem.querySelectorAll('.item')
      const namesElems = groupElem.querySelectorAll('.perk-names')
      const percentElem = groupElem.querySelector('.combo-percent')

      let percentText = percentElem?.textContent
      if (percentText) {
        percentText = percentText.substring(0, percentText.indexOf('%') + 1).trim()
      }

      const ids: number[] = []
      const imgs: string[] = []
      const names: string[] = []

      idsElems.forEach(elem => {
        ids.push(new Number(elem.getAttribute('data-id')).valueOf())
        const imgElem = elem.querySelector('img')
        imgs.push(imgElem?.getAttribute('src') || '')
      })

      namesElems.forEach(elem => {
        names.push(elem.textContent?.trim() || '')
      })

      data.push({
        ids,
        imgs,
        names,
        percentText: percentText,
      })
    }

    return data
  }

  const combos = parseSection(doc.querySelector('#trait-combos'))

  const masterworkHtml = doc.querySelector('#masterwork-stats')
  const masterwork = masterworkHtml ? parseSection(masterworkHtml) : null

  const modsHtml = doc.querySelector('#mod-stats')
  const mods = modsHtml ? parseSection(modsHtml) : null

  const retCombos: MetaCombos = {
    combos,
    masterwork,
    mods: mods,
  }

  return retCombos
}
