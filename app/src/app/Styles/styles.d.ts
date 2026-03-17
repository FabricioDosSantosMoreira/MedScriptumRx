import styled, { DefaultTheme } from 'styled-components'
import { theme } from '@/styles/Theme/CustomTheme';


declare module 'styled-components' {
  type CustomTheme = typeof theme;

  export interface DefaultTheme extends CustomTheme {}
}
