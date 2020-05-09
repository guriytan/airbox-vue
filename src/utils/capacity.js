export default function bytesToSize(bytes) {
  if (bytes === 0) return '0 B';
  let k = 1024, // or 1024
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));

  return (bytes / Math.pow(k, i)).toFixed(3) + ' ' + sizes[i];
}
