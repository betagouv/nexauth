export default function getConstructorName(value: any): string {
  if (value === undefined || value === null || value.constructor === undefined) {
    return 'undefined'
  }

  return value.constructor.name
}
