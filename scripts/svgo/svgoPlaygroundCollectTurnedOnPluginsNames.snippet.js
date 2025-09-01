/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Collects names of all turned on plugins on svgo playground site (https://jakearchibald.github.io/svgomg/)
 *
 * @returns {svgo.PluginConfig.plugins[]} array of strings with names of plugins of npm package `svgo`
 * @see svgo.Config.plugins https://github.com/svg/svgo/blob/main/lib/types.ts#L341
 */
function svgoPlaygroundCollectTurnedOnPluginsNames() {
  const turnedInPlugins = []

  document.querySelectorAll('.plugins input').forEach((el) => {
    if (!el.checked) {
      return
    }

    turnedInPlugins.push(el.name)
  })

  turnedInPlugins.sort()

  console.log(turnedInPlugins, `"${turnedInPlugins.join('","')}"`)
}
