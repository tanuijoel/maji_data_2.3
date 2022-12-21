const showProgressBar = params => {
  const { lowerThreshold, upperThreshold, progressBar, metric } = params

  let progressStartValue = 0
  const progressEndValue = +progressBar.dataset.endValue
  const valueContainer = progressBar.querySelector('.value-container')

  // show different colours based on end value
  let graphColor
  let graphBGColor

  if (progressEndValue < lowerThreshold) {
    graphColor = '#ef4444'
    graphBGColor = '#fca5a5'
  } else if (
    progressEndValue >= lowerThreshold &&
    progressEndValue <= upperThreshold
  ) {
    graphColor = '#fb923c'
    graphBGColor = '#fed7aa'
  } else {
    graphColor = '#4ade80'
    graphBGColor = '#bbf7d0'
  }

  let progress = setInterval(() => {
    let suffix
    let multiplicationFactor

    progressStartValue++

    if (metric === undefined) {
      suffix = '%'
      multiplicationFactor = 3.6
    } else {
      if (metric === 'hours') {
        suffix = 'hrs'
        multiplicationFactor = 15
      } else {
        suffix = ''
        multiplicationFactor = 36
      }
    }

    valueContainer.textContent = `${progressStartValue}${suffix}`

    progressBar.style.background = `conic-gradient(
          ${graphColor} ${progressStartValue * multiplicationFactor}deg,
          ${graphBGColor} ${progressStartValue * multiplicationFactor}deg
      )`

    if (progressStartValue === progressEndValue) {
      clearInterval(progress)
    }
  }, 10)
}

export default showProgressBar
