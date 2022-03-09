import styled from 'styled-components';

type Props = {
  color: string;
};
const DivStyled = styled.div`
  margin-bottom: 8px;
`;

export default function QuestLogo({ color }: Props) {
  return (
    <DivStyled>
      <svg
        width="150"
        height="206"
        viewBox="0 0 150 206"
        fill={color || 'none'}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M149.98 48.7613C149.98 43.9968 148.34 41.589 144.355 39.2836C122.606 26.9883 100.953 14.4881 79.3955 1.78292C76.1783 -0.102361 73.8525 -0.102361 70.6967 1.77267C48.7227 14.6213 26.6837 27.3298 4.57992 39.8984C1.1168 41.8656 0 44.1608 0 48.044C0.177596 77.5733 0.177596 107.106 0 136.642C0 140.945 1.48566 143.128 5.06148 145.136C30.4098 159.327 55.666 173.723 80.9529 188.047L112.572 205.977C112.572 191.95 112.951 179.337 112.408 166.725C112.141 160.444 114.314 157.052 119.775 154.286C128.33 149.931 136.373 144.562 144.877 140.085C148.904 137.964 150 135.269 150 130.945C149.816 103.557 149.764 76.1696 150 48.7715L149.98 48.7613ZM102.992 186.192C102.856 187.07 102.643 187.934 102.357 188.774C85.1947 179.051 68.6475 169.747 52.1926 160.208C51.3837 159.656 50.7045 158.935 50.2021 158.095C49.6996 157.254 49.3859 156.315 49.2828 155.341C49.1189 115.781 49.1803 76.19 49.1803 35.4926C54.3033 38.3102 58.6578 40.7283 63.043 43.1669C74.9795 49.8269 86.998 56.3536 98.7807 63.2697C100.727 64.4173 102.879 67.3067 102.879 69.4174C103.125 108.353 103.053 147.288 103.033 186.223"
          fill={color || '#242424'}
        />
      </svg>
    </DivStyled>
  );
}
