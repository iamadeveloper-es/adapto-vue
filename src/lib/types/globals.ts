export type Icon = {
  name: string,
  size?: number,
  color?: string
  strokeWidth?: number
  defaultClass?: string
}

export enum SortOrder {
  'asc' = 'ASC',
  'desc' = 'DESC',
};

export type Variant = 'outlined' | 'fussy' | 'soft' | 'soul' | 'link'
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type Radius = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type ItemAlignment = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'center'
export type TextAlignment = 'start' | 'center' | 'end'
export type Elevation = '1' | '2' | '3' | '4' | '5'

export type ComboboxOptions = {
  label: string,
  value: string | number
}
