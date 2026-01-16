import { css, styled } from 'styled-components';

import { 
  IPageWrapper,
} from './PageLayout.types';


export const PageWrapper = styled.main<IPageWrapper>`
  margin: 0 auto;

  height: 100vh;
  width: 100vw;

  padding-right: 6px;

  ${({ $bgImage }) => $bgImage && css`
    background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${$bgImage.src});

    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  `}

  background-color: white;

  /* Scrollbar essentials */
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }

  ${({ $breakpoint }) => $breakpoint === 'md' && css`
    padding-right: 6px;
  `};

  ${({ $breakpoint }) => $breakpoint === 'lg' && css`
    padding-right: 8px;
  `};

  ${({ $breakpoint }) => $breakpoint === 'xl' && css`
    padding-right: 10px;
  `};
`

export const PageContent = styled.div`
  display: flex;
  flex-direction: column;

  width: auto;
  height: auto; 

  margin-top: 56px;
  margin-bottom: 60px;
`
