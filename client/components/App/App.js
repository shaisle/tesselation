import React, { useState, useEffect } from 'react';
import './app.scss';

import NavBar from '../NavBar/NavBar';
import Hero from '../Hero/Hero';
import ChooseStack from '../ChooseStack/ChooseStack';
import CardsList from '../CardsList/CardsList';
import Faqs from '../Faqs/Faqs';
import SearchParams from '../SearchParams/SearchParams';
import RepoButtons from '../RepoButtons/RepoButtons';

const cardsState = [
  {
    id: Math.random(),
    tech: 'React',
    description:
      'React is the most popular front-end JavaScript library in the field of web development. Get the webpack and starter scripts to run your application.',
    isSelected: false,
  },
  {
    id: Math.random(),
    tech: 'Node',
    description:
      'Node.js is a JavaScript runtime built on Chrome’s V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient',
    isSelected: false,
  },
  {
    id: Math.random(),
    tech: 'Express',
    description:
      'Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. APIs.',
    isSelected: false,
  },
  {
    id: Math.random(),
    tech: 'Jest',
    description:
      'Jest is a delightful JavaScript Testing Framework with a focus on simplicity. Jest manages metadata about your source code to run only the relevant test files when a source code file is changed.',
    isSelected: false,
  },
];

const App = () => {
  const [cards, setCards] = useState(cardsState);
  const [value, setValue] = useState('');
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDataBack, setIsDataBack] = useState(false);
  const [repoLink, setRepoLink] = useState('');

  useEffect(() => {
    const accessToken = window.location.href.split('=')[1];

    if (accessToken) {
      fetch('/api/oath/checksession')
        .then((res) => res.json())
        .then((res) => {
          setUser(res);
        });

      setAccessToken(accessToken);
      setIsLoggedIn(true);
    }
  }, []);

  const sendBack = () => {
    const selectedTechs = cards.filter((card) => card.isSelected).map((card) => card.tech);

    fetch(`/api/github/repos/create?access_token=${accessToken}&repoName=${value}`, {
      method: 'post',
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log(res.html_url);

        setRepoLink(res.html_url);
        setIsDataBack(true);
      });
  };

  const toggleSelect = (id) => {
    setCards(
      cards.map((card) => (card.id === id ? { ...card, isSelected: !card.isSelected } : card)),
    );
  };

  const handleChange = ({ target: { value } }) => setValue(value);

  const connectToGitHub = () => {
    const client_id = '9736e547efbf758aa0dc'; //from GH application settings area
    const redirect_uri = 'http://localhost:3000/api/oauth/callback/';
    const state = '9323bb9ce6934469b58303863f8c0d54'; //unique string, hard coded for now.
    const scope = 'scope=user%20public_repo';

    const params = `client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}&scope=${scope}&allow_signup=true`;

    window.location.replace(`https://github.com/login/oauth/authorize?${params}`);
  };

  return (
    <div className="App">
      <NavBar connectToGitHub={connectToGitHub} user={user} />
      <main>
        <Hero />
        <ChooseStack>
          <CardsList cards={cards} toggleSelect={toggleSelect} />
        </ChooseStack>

        <SearchParams value={value} onChange={handleChange} user={user} />
        <RepoButtons
          isLoggedIn={isLoggedIn}
          connectToGitHub={connectToGitHub}
          sendBack={sendBack}
          isDataBack={isDataBack}
          repoLink={repoLink}
        />

        <Faqs />
      </main>
    </div>
  );
};

export default App;
