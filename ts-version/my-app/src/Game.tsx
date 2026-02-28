import React, { useState, useEffect, useCallback } from 'react';

type WordItem = {
  id: string;
  en: string;
  jp: string;
  emoji: string
};

type GameProps = {
  magicData: WordItem[];
  themeData: WordItem[];
  onBack: () =>void;
};

const Game: React.FC<GameProps> = ({ magicData, themeData, onBack }) => {
  const [mIdx, setMIdx] = useState<number>(0);
  const [aIdx, setAIdx] = useState<number>(0);
  const [leftSelected, setLeftSelected] = useState<boolean>(false);
  const [rightSelected, setRightSelected] = useState<boolean>(false);
  const [isMerged, setIsMerged] = useState<boolean>(false);

  const magic = magicData[mIdx];
  const targetItem = themeData[aIdx];

  // 音声再生（Promiseで制御）
  const speak = (text: string, lang: string, rate: number = 1.0): Promise<void> => {
    return new Promise((resolve) => {
      const uttr = new SpeechSynthesisUtterance(text);
      uttr.lang = lang;
      uttr.rate = rate;
      uttr.onend = () => resolve();
      window.speechSynthesis.cancel(); // iOS対策：再生前にキャンセル
      window.speechSynthesis.speak(uttr);
    });
  };

  // 指定回数繰り返す
  const speakRepeat = useCallback(async (text: string, lang: string, times:number) => {
    for (let i = 0; i < times; i++) {
      await speak(text, lang);
      await new Promise((r) => setTimeout(r, 200));
    }
  }, []);

  // 初期再生（左→右）
  useEffect(() => {
    if (!isMerged) {
      (async () => {
        await speakRepeat(magic.en, 'en-US', 2);
        await speakRepeat(targetItem.en, 'en-US', 2);
      })();
    }
  }, [mIdx, aIdx, isMerged, magic.en, targetItem.en, speakRepeat]);

  // 合体判定
  useEffect(() => {
    if (leftSelected && rightSelected) {
      const timer = setTimeout(() => setIsMerged(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [leftSelected, rightSelected]);

  // 合体後の発音
  useEffect(() => {
    if (isMerged) {
      (async () => {
        await speak(`${magic.en} ${targetItem.en}`, 'en-US', 0.9);
        await speak(`${magic.jp}${targetItem.jp}`, 'ja-JP', 1.0);
      })();
    }
  }, [isMerged, magic, targetItem]);

  const nextGame = () => {
    setIsMerged(false);
    setLeftSelected(false);
    setRightSelected(false);
    setMIdx((mIdx + 1) % magicData.length);
    setAIdx((aIdx + 1) % themeData.length);
  };

  return (
    <div className="game-screen">
      <button className="back-btn" onClick={onBack}>← もどる</button>

      {!isMerged ? (
        <div className="split-screen">
          <div
            className={`card-section left ${leftSelected ? 'selected' : ''}`}
            onClick={() => setLeftSelected(true)}
          >
            <h1 className="en-word">{magic.en}</h1>
            <div className="visual-emoji">{magic.emoji}</div>
            <h2 className="jp-word">{magic.jp}</h2>
            {leftSelected && <div className="ok-badge">OK!</div>}
          </div>

          <div
            className={`card-section right ${rightSelected ? 'selected' : ''}`}
            onClick={() => setRightSelected(true)}
          >
            <h1 className="en-word">{targetItem.en}</h1>
            <div className="visual-emoji">{targetItem.emoji}</div>
            <h2 className="jp-word">{targetItem.jp}</h2>
            {rightSelected && <div className="ok-badge">OK!</div>}
          </div>
        </div>
      ) : (
        <div className="fusion-result-screen">
          <div className="fusion-card">
            <h1 className="fusion-en-name">{magic.en} {targetItem.en}</h1>
            <div className="fusion-visual-mix">
              <span>{magic.emoji}</span>
              <span style={{ fontSize: '4rem', color: '#ccc' }}>+</span>
              <span>{targetItem.emoji}</span>
            </div>
            <h2 className="fusion-jp-name">{magic.jp}{targetItem.jp}</h2>
            <button className="next-btn" onClick={nextGame}>つぎの もんだいへ！</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;