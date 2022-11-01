import { useTheme } from '@1hive/1hive-ui';
import { getNetwork } from 'src/networks';
import styled from 'styled-components';
import { ThemeInterface } from '../styles/theme';

const TestNetworkNameStyled = styled.span<{ theme: ThemeInterface }>`
  font-style: italic;
  color: ${({ theme }) => theme.contentSecondary};
  margin-left: -75px;
  margin-bottom: -5px;
  white-space: nowrap;
`;

export const LogoTitle = () => {
  const theme = useTheme();
  const { name, isTestNetwork } = getNetwork();
  return (
    <>
      <svg
        width="168"
        height="54"
        viewBox="0 0 168 54"
        fill={theme.content}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M39.2524 12.7917C39.2524 11.5475 38.8233 10.9188 37.7802 10.3168C32.0882 7.10609 26.4212 3.84192 20.7792 0.524225C19.9372 0.0319226 19.3285 0.0319226 18.5026 0.521549C12.7516 3.8767 6.98362 7.19528 1.19865 10.4773C0.292288 10.991 0 11.5903 0 12.6044C0.04648 20.3153 0.04648 28.0272 0 35.7399C0 36.8636 0.388823 37.4335 1.32468 37.9579C7.95881 41.6636 14.5688 45.4227 21.1868 49.1632L29.4621 53.8454C29.4621 50.1826 29.5613 46.8889 29.4192 43.5953C29.3494 41.9552 29.9179 41.0696 31.3472 40.3472C33.5863 39.2101 35.6913 37.8081 37.917 36.6389C38.9708 36.085 39.2577 35.3814 39.2577 34.2523C39.2095 27.1005 39.1961 19.9488 39.2577 12.7943L39.2524 12.7917ZM26.9548 48.6789C26.9193 48.9081 26.8636 49.1337 26.7886 49.3531C22.297 46.814 17.9663 44.3846 13.6598 41.8937C13.4481 41.7496 13.2703 41.5613 13.1388 41.3419C13.0073 41.1224 12.9252 40.8771 12.8982 40.6228C12.8553 30.2925 12.8714 19.9541 12.8714 9.32681C14.2122 10.0626 15.3518 10.694 16.4995 11.3308C19.6235 13.0699 22.769 14.7742 25.8527 16.5802C26.3622 16.8799 26.9253 17.6344 26.9253 18.1856C26.9897 28.3527 26.9709 38.5198 26.9656 48.6869" />
        <path d="M69.2922 40.5671C67.7223 40.5671 66.435 39.9527 65.4303 38.7239L63.358 36.2451C62.4998 36.457 61.5474 36.5629 60.5009 36.5629C58.3658 36.5629 56.4297 36.065 54.6923 35.0693C52.955 34.0523 51.584 32.6435 50.5793 30.8427C49.5745 29.0207 49.0722 26.9762 49.0722 24.7093C49.0722 22.4212 49.5745 20.3768 50.5793 18.5759C51.584 16.7751 52.955 15.3769 54.6923 14.3811C56.4297 13.3642 58.3658 12.8557 60.5009 12.8557C62.6568 12.8557 64.6035 13.3642 66.3408 14.3811C68.0781 15.3769 69.4492 16.7751 70.4539 18.5759C71.4586 20.3768 71.961 22.4106 71.961 24.6775C71.961 26.7961 71.5214 28.7135 70.6423 30.4295C69.7841 32.1456 68.591 33.5333 67.0629 34.5926L72.4633 40.5671H69.2922ZM54.5981 20.6734C54.033 21.8174 53.7504 23.1627 53.7504 24.7093C53.7504 26.2347 54.033 27.5694 54.5981 28.7135C55.1633 29.8575 55.9482 30.7367 56.9529 31.3511C57.9786 31.9655 59.1612 32.2727 60.5009 32.2727C61.8405 32.2727 63.0127 31.9655 64.0174 31.3511C65.043 30.7367 65.8384 29.8575 66.4036 28.7135C66.9897 27.5482 67.2827 26.2029 67.2827 24.6775C67.2827 23.1521 66.9897 21.8174 66.4036 20.6734C65.8384 19.5293 65.043 18.6501 64.0174 18.0357C63.0127 17.4213 61.8405 17.1141 60.5009 17.1141C59.1612 17.1141 57.9786 17.4213 56.9529 18.0357C55.9482 18.6501 55.1633 19.5293 54.5981 20.6734Z" />
        <path d="M80.1005 13.2053V26.7749C80.1005 28.5969 80.4877 29.9634 81.2622 30.8744C82.0576 31.7643 83.1984 32.2092 84.6845 32.2092C86.1498 32.2092 87.2801 31.7643 88.0755 30.8744C88.8709 29.9634 89.2686 28.5969 89.2686 26.7749V17.7815C89.2686 16.5103 89.7081 15.4298 90.5873 14.54C91.4664 13.6502 92.5339 13.2053 93.7898 13.2053V26.7749C93.7898 28.9147 93.3921 30.7261 92.5967 32.2092C91.8222 33.671 90.7338 34.7727 89.3314 35.5142C87.9499 36.2345 86.3695 36.5947 84.5904 36.5947C81.8483 36.5947 79.6505 35.7684 77.9969 34.1159C76.3642 32.4422 75.5479 29.9952 75.5479 26.7749V17.7815C75.5479 16.5103 75.9874 15.4298 76.8666 14.54C77.7666 13.6502 78.8446 13.2053 80.1005 13.2053Z" />
        <path d="M102.921 17.0823V23.0886H111.021C111.021 24.0631 110.676 24.9 109.985 25.5991C109.295 26.2771 108.468 26.616 107.505 26.616H102.921V32.8447H111.995V33.0036C111.995 33.9994 111.649 34.8468 110.959 35.546C110.268 36.2239 109.441 36.5629 108.478 36.5629H101.822C101.361 36.5629 100.911 36.4676 100.472 36.2769C100.053 36.0862 99.6869 35.832 99.3729 35.5142C99.059 35.1964 98.8078 34.8256 98.6194 34.4019C98.431 33.957 98.3368 33.4909 98.3368 33.0036V16.9552C98.3368 15.9595 98.6717 15.1226 99.3415 14.4447C100.032 13.7455 100.859 13.396 101.822 13.396H111.995V13.5231C111.995 14.4976 111.649 15.3345 110.959 16.0336C110.268 16.7328 109.441 17.0823 108.478 17.0823H102.921Z" />
        <path d="M131.237 29.9846C131.237 31.171 130.944 32.2621 130.358 33.2579C129.792 34.2536 128.934 35.0587 127.783 35.6731C126.632 36.2663 125.24 36.5629 123.607 36.5629C121.974 36.5629 120.52 36.2875 119.243 35.7366C117.987 35.1646 116.972 34.3595 116.197 33.3214C115.423 32.2621 114.983 31.0333 114.879 29.6351H118.646C118.939 29.6351 119.201 29.7198 119.431 29.8893C119.682 30.0588 119.85 30.2812 119.934 30.5566C120.143 31.1075 120.457 31.5842 120.876 31.9867C121.504 32.6011 122.351 32.9083 123.419 32.9083C124.361 32.9083 125.083 32.6541 125.585 32.1456C126.088 31.6371 126.339 30.9804 126.339 30.1753C126.339 29.455 126.129 28.8618 125.711 28.3957C125.313 27.9084 124.8 27.527 124.172 27.2516C123.544 26.955 122.686 26.6266 121.598 26.2665C120.174 25.7792 119.002 25.3025 118.081 24.8364C117.181 24.3703 116.407 23.6924 115.758 22.8026C115.13 21.8916 114.816 20.7157 114.816 19.2751C114.816 17.2836 115.517 15.7158 116.919 14.5718C118.343 13.4277 120.227 12.8557 122.571 12.8557C124.978 12.8557 126.904 13.4489 128.348 14.6353C129.792 15.8006 130.609 17.3683 130.797 19.3386H127.626C126.663 19.3386 125.92 18.8937 125.397 18.0039C125.25 17.7497 125.062 17.506 124.832 17.273C124.266 16.7434 123.502 16.4785 122.54 16.4785C121.681 16.4785 120.991 16.701 120.467 17.1459C119.965 17.5908 119.714 18.2476 119.714 19.1162C119.714 19.7941 119.913 20.3556 120.31 20.8005C120.708 21.2454 121.21 21.6161 121.817 21.9127C122.445 22.1882 123.283 22.4954 124.329 22.8343C125.815 23.364 127.009 23.8619 127.909 24.328C128.83 24.794 129.615 25.4826 130.263 26.3936C130.912 27.3046 131.237 28.5016 131.237 29.9846Z" />
        <path d="M132.538 13.3642H149.712V13.6502C149.712 14.5824 149.388 15.3769 148.739 16.0336C148.09 16.6904 147.305 17.0188 146.384 17.0188H143.402V36.4993H142.146C141.225 36.4993 140.44 36.1709 139.791 35.5142C139.142 34.8574 138.818 34.0629 138.818 33.1308V17.0188H135.866C134.945 17.0188 134.16 16.6904 133.511 16.0336C132.862 15.3769 132.538 14.5824 132.538 13.6502V13.3642Z" />
        <path d="M168 29.9846C168 31.171 167.707 32.2621 167.121 33.2579C166.556 34.2536 165.698 35.0587 164.546 35.6731C163.395 36.2663 162.003 36.5629 160.37 36.5629C158.738 36.5629 157.283 36.2875 156.006 35.7366C154.75 35.1646 153.735 34.3595 152.961 33.3214C152.186 32.2621 151.747 31.0333 151.642 29.6351H155.41C155.703 29.6351 155.964 29.7198 156.195 29.8893C156.446 30.0588 156.613 30.2812 156.697 30.5566C156.906 31.1075 157.22 31.5842 157.639 31.9867C158.267 32.6011 159.115 32.9083 160.182 32.9083C161.124 32.9083 161.846 32.6541 162.348 32.1456C162.851 31.6371 163.102 30.9804 163.102 30.1753C163.102 29.455 162.893 28.8618 162.474 28.3957C162.076 27.9084 161.564 27.527 160.936 27.2516C160.308 26.955 159.449 26.6266 158.361 26.2665C156.938 25.7792 155.765 25.3025 154.844 24.8364C153.944 24.3703 153.17 23.6924 152.521 22.8026C151.893 21.8916 151.579 20.7157 151.579 19.2751C151.579 17.2836 152.28 15.7158 153.683 14.5718C155.106 13.4277 156.99 12.8557 159.334 12.8557C161.741 12.8557 163.667 13.4489 165.111 14.6353C166.556 15.8006 167.372 17.3683 167.56 19.3386H164.389C163.426 19.3386 162.683 18.8937 162.16 18.0039C162.014 17.7497 161.825 17.506 161.595 17.273C161.03 16.7434 160.266 16.4785 159.303 16.4785C158.445 16.4785 157.754 16.701 157.231 17.1459C156.728 17.5908 156.477 18.2476 156.477 19.1162C156.477 19.7941 156.676 20.3556 157.074 20.8005C157.471 21.2454 157.974 21.6161 158.581 21.9127C159.209 22.1882 160.046 22.4954 161.093 22.8343C162.579 23.364 163.772 23.8619 164.672 24.328C165.593 24.794 166.378 25.4826 167.027 26.3936C167.676 27.3046 168 28.5016 168 29.9846Z" />
      </svg>
      {isTestNetwork && <TestNetworkNameStyled theme={theme}>{name}</TestNetworkNameStyled>}
    </>
  );
};
