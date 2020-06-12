/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { fromJS } from 'immutable';
import { registerModule } from 'holocron';

// eslint-disable-next-line react/prop-types
function HolocronModule({ moduleName }) {
  return (
    <p>
      <span>Hi</span>
      <span>{moduleName}</span>
    </p>
  );
}

HolocronModule.holocron = {
  name: 'holocron-module',
  // eslint-disable-next-line arrow-parens
  reducer: (state = fromJS({})) => state,
};

registerModule('holocron-module', HolocronModule);
