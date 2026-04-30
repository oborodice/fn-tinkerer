# Fn Tinkerer

- 数学関数をインタラクティブにグラフ描画・音声再生できるWebアプリ

## 機能

- sin / cos / tan 等の関数の波形をリアルタイムでグラフ表示
- 振幅・周波数・位相をスライダーで調整
- 波形のループ再生

## 開発

```bash
$ mise trust
$ mise install
$ npm install
$ npm run dev
```

## 技術スタック

- Svelte 5 + TypeScript + Vite
- [Function Plot](https://mauriciopoppe.github.io/function-plot/)
- Web Audio API (AudioWorklet)
