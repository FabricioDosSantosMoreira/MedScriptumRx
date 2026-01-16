import styled, { css } from 'styled-components';

import { 
  IStyledScrollbarTrackAndThumb,
  IStyledScrollbar, 
} from './ScrollbarY.types';


export const StyledScrollbar = styled.div<IStyledScrollbar>`
  position: absolute;
  top: 0;
  right: 0;

  height: 100%;

  transform: translateY(0);
  transition: transform 500ms cubic-bezier(0.2, 0.6, 0.3, 1);

  background: transparent;
  z-index: 999;
`;

export const StyledScrollbarTrackAndThumb = styled.div<IStyledScrollbarTrackAndThumb>`
  display: block;

  height: 100%;
  width: 4px;

  ${({ $breakpoint }) => $breakpoint === 'md' && css`
    width: 6px;
  `};
  ${({ $breakpoint }) => $breakpoint === 'lg' && css`
    width: 8px;
  `};
  ${({ $breakpoint }) => $breakpoint === 'xl' && css`
    width: 10px;
  `};
`;

export const Track = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;

  width: inherit;

  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.green};
`;

export const Thumb = styled.div`
  position: absolute;
  top: 0;

  width: inherit;
  //border-radius: 12px;

  background-color: ${({ theme }) => theme.colors.white};
`;
