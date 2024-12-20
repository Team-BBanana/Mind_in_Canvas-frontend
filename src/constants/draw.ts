export const DrawType = {
  FreeStyle: 'freeStyle',
  Shape: 'shape'
} as const;

// DrawType 타입을 선언
export type DrawType = typeof DrawType[keyof typeof DrawType];

export const DrawStyle = {
  Basic: 'basic',
  Rainbow: 'rainbow',
  Shape: 'shape',
  Material: 'material',
  Pixels: 'pixels',
  MultiColor: 'multiColor',
  Text: 'text',
  MultiLine: 'multiLine',
  Reticulate: 'reticulate',
  MultiPoint: 'multiPoint',
  Wiggle: 'wiggle',
  Thorn: 'thorn'
} as const;

// DrawStyle 타입을 선언
export type DrawStyle = typeof DrawStyle[keyof typeof DrawStyle];

export const DrawShape = {
  Bubble: 'bubble',
  Star: 'star',
  Love: 'love',
  Butterfly: 'butterfly',
  Snow: 'snow',
  Music: 'music',
  Sun: 'sun',
  Moon: 'moon',
  Leaf: 'leaf',
  Flower: 'flower'
} as const;

// DrawShape 타입을 선언
export type DrawShape = typeof DrawShape[keyof typeof DrawShape];
