export const matchesSubscription = (topic, subscription) => {
  let topicIdx = 0,
    subIdx = 0

  while (topicIdx < topic.length && subIdx < subscription.length) {
    if (subscription[subIdx] === '#') return true

    if (subscription[subIdx] === '*') {
      subIdx++

      while (topicIdx < topic.length && topic[topicIdx] !== '/') {
        topicIdx++
      }

      continue
    }

    if (topic[topicIdx] === subscription[subIdx]) {
      topicIdx++
      subIdx++
    } else {
      return false
    }
  }

  return topicIdx === topic.length && subIdx === subscription.length
}
