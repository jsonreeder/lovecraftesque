import React, { useState } from 'react';

import {
  Box,
  Button,
  Collapsible,
  Heading,
  Grommet,
  Layer,
  ResponsiveContext,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from 'grommet';
import { FormClose, Notification } from 'grommet-icons';

const theme = {
  global: {
    colors: {
      brand: '#228BE6',
    },
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
};

const AppBar = (props: any) => (
  <Box
    tag="header"
    direction="row"
    align="center"
    justify="between"
    background="brand"
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    elevation="medium"
    style={{ zIndex: '1' }}
    {...props}
  />
);

const AppBody = () => {
  return (
    <Box flex align="center" justify="center">
      <Card height="small" width="small" background="light-1">
        <CardHeader pad="medium">Header</CardHeader>
        <CardBody pad="medium">Body</CardBody>
        <CardFooter pad={{ horizontal: 'small' }} background="light-2">
          <Button hoverIndicator />
          <Button hoverIndicator />
        </CardFooter>
      </Card>
    </Box>
  );
};

function App() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <Grommet theme={theme} full>
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box fill>
            <AppBar>
              <Heading level="3" margin="none">
                Lovecraftesque
              </Heading>
              <Button
                icon={<Notification />}
                onClick={() => setShowSidebar(!showSidebar)}
              />
            </AppBar>
            <Box direction="row" flex overflow={{ horizontal: 'hidden' }}>
              <AppBody />
              {!showSidebar || size !== 'small' ? (
                <Collapsible direction="horizontal" open={showSidebar}>
                  <Box
                    flex
                    width="medium"
                    background="light-2"
                    elevation="small"
                    align="center"
                    justify="center"
                  >
                    sidebar
                  </Box>
                </Collapsible>
              ) : (
                <Layer>
                  <Box
                    background="light-2"
                    tag="header"
                    justify="end"
                    align="center"
                    direction="row"
                  >
                    <Button
                      icon={<FormClose />}
                      onClick={() => setShowSidebar(false)}
                    />
                  </Box>
                  <Box
                    fill
                    background="light-2"
                    align="center"
                    justify="center"
                  >
                    sidebar
                  </Box>
                </Layer>
              )}
            </Box>
          </Box>
        )}
      </ResponsiveContext.Consumer>
    </Grommet>
  );
}

export default App;
