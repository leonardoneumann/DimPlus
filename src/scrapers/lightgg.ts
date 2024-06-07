const LIGHTGG_ITEMDB_URL = 'https://www.light.gg/db/items/'

export const LIGHTGG_COMMUNITYAVG_SELECTOR = '#community-average'
//const LIGHTGG_MYROLLS_ELEMID = 'my-rolls'
//const LIGHTGG_SOCKETS_ELEMID = 'socket-container'

export const LightGGItemUrl = (itemHash: number) => `${LIGHTGG_ITEMDB_URL}${itemHash}${LIGHTGG_COMMUNITYAVG_SELECTOR}`

interface RollData {
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
