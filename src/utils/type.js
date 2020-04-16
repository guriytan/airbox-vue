export function solveType(type) {
  if (type === '0') {
    return '音乐'
  } else if (type === '1') {
    return '视频'
  } else if (type === '2') {
    return '文档'
  } else if (type === '3') {
    return '图像'
  } else {
    return '其他'
  }
}


export function solveIcon(type) {
  if (type === '0') {
    return 'music'
  } else if (type === '1') {
    return 'video'
  } else if (type === '2') {
    return 'document'
  } else if (type === '3') {
    return 'picture'
  } else {
    return 'other'
  }
}
