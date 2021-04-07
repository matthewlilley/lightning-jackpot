import styled, { keyframes } from 'styled-components';

const opacity = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

const StyledDots = styled.div`
  text-align: center;
  span {
    animation-name: ${opacity};
    animation-duration: 1s;
    animation-iteration-count: infinite;
  }
  span:nth-child(2) {
    animation-delay: 100ms;
  }
  span:nth-child(3) {
    animation-delay: 300ms;
  }
`;

export const Dots = ({ text }) => (
  <StyledDots>
    {text}
    <span>.</span>
    <span>.</span>
    <span>.</span>
  </StyledDots>
);
