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
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  getFirestore,
  doc,
  getDoc,
} from 'firebase/firestore';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom';

const firebaseConfig = {
  apiKey: 'AIzaSyCKI9WiMeXBX7qtalf_yAkdTgwzJsdxKcc',
  authDomain: 'lovecraftesque.firebaseapp.com',
  projectId: 'lovecraftesque',
  storageBucket: 'lovecraftesque.appspot.com',
  messagingSenderId: '959416678806',
  appId: '1:959416678806:web:3b5ce891e92f73e8bfc5b7',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
  const cardsPerPlayer = numberOfPlayers === 2 ? 2 : 1;
  const cards = Array.from(Array(cardCount).keys());
  shuffleArray(cards);

  const choices: any[] = [];
  Array.from(Array(numberOfPlayers)).forEach(() =>
    choices.push(cards.splice(0, cardsPerPlayer)),
  );

  return (
    <Box flex align="center" justify="center">
      <Card height="small" width="small" background="light-1">
        <CardHeader pad="medium">Cards</CardHeader>
        <CardBody pad="medium">
          <Box flex align="center" justify="center">
            {[...Array(numberOfPlayers)].map((el, idx) => (
              <div key={idx}>
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
              disabled={numberOfPlayers >= 5}
            />
          </Box>
        </CardBody>
        <CardFooter
          justify="end"
          pad={{ horizontal: 'small' }}
          background="light-2"
        >
          <Button
            icon={<FormNextLink />}
            hoverIndicator
            onClick={() =>
              addDoc(collection(db, 'sessions'), { numberOfPlayers })
            }
          />
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

const Session = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const docRef = doc(db, 'sessions', sessionId);
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    getDoc(docRef).then((res) => setData(res.data()));
  });

  return <div>{data?.numberOfPlayers}</div>;
};

function App() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <Router>
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
                <Switch>
                  <Route path="/sessions/:sessionId">
                    <Session />
                  </Route>
                  <Route path="/">
                    <AppBody />
                  </Route>
                </Switch>
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
    </Router>
  );
}

export default App;
