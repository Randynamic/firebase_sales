import React from "react";

import { I18nContext } from "./I18n";
import { SessionContext } from "./Session";
import { FirebaseContext } from "./Firebase";

export const PublicConsumer = props => {
  const { ConsumingComponent, ...rest } = props;
  return (
    <I18nContext.Consumer>
      {i18n => (
        <FirebaseContext.Consumer>
          {firebase => (
            // Wrapping component with Context Consumers
            <ConsumingComponent {...rest} {...i18n} {...firebase} />
          )}
        </FirebaseContext.Consumer>
      )}
    </I18nContext.Consumer>
  );
};

export const PrivateConsumer = props => {
  const { ConsumingComponent, ...rest } = props;
  return (
    <I18nContext.Consumer>
      {i18n => (
        <SessionContext.Consumer>
          {session => (
            <FirebaseContext.Consumer>
              {firebase => (
                // Wrapping component with Context Consumers
                <ConsumingComponent {...rest} {...session} {...i18n} {...firebase} />
              )}
            </FirebaseContext.Consumer>
          )}
        </SessionContext.Consumer>
      )}
    </I18nContext.Consumer>
  );
};
