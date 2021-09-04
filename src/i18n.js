import {
    dictionary,
    locale,
    _
  } from 'svelte-i18n';
  function setupI18n({
    withLocale: _locale
  } = {
    withLocale: 'en'
  }) {
    dictionary.set({
      en: {
        "message": {
          "beforeStart": "Put your headphones on.\nClick to start!",
          "afterStart": "Find the Player\nThen click them",
          "end":"Congratulation!\nFound the Player!",
          "reload":"Click to reload the game."
        },
        "speech": {
            "afterStart": "Someone is playing music. Move your cursor to find the Player. Then click them.",
            "end":"Congratulation! You found the Player!",
            "reload":"Click to reload the game."
        }
      },
      ko: {
        "message": {
            "beforeStart": "헤드폰을 쓰세요.\n클릭하여 시작합니다!",
            "afterStart": "연주자를 찾아 클릭하세요.",
            "end":"축하해요!\n연주자를 찾았어요!",
            "reload":"클릭해 게임을 다시 시작합니다."
          },
          "speech": {
              "afterStart": "누군가 음악을 연주하고 있어요. 커서를 움직여 그를 찾고, 클릭하세요.",
              "end":"축하해요! 연주자를 찾았어요!",
              "reload":"이 단추를 클릭해 게임을 다시 시작합니다."
          }
      },
    });
    locale.set(_locale);
  }
  export {
    _,
    setupI18n
  };