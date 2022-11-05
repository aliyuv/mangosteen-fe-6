interface FData {
  [key: string]: string | number | null | undefined | FData
}

type Rule<T> = {
  key: keyof T
  message: string
} & (
  { type: 'required' } |
  { type: 'pattern', regex: RegExp }
  )
type Rules<T> = Rule<T>[]
export type {Rules, Rule, FData}
export const validate = <T extends FData>(formDaa: T, rules: Rules<T>) => {
  type Errors = {
    [k in keyof T]?: string[]
  }
  const errors: Errors = {}
  rules.map(rule => {
    const {key, type, message} = rule
    const value = formDaa[key]
    switch (type) {
      case 'required':
        if (isEmpty(value)) {
          errors[key] = errors[key] ?? []
          errors[key]?.push(message)
        }
        break
      case 'pattern':
        if (!isEmpty(value) && !rule.regex.test(value!.toString())) {
          errors[key] = errors[key] ?? []
          errors[key]?.push(message)
        }
        break
      default:
        break
    }
  })
  return errors
}

function isEmpty(value: string | number | null | undefined | FData) {
  return value === undefined || value === null || value === ''
}