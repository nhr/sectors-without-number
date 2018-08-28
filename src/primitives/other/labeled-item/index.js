import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import FlexContainer from 'primitives/container/flex-container';
import Label from 'primitives/form/label';

import './style.css';

export default function LabeledItem({
  isVertical,
  isRequired,
  label,
  children,
  className,
}) {
  const requiredFlag = isRequired ? ' *' : '';
  return (
    <FlexContainer
      align="center"
      className={classNames('LabeledItem', className, {
        'LabeledItem--vertical': isVertical,
      })}
    >
      <Label noPadding className="LabeledItem-Label">
        <FormattedMessage id={label} />
        {requiredFlag}
      </Label>
      <FlexContainer className="LabeledItem-Item">{children}</FlexContainer>
    </FlexContainer>
  );
}

LabeledItem.propTypes = {
  isVertical: PropTypes.bool,
  isRequired: PropTypes.bool,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

LabeledItem.defaultProps = {
  isVertical: false,
  isRequired: false,
  className: undefined,
};
