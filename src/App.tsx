import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
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
  Image,
} from 'grommet';
import {
  Add,
  FormClose,
  FormNextLink,
  Notification,
  Subtract,
} from 'grommet-icons';
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  useHistory,
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

type PickerProps = {
  numberOfPlayers: number;
  setNumberOfPlayers: (number: any) => void;
};

const Picker = (props: PickerProps) => {
  const { numberOfPlayers, setNumberOfPlayers } = props;
  const history = useHistory();

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
            onClick={async () => {
              const docRef = await addDoc(collection(db, 'sessions'), {
                numberOfPlayers,
              });

              const cardCount = 20;
              const cardsPerPlayer = numberOfPlayers === 2 ? 2 : 1;
              const cards = Array.from(Array(cardCount).keys());
              shuffleArray(cards);

              Array.from(Array(numberOfPlayers)).forEach(() =>
                addDoc(collection(db, 'sessions', docRef.id, 'players'), {
                  cards: cards.splice(0, cardsPerPlayer),
                }),
              );

              history.push(`/sessions/${docRef.id}`);
            }}
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
    </Box>
  );
};

const Player = () => {
  const { sessionId, playerId } =
    useParams<{ sessionId: string; playerId: string }>();
  const docRef = doc(db, 'sessions', sessionId, 'players', playerId);
  const storage = getStorage(app);
  const [images, setImages] = useState<any>(null);
  useEffect(() => {
    const getImages = async () => {
      const docSnapshot = await getDoc(docRef);
      // @ts-ignore
      const { cards } = docSnapshot.data();
      const cardImages: any[] = [];
      console.log(cards);
      for (let cardIdx in cards) {
        const fileRef = ref(
          storage,
          `special-cards/special-card-${cards[cardIdx]}.png`,
        );
        await getDownloadURL(fileRef).then((downloadUrl) => {
          cardImages.push(downloadUrl);
        });
      }
      setImages([...cardImages]);
    };
    getImages();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!images) return null;

  return (
    <Box flex justify="center" align="center" direction="row">
      {images.map((imageUrl: string, idx: string) => (
        <Image src={imageUrl} key={idx} />
      ))}
    </Box>
  );
};

const Session = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const collectionRef = collection(db, 'sessions', sessionId, 'players');
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    getDocs(collectionRef).then((res) => {
      setData(res.docs.map((el) => el.id));
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!data) return null;
  return (
    <Box flex justify="center" align="center">
      {data.map((el: string, idx: number) => (
        <Link to={`/sessions/${sessionId}/players/${el}`} key={idx}>
          Player {idx + 1}
        </Link>
      ))}
    </Box>
  );
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
                  <Link to="/">Lovecraftesque</Link>
                </Heading>
                <Button
                  icon={<Notification />}
                  onClick={() => setShowSidebar(!showSidebar)}
                />
              </AppBar>
              <Box direction="row" flex overflow={{ horizontal: 'hidden' }}>
                <Switch>
                  <Route path="/sessions/:sessionId/players/:playerId">
                    <Player />
                  </Route>
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
