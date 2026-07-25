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
