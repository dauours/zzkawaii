import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import "./github-markdown.css";
import bg from "./watermelon.png";

interface Data {
  abbreviation: string;
  derivation: string;
  example: string;
  explanation: string;
  pinyin: string;
  word: string;
  level?: number;
}

interface State {
  firstPinyin: {
    [key: string]: Data[];
  };
  lastPinyin: {
    [key: string]: Data[];
  };
  word: {
    [key: string]: Data;
  };
  error?: string;
}

const getFirstPinyin = (data: Data) => {
  return (data.pinyin.split(/\s+/).shift() || "")
    .replace(/[āáǎà]/g, "a")
    .replace(/[ōóǒò]/g, "o")
    .replace(/[ēéěèê]/g, "e")
    .replace(/[īíǐì]/g, "i")
    .replace(/[ūúǔù]/g, "u")
    .replace(/[ǖǘǚǜü]/g, "v");
};

const getLastPinyin = (data: Data) => {
  return (data.pinyin.split(/\s+/).pop() || "")
    .replace(/[āáǎà]/g, "a")
    .replace(/[ōóǒò]/g, "o")
    .replace(/[ēéěèê]/g, "e")
    .replace(/[īíǐì]/g, "i")
    .replace(/[ūúǔù]/g, "u")
    .replace(/[ǖǘǚǜü]/g, "v");
};

const fix = (data: Data) => {
  if ("味同嚼蜡" === data.word) {
    data.pinyin = data.pinyin.replace("cù", "là");
  }
  if (data.word.endsWith("俩")) {
    data.pinyin = data.pinyin.replace("liǎng", "liǎ");
  }
  data.pinyin = data.pinyin.replace(/yi([ēéěèêe])/g, "y$1");
  return data;
};

const indexed = (json: Data[]) => {
  const result: State = { firstPinyin: {}, lastPinyin: {}, word: {} };
  for (const data of json) {
    fix(data);
    if (data.word.length === 4) {
      const key1 = getLastPinyin(data);
      const values1 = result.lastPinyin[key1] || [];
      result.lastPinyin[key1] = values1;
      values1.push(data);

      const key2 = getFirstPinyin(data);
      const values2 = result.firstPinyin[key2] || [];
      result.firstPinyin[key2] = values2;
      values2.push(data);

      result.word[data.word] = data;
    }
  }
  let pinyins = new Set(["zhou"]);
  for (let level = 1; pinyins.size > 0; ++level) {
    const newpinyins = new Set<string>();
    pinyins.forEach(pinyin => {
      for (const data of result.lastPinyin[pinyin] || []) {
        if (!data.level) {
          data.level = level;
          newpinyins.add(getFirstPinyin(data));
        }
      }
    });
    console.log(`Generate ${newpinyins.size} entries for level ${level}`);
    pinyins = newpinyins;
  }
  return result;
};

const handle = (input: string, state: State) => {
  const result: string[] = [];
  let data = state.word[input];
  while (data && data.level) {
    const level = data.level;
    result.push(`${data.word}（${data.pinyin}）`);
    if (level > 1) {
      const next = state.firstPinyin[getLastPinyin(data)];
      const filtered = next.filter(d => d.level && d.level < level);
      data = filtered[Math.floor(Math.random() * filtered.length)];
    } else {
      result.push("周周可爱（zhōu zhōu kě ài）");
      return result;
    }
  }
  return result;
};

function App() {
  const [state, setState] = React.useState<State>({
    firstPinyin: {},
    lastPinyin: {},
    word: {}
  });
  const [seq, setSeq] = React.useState<string[]>([]);

  if (Object.keys(state.word).length > 0) {
    return (
      <div className="markdown-body">
        <div className="bg">

        </div>

        <h1>
          <span style={{ color: "pink" }}>周周</span>可爱
        </h1>
        <p>为了证明周周可爱是一个合法成语, 所以: 请输入一个四字成语</p>
        <p>左左将自动为你接龙到"周周可爱"</p>
        <p>
          <input
            type="input"
            onChange={e => setSeq(handle(e.target.value, state))}
          />
        </p>
        <ul>
          {seq.map(data => {
            return <li key={data}>{data}</li>;
          })}
        </ul>
      </div>
    );
  } else if (state.error) {
    return (
      <div className="markdown-body">
        <h1>
          <span style={{ color: "pink" }}>周周</span>可爱
        </h1>
        <p style={{ color: "red" }}>{`数据加载中...加载异常，请刷新重试：${
          state.error
        }`}</p>
      </div>
    );
  } else {
    const url =
      "https://cdn.jsdelivr.net/gh/pwxcoo/chinese-xinhua/data/idiom.json";
    fetch(url)
      .then(res => res.json())
      .then(json => setState(indexed(json)))
      .catch(error => setState({ ...state, error }));
    return (
      <div className="markdown-body">
        <h1>周周可爱</h1>
        <p>数据加载中...</p>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementsByTagName("main")[0]);
