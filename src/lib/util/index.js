const hasClass = (obj, cls) => {
  return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

const addClass = (obj, cls) => {
  if (!hasClass(obj, cls)) {
    obj.className += ' ' + cls
  }
}

const removeClass = (obj, cls) => {
  if (hasClass(obj, cls)) {
    let reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    obj.className = obj.className.replace(reg, ' ')
  }
}

const contains = (parentNode, childNode) => {
  if (parentNode && childNode) return parentNode.contains(childNode)
  return false
}

export {
  addClass, removeClass, contains
}
