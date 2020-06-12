/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { fromJS } from 'immutable';
import { registerModule } from 'holocron';
import ModuleRoute from 'holocron-module-route';
import { hot } from 'react-hot-loader/root';

// eslint-disable-next-line react/prop-types
function RootHolocronModule({ children }) {
  return (
    <div>
      <p>Root</p>
      {children}
    </div>
  );
}

RootHolocronModule.holocron = {
  name: 'root-holocron-module',
  reducer: (state = fromJS({})) => state,
};

RootHolocronModule.childRoutes = () => [
  <ModuleRoute path="*" moduleName="holocron-module" />,
];

window.getTenantRootModule = () => RootHolocronModule;

registerModule('root-holocron-module', RootHolocronModule);

export default hot(RootHolocronModule);
