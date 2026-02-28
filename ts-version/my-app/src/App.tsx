// src/App.tsx
import React, { useState } from 'react';
import { FUSION_DATA } from './data';
import Game from './Game';
import './App.css';

type Status = 'home' | 'theme' | 'game';
type Theme = 'animals' | 'foods';

function App() {
  // 1: home (最初), 2: theme (選択), 3: game (プレイ中)
  const [status, setStatus] = useState<Status>('home'); 
  const [selectedTheme, setSelectedTheme] = useState<Theme>('animals');

  // ゲームを最初からやり直す関数
  const goToHome = () => setStatus('home');

  return (
    <div className="App">
      {/* 1. ホーム画面 */}
      {status === 'home' && (
        <div className="screen home">
          <h1 className="title">がったい けんきゅうじょ</h1>
          <button className="start-btn" onClick={() => setStatus('theme')}>
            スタート！
          </button>
        </div>
      )}

      {/* 2. テーマ選択画面 */}
      {status === 'theme' && (
        <div className="screen theme-select">
          <h2 className="title">なにを がったいさせる？</h2>
          <div className="theme-options">
            <button className="theme-btn" onClick={() => { setSelectedTheme('animals'); setStatus('game'); }}>
              🦁 どうぶつ
            </button>
            <button className="theme-btn" onClick={() => { setSelectedTheme('foods'); setStatus('game'); }}>
              🍕 たべもの
            </button>
          </div>
          <button className="back-link" onClick={() => setStatus('home')}>もどる</button>
        </div>
      )}

      {/* 3. ゲーム画面 */}
      {status === 'game' && (
        <Game 
          magicData={FUSION_DATA.magic} 
          themeData={FUSION_DATA.themes[selectedTheme]} 
          onBack={goToHome}
        />
      )}
    </div>
  );
}

export default App;