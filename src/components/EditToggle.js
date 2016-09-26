import React, { PropTypes } from 'react';
import classNames from 'classnames';


export default function EditToggle(props) {
  const { editing, onToggleEditing } = props;
  const btnClasses = classNames('glyphicon', {
    'glyphicon-floppy-save': editing,
    'glyphicon-edit': !editing
  });

  return <i onClick={onToggleEditing} className={btnClasses} />;
}

EditToggle.propTypes = {
  onToggleEditing: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired
};

