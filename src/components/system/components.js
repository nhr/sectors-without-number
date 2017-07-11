import styled from 'styled-components';

export const Circle = styled.circle`
  fill: ${props => props.theme.light3};
`;

export const Polygon = styled.polygon`
  fill: ${props => (props.highlighted ? props.theme.dark2 : props.theme.dark3)};
  transition: all 0.2s;
`;

export const G = styled.g`
  cursor: default;
`;

export const Hoverable = styled(G)`
  &:hover polygon {
    fill: ${props => (props.hoverable ? props.theme.primary : props.theme.dark3)};
  }
`;

export const Text = styled.text`
  font-size: 9px;
  font-weight: 100;
  stroke: ${props => props.theme.light1};
  text-anchor: middle;
  stroke-width: 0.6px;
`;