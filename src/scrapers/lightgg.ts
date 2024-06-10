const LIGHTGG_ITEMDB_URL = 'https://www.light.gg/db/items/'

export const LIGHTGG_MAIN_COLUMN_SELECTOR = '#main-column'
const LIGHTGG_COMMUNITYAVG_SELECTOR = '#community-average'

export const LightGGItemUrl = (itemHash: number) => `${LIGHTGG_ITEMDB_URL}${itemHash}${LIGHTGG_COMMUNITYAVG_SELECTOR}`

export interface RollData {
  percent?: string
  column: number
  place: number
  color?: string
  perkId?: string
  imgUrl?: string
  name?: string
}

/**
 * Parses the HTML data for community average rolls
 * @param {string} htmldata Html string for the 'community-rolls' div element
 * @returns {Array<RollData>}
 */
export function parseCommunityAvgRolls(html: string): Array<RollData> {
  const rollData: Array<RollData> = []

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
          rollData[rollIndex].perkId = itemShowHover.getAttribute('data-id')
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

export interface RollComboItem {
  ids: string[]
  imgs: string[]
  names: string[]
  percentText: string | undefined
}

export interface RollCombos {
  combos: RollComboItem[]
  masterwork: RollComboItem[]
  mod: RollComboItem[]
}

export function parseCommunityRollCombos(html: string): RollCombos {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const parseSection = (htmlSection: Element): RollComboItem[] => {
    const data: RollComboItem[] = []

    for (const groupElem of htmlSection.children) {
      const idsElems = groupElem.querySelectorAll('.item')
      const namesElems = groupElem.querySelectorAll('.perk-names')
      const percentElem = groupElem.querySelector('.combo-percent')?.textContent?.trim()
      const ids: string[] = []
      const imgs: string[] = []
      const names: string[] = []

      idsElems.forEach(elem => {
        ids.push(elem.getAttribute('data-id') || '')
        const imgElem = elem.querySelector('img')
        imgs.push(imgElem?.getAttribute('src') || '')
      })

      namesElems.forEach(elem => {
        names.push(elem.textContent?.replace('+', '').trim() || '')
      })

      data.push({
        ids,
        imgs,
        names,
        percentText: percentElem,
      })
    }

    return data
  }

  const combos = parseSection(doc.querySelector('#trait-combos'))
  const masterwork = parseSection(doc.querySelector('#masterwork-stats'))
  const mod = parseSection(doc.querySelector('#mod-stats'))

  const retCombos: RollCombos = {
    combos,
    masterwork,
    mod,
  }

  return retCombos
}
