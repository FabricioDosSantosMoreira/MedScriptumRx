import { styled } from 'styled-components';


export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  position: relative;

  min-width: 100%;
  min-height: 64px;

  background-color: ${({ theme }) => theme.colors.green};

  &:after {
    content: '';

    position: absolute;
    bottom: 0;
    left: 0;

    width: 35%;
    height: 4px;

    background-color: ${({ theme }) => theme.colors.orange};
  }
`;

export const HeaderButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  margin-left: 24px;
  gap: 20px;
`;

export const HeaderButton = styled.a`
  position: relative;

  font-family: ${({ theme }) => theme.fonts.hvd_comic};
  font-style: normal;
  font-size: 1.4rem;
  font-weight: 400;
  
  color: ${({ theme }) => theme.colors.white};
  
  text-decoration: none;
  cursor: pointer;

  &:after {
    content: '';

    position: absolute;
    bottom: 0;
    left: 0;

    width: 75%;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.orange};

    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;
