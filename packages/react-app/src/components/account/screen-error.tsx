import { Button, GU, IconRefresh, textStyle, useTheme } from '@1hive/1hive-ui';
import connectionError from './assets/connection-error.png';

type Props = {
  error?: { name: string; message: string };
  onBack: Function;
};

function AccountModuleErrorScreen({ error, onBack }: Props) {
  const theme = useTheme();

  return (
    <section
      // @ts-ignore
      css={`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: ${2 * GU}px;
        height: 100%;
      `}
    >
      <div
        // @ts-ignore
        css={`
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        `}
      >
        <div
          // @ts-ignore
          css={`
            position: relative;
            width: 281px;
            height: 188px;
            background: 50% 50% / 100% 100% no-repeat url(${connectionError});
          `}
        />
        <h1
          // @ts-ignore
          css={`
            padding-top: ${2 * GU}px;
            ${textStyle('body1')};
            font-weight: 600;
          `}
        >
          {error?.name}
        </h1>
        <p
          // @ts-ignore
          css={`
            width: ${36 * GU}px;
            color: ${theme.surfaceContentSecondary};
          `}
        >
          {error?.message}
        </p>
      </div>
      <div
        // @ts-ignore
        css={`
          flex-grow: 0;
        `}
      >
        <Button onClick={onBack} icon={<IconRefresh />} label=" OK, try again" />
      </div>
    </section>
  );
}

export default AccountModuleErrorScreen;
