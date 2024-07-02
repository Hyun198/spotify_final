# Spotify Genius

Spotify Genius는 Spotify API와 Web Playback SDK를 사용하여 사용자에게 음악을 검색하고 재생할 수 있는 기능을 제공하는 웹 애플리케이션입니다. 이 앱은 또한 가사를 검색하고 번역할 수 있는 기능을 제공합니다.

## 주요 기능

- Spotify에 로그인하여 사용자 인증
- 아티스트와 트랙 검색
- 트랙 재생 및 제어 (재생, 일시 정지, 다음 트랙, 이전 트랙)
- 현재 재생 중인 트랙의 가사 표시 및 번역
- 사용자 플레이리스트에 트랙 추가

## 주요 기술 스택

- React : 사용자 인터페이스 구축
- Axios : HTTP 요청 처리
- Spotify API : 음악 데이터 및 재생 제어
- Spotify Web Playback SDK : Spotify 트랙 재생
- React Bootstrap : UI 컴포넌트 스타일링
- Font Awesome : UI 아이콘 사용
- Genius API : 가사 번역

## 기능 설명

    사용자 인증
        Spotify OAuth 2.0을 사용하여 사용자를 인증합니다. 사용자가 앱에 로그인하면 Spotify API를 통해 데이터를 요청할 수 있는 액세스 토큰을 받습니다.

    검색 기능
        사용자는 아티스트와 트랙을 검색할 수 있습니다. 검색된 아티스트의 상위 트랙과 검색된 트랙의 결과를 보여줍니다.

    트랙 재생 및 제어
        사용자는 트랙을 재생, 일시 정지, 다음 트랙으로 건너뛰기, 이전 트랙으로 돌아가기 등의 재생 제어를 할 수 있습니다.

    가사 표시 및 번역
        현재 재생 중인 트랙의 가사를 표시하고 사용자가 선택한 언어로 번역할 수 있습니다.

    플레이리스트 관리
        사용자는 자신의 플레이리스트를 보고, 재생 중인 트랙을 선택한 플레이리스트에 추가할 수 있습니다.

## 설치 및 실행 방법

1. 이 리포지토리를 클론합니다.

   ```bash
   git clone https://github.com/yourusername/spotify-genius.git
   cd spotify-genius
   ```

2. 필요한 패키지를 설치합니다.

   ```bash
   cd server
   npm install

   new bash
   cd client
   npm install

   ```

3. Spotify 개발자 계정을 생성하고, 클라이언트 ID와 클라이언트 시크릿을 얻습니다. 그런 다음, `.env` 파일을 생성하고 다음과 같이 설정합니다.

   ```env
   REACT_APP_SPOTIFY_CLIENT_ID=your_client_id
   REACT_APP_SPOTIFY_CLIENT_SECRET=your_client_secret
   REACT_APP_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
   ```

4. 서버를 실행하여 액세스 토큰을 가져올 수 있도록 설정합니다.

   ```bash
   npm run dev
   development - using nodemon
   ```

5. 클라이언트 앱을 실행합니다.

   ```bash
   npm start
   ```

6. 웹 브라우저에서 [http://localhost:3000](http://localhost:3000)으로 이동합니다.

## Spotify API 사용 과정

### 서버 측에서 공용 데이터 접근

서버에서는 Spotify API에 접근하기 위해 액세스 토큰을 받아와야 합니다. `server.js` 파일에서는 클라이언트 ID와 클라이언트 시크릿을 사용하여 액세스 토큰을 요청합니다.

Spotify 개발자 계정을 생성하고, 클라이언트 ID와 클라이언트 시크릿을 얻습니다. 그런 다음, `.env` 파일을 생성하고 다음과 같이 설정합니다.

````env

```javascript
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
````
