var user = {}
var ch = false
exports.add = (props) => {
  user = props
}
exports.getCh = () => {
  return ch
}
exports.getUser = () => {
  return user
}

exports.get = () => {
  return Object.keys(user).length === 0
}

exports.change = (props) => {
  ch = props
}

exports.delete = () => {
  user = {}
}
