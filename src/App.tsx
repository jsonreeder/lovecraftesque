import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Collapsible,
  Grommet,
  Heading,
  Layer,
  ResponsiveContext,
} from 'grommet';
import {
  Add,
  FormClose,
  FormNextLink,
  Notification,
  Subtract,
} from 'grommet-icons';
import React, { useState } from 'react';

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

function shuffleArray(array: any) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

type CardAssignmentsProps = {
  numberOfPlayers: number;
};

const CardAssignments = (props: CardAssignmentsProps) => {
  const { numberOfPlayers } = props;
  const cardCount = 20;
  const cards = Array.from(Array(cardCount).keys());
  shuffleArray(cards);

  const choices: any[] = [];
  console.log(cards);
  for (let _player of Array(numberOfPlayers)) {
    choices.push(cards.splice(0, 2));
  }

  return (
    <Box flex align="center" justify="center">
      <Card height="small" width="small" background="light-1">
        <CardHeader pad="medium">Cards</CardHeader>
        <CardBody pad="medium">
          <Box flex align="center" justify="center">
            {[...Array(numberOfPlayers)].map((el, idx) => (
              <div>
                Player {idx + 1}: {choices[idx].join(', ')}
              </div>
            ))}
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

type PickerProps = {
  numberOfPlayers: number;
  setNumberOfPlayers: (number: any) => void;
};

const Picker = (props: PickerProps) => {
  const { numberOfPlayers, setNumberOfPlayers } = props;

  return (
    <Box flex align="center" justify="center">
      <Card height="small" width="small" background="light-1">
        <CardHeader pad="medium">Number of Players</CardHeader>
        <CardBody pad="medium">
          <Box flex align="center" direction="row" justify="center">
            <Button
              icon={<Subtract />}
              onClick={() => setNumberOfPlayers(numberOfPlayers - 1)}
              disabled={numberOfPlayers <= 2}
            />
            {numberOfPlayers}
            <Button
              icon={<Add />}
              onClick={() => setNumberOfPlayers(numberOfPlayers + 1)}
            />
          </Box>
        </CardBody>
        <CardFooter
          justify="end"
          pad={{ horizontal: 'small' }}
          background="light-2"
        >
          <Button icon={<FormNextLink />} hoverIndicator />
        </CardFooter>
      </Card>
    </Box>
  );
};

const AppBody = () => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
  return (
    <Box fill>
      <Picker
        numberOfPlayers={numberOfPlayers}
        setNumberOfPlayers={setNumberOfPlayers}
      />
      <CardAssignments numberOfPlayers={numberOfPlayers} />
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
