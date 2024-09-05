<div align="center">

  <img src="./assets/spotify-logo.png" alt="logo" width="200" height="auto" />
  <h1>Spotify Geni</h1>
  
  <p>
    Spotify Genius는 Spotify API와 Web Playback SDK를 사용하여 사용자에게 음악을 검색하고 재생할 수 있는 기능을 제공하는 웹 애플리케이션입니다. 이 앱은 또한 가사를 검색하고 번역할 수 있는 기능을 제공합니다.
  </p>

<!-- Badges -->
<p>
  
</p>
   
<h4>
    <a href="https://github.com/Louis3797/awesome-readme-template">Documentation</a>
  </h4>
</div>

<br />

<!-- Table of Contents -->

# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
  - [Tech Stack](#space_invader-tech-stack)
  - [Features](#dart-features)
  - [Environment Variables](#key-environment-variables)
- [Getting Started](#toolbox-getting-started)
  - [Prerequisites](#bangbang-prerequisites)
  - [Installation](#gear-installation)
  - [Run Locally](#running-run-locally)
- [Usage](#eyes-usage)
- [Acknowledgements](#gem-acknowledgements)

<!-- About the Project -->

## :star2: About the Project

<div align="center"> 
  <img src="./assets/image.png" alt="screenshot" />
</div>

<!-- TechStack -->

### :space_invader: Tech Stack

<details>
  <summary>Client</summary>
  <ul>
    React : 사용자 인터페이스 구축
    Axios : HTTP 요청 처리
    Spotify API : 음악 데이터 및 재생 제어
    Spotify Web Playback SDK : Spotify 트랙 재생
    React Bootstrap : UI 컴포넌트 스타일링
    Font Awesome : UI 아이콘 사용
    Genius API : 가사 불러오기
    DeepL API : 가사 번역하는데 사용
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://expressjs.com/">Express.js</a></li>
    <li><a href="https://nodejs.com/">Node.js</a></li>
  </ul>
</details>

<details>
<summary>DevOps</summary>

</details>

<!-- Features -->

### :dart: Features

- Spotify에 로그인하여 사용자 인증
- 아티스트와 트랙 검색
- 선택한 트랙 또는 플레이리스트에 있는 트랙 재생 및 제어 (재생, 일시 정지, 다음 트랙, 이전 트랙)
- 현재 재생 중인 트랙의 가사 표시 및 번역

<!-- Env Variables -->

### :key: Environment Variables

To run this project, you will need to add the following environment variables to your .env file

- Clinet
  `REACT_APP_CLIENT_ID`
- Server
  `PORT`
  `CLIENT_ID`
  `CLIENT_SECRET`
  `GENIUS_API_KEY`
  `DEEPL_API_KEY`

This project uses Yarn as package manager

```bash
 npm install --global
```

<!-- Installation -->

### :gear: Installation

Install my-project with npm

```bash
  yarn install my-project
  cd my-project
```

<!-- Run Locally -->

### :running: Run Locally

Clone the project

```bash
  git clone https://github.com/Hyun198/spotify_final.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```

<!-- Usage -->

## :eyes: Usage

#### Spotify API 토큰 받아오기

    const getAccessToken = async () => {
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      form: {
        grant_type: "client_credentials",
      },
      json: true,
    };

    try {
      const response = await axios.post(authOptions.url, authOptions.form, {
        headers: authOptions.headers,
      });
      return response.data.access_token;
    } catch (error) {
      console.error("Error fetching access token: ", error);
    }
    };

#### Genius API

    try {
          const { name, artist } = req.body;
          console.log(name, artist);
          const apiKey = process.env.GENIUS_API_KEY;
          const options = {
              apiKey: apiKey,
              title: name,
              artist: artist,
              optimizeQuery: true,
          };
          const lyrics = await getLyrics(options)
          console.log("가사 불러오기 성공");
          res.json({ lyrics: lyrics });

      } catch (error) {
          console.error('error selected track:', error.message);
          res.status(500).json({ error: 'failed to select track' });
      }

#### DeepL api

    try {
        const { lyrics, targetLang } = req.body;
        console.log(lyrics, targetLang);
        const apiKey = process.env.DEEPL_API_KEY;
        const translator = new deepl.Translator(apiKey);
        const result = await translator.translateText(lyrics, null, targetLang);
        res.json(result);
    } catch (error) {
        console.error("Error translating lyrics:", error.message);
        res.status(500).json({ error: "Failed to translate lyrics" });
    }

<!-- Acknowledgments -->

## :gem: Acknowledgements

Use this section to mention useful resources and libraries that you have used in your projects.

- [Shields.io](https://shields.io/)
- [Awesome README](https://github.com/matiassingers/awesome-readme)
- [Emoji Cheat Sheet](https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md#travel--places)
- [Readme Template](https://github.com/othneildrew/Best-README-Template)
