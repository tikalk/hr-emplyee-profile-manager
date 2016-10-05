import React, { PropTypes } from 'react';
import classNames from 'classnames';

const styleDisabled = {
  pointerEvents: 'none',
  opacity: 0.5
};

export default function EditToggle(props) {
  const { editing, onToggleEditing, disabled } = props;
  const btnClasses = classNames('glyphicon', {
    'glyphicon-floppy-save': editing,
    'glyphicon-edit': !editing
  });

  return <i onClick={onToggleEditing} className={btnClasses} style={disabled ? styleDisabled : {}} />;
}

EditToggle.propTypes = {
  onToggleEditing: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
  disabled: PropTypes.bool
};

