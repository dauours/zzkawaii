# zzkawii

Fork from [YiGeDingLia](https://github.com/ustc-zzzz/YiGeDingLia), connect any idiom to "zhōu zhōu kě ài". Idiom resources are collected from [chinese-xinhua](https://github.com/pwxcoo/chinese-xinhua).

## Demo

https://zzka.noddl.me

## Secondary Development

1. Replace Pinyin of your idiom word in the `indexed` function

```js
let pinyins = new Set(["zhōu"]);
//...
```

2. Replace result description in the `handle` function.

```js
result.push("周周可爱（zhōu zhōu kě ài）");
```
