/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, Checkbox, useToast } from '@1hive/1hive-ui';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { GiBroadsword } from 'react-icons/gi';
import styled from 'styled-components';
import QuestProvider from '../../providers/QuestProvider';
import { emptyFunc } from '../../utils/class-util';
import ModalBase from './ModalBase';

const FlexStyled = styled.div`
  display: flex;
`;

export default function PlayModal({ questAddress, onClose = emptyFunc, disabled = false }) {
  const toast = useToast();
  const [opened, setOpened] = useState(false);
  const [licenseChecked, setLicenseChecked] = useState(false);
  const onModalClose = () => {
    setOpened(false);
    onClose();
  };
  const onPlayClick = () => {
    onModalClose();
    QuestProvider.playQuest(questAddress);
    toast('Successfully register as a player');
  };
  return (
    <ModalBase
      title="Play"
      openButton={
        <Button
          icon={<GiBroadsword />}
          onClick={() => setOpened(true)}
          label="Play"
          mode="positive"
          disabled={disabled}
        />
      }
      buttons={[
        <FlexStyled>
          <Checkbox checked={licenseChecked} onChange={setLicenseChecked} />I accept the terms
        </FlexStyled>,
        <Button
          icon={<GiBroadsword />}
          onClick={onPlayClick}
          label="Play"
          mode="positive"
          disabled={!licenseChecked}
        />,
      ]}
      onClose={onModalClose}
      isOpen={opened}
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sed imperdiet nulla.
      Suspendisse dignissim ipsum nec orci facilisis efficitur. Vivamus ut libero lectus. Etiam erat
      lorem, interdum ac purus a, pharetra vehicula metus. Duis semper sapien non sapien efficitur
      vulputate. Sed sed urna vitae est rhoncus facilisis. Cras ut tellus sit amet diam molestie
      luctus. Maecenas nec consectetur ipsum. Nulla eleifend ligula sit amet dapibus lacinia.
      Vivamus sit amet condimentum nibh. Donec faucibus sed tellus nec finibus. Nulla in turpis
      ipsum. Curabitur eu dapibus arcu. Aliquam cursus lacinia massa sed vehicula. Lorem ipsum dolor
      sit amet, consectetur adipiscing elit. Nulla facilisi. Sed pulvinar efficitur felis in
      imperdiet. Nunc pharetra quam sed nulla pellentesque feugiat. Quisque venenatis odio sit amet
      sapien viverra pretium. Fusce maximus tincidunt dapibus. Nullam tellus quam, eleifend
      consectetur interdum id, dictum id sapien. Cras venenatis dui id elit facilisis, ut suscipit
      arcu feugiat. Donec vehicula ante non iaculis porttitor. Pellentesque habitant morbi tristique
      senectus et netus et malesuada fames ac turpis egestas. Integer ornare diam et libero
      malesuada suscipit. Maecenas imperdiet lectus interdum ante suscipit bibendum. Quisque
      imperdiet dui a erat malesuada, sed fermentum enim semper. Vestibulum ante ipsum primis in
      faucibus orci luctus et ultrices posuere cubilia curae; Ut finibus velit arcu, sed eleifend
      sapien viverra sed. Cras nec finibus neque, non consequat dui. Donec diam neque, sagittis
      placerat fermentum nec, ullamcorper in lacus. Proin et enim quis ipsum euismod sagittis nec
      viverra ex. Aliquam commodo mauris ut tempus vehicula. Integer ut magna egestas, malesuada
      felis vitae, laoreet felis. Phasellus nec lorem congue, tempus libero in, ultrices urna.
      Pellentesque sem quam, vulputate eget consequat id, vehicula nec arcu. Sed dignissim quam et
      ligula facilisis, at faucibus tellus tempor. Suspendisse potenti. Morbi lobortis nisl ex, sit
      amet malesuada erat rutrum ut. Sed sagittis bibendum nulla quis rutrum. Sed commodo urna
      velit, nec feugiat elit eleifend et. Curabitur egestas metus sit amet ligula facilisis congue.
      Etiam sodales feugiat viverra. Nunc non metus nec odio consequat aliquam ac nec dui. Curabitur
      at erat ornare justo mollis posuere ac ac eros. Integer auctor nulla orci, vitae vestibulum
      dui blandit sit amet. Phasellus luctus auctor dapibus. Morbi at ultricies orci, sit amet
      commodo est. Vivamus sed neque vitae neque laoreet finibus. Ut et vulputate metus.
      Pellentesque molestie nisi tristique malesuada aliquam. Donec rhoncus vel turpis nec volutpat.
      Curabitur sed orci dictum, fringilla felis id, vehicula ligula. Nulla facilisi. Fusce cursus
      eget quam quis placerat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
      nulla diam, tristique vitae porta vitae, dictum in magna. Aenean id neque quis massa pulvinar
      ultrices. Aenean condimentum fringilla orci. Aliquam erat volutpat. Suspendisse ac ultrices
      urna. Nunc nec egestas quam. Nullam eu velit quis nulla vestibulum tempus. Quisque ac dapibus
      arcu. Quisque ac blandit erat. Cras vitae pellentesque felis. Ut urna eros, dignissim sit amet
      nulla at, pharetra dapibus nulla. Suspendisse mollis erat vel tempus volutpat. Etiam sodales
      in nunc eu scelerisque. Integer nec odio et libero ullamcorper pulvinar at sed sem.
      Pellentesque condimentum fermentum eros, ut suscipit risus tempus eu. Suspendisse convallis
      odio vel lacus interdum, sit amet molestie purus tempor. Nam quis posuere nulla, quis eleifend
      turpis. Mauris venenatis, ex quis eleifend commodo, lorem lorem porta massa, ac tristique quam
      diam et mauris. Curabitur et tempor sem. Vivamus nibh odio, tempor sed eros quis, faucibus
      semper urna. Donec convallis metus risus, nec scelerisque tellus facilisis vel. Sed vitae
      sapien sit amet ex consectetur interdum. Curabitur sed justo ut nisl vulputate tempor
      facilisis eu risus. Nullam dignissim arcu vehicula nibh pretium, a porttitor tortor eleifend.
      Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
      Aliquam sit amet nunc placerat nisl tincidunt blandit id vitae nisl. Vestibulum porta
      efficitur orci quis blandit. Pellentesque convallis orci vitae ante faucibus congue. Nulla
      vitae nunc ligula. Duis at porttitor justo, id lacinia lectus. Quisque porttitor pulvinar
      magna, id sodales velit pulvinar eget. Phasellus tempor nisl vitae quam vestibulum rhoncus.
      Phasellus ultricies condimentum auctor. Suspendisse dignissim sodales tortor eu luctus. Class
      aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque
      euismod lacinia ipsum. Mauris imperdiet pharetra euismod. Nulla nec eros mauris. Nam convallis
      augue sit amet urna dignissim rutrum non a velit. Nam vitae scelerisque risus. Ut lobortis
      cursus tellus nec cursus. Vivamus tempor nec eros eget pretium. Cras rutrum consectetur nisl,
      sed facilisis dui tristique a. Vestibulum quis est eget dolor fermentum malesuada. Nullam nec
      augue molestie, cursus dui ac, rhoncus sem. Aenean euismod mi ut ullamcorper tristique. Donec
      feugiat metus dui, nec efficitur nunc efficitur et. Ut placerat vitae lectus vel lacinia.
      Nulla lobortis mattis elit. Mauris orci eros, tristique a sagittis ac, lacinia non tellus.
      Phasellus imperdiet lorem vitae metus lacinia, eget tincidunt orci pharetra. Quisque in dictum
      ex. Vivamus viverra condimentum leo eu porta. Mauris pretium sodales mollis. Pellentesque ac
      sollicitudin orci. Donec nibh mauris, ullamcorper vel magna ornare, luctus egestas leo. Donec
      vulputate erat eu elit varius mattis. Sed at quam ac mauris laoreet tristique. Vestibulum
      venenatis venenatis efficitur. Fusce nec ligula quis turpis vestibulum vulputate a id augue.
      Nam commodo massa et ex aliquam consectetur. Maecenas elementum velit non purus ullamcorper
      scelerisque.
    </ModalBase>
  );
}

PlayModal.propTypes = {
  onClose: PropTypes.func,
  questAddress: PropTypes.string,
  disabled: PropTypes.bool,
};
