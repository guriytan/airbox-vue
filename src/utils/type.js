export const OperationTypeRename = 1
export const OperationTypeCopy = 2
export const OperationTypeMove = 3

export const FileTypeOther = 0
export const FileTypeMusic = 1
export const FileTypeVideo = 2
export const FileTypeDoc = 3
export const FileTypePic = 4
export const FileTypeFolder = 5

export function solveType(type) {
  switch (type) {
    case FileTypeMusic:
      return '音乐'
    case FileTypeVideo:
      return '视频'
    case FileTypeDoc:
      return '文档'
    case FileTypePic:
      return '图像'
    case FileTypeFolder:
      return '文件夹'
    default:
      return '其他'
  }
}

export function solveIcon(type) {
  switch (type) {
    case FileTypeMusic:
      return 'music'
    case FileTypeVideo:
      return 'video'
    case FileTypeDoc:
      return 'document'
    case FileTypePic:
      return 'picture'
    case FileTypeFolder:
      return 'folder'
    default:
      return 'other'
  }
}
