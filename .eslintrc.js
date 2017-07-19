module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "google"
    ],
    "rules": {
    //     // 関数のカッコの前のスペースを禁止
    //     "func-call-spacing": [2, "never"],
    //     // カンマの前のスペースを禁止、後のスペースを許可する
    //     "comma-spacing": [2, {"before": false, "after": true}],
    //     // カンマを行末に強制
    //     "comma-style": [2, "last"],
    //     // オブジェクトの末尾のカンマを強制
    //     "comma-dangle": [2, "never"],
    //     // シングルクォートとテンプレートリテラルを許可
    //     "quotes": [2, "single", { "allowTemplateLiterals": true }],
    //     // 厳密等価演算子を強制
    //     "eqeqeq": 2,
    //     // 連続スペースを禁止
    //     "no-multi-spaces": 2,
    //     // ブラケット記法 obj[key] を許可
    //     "dot-notation": 0,
    //     // 末尾のセミコロンを禁止
    //     "semi": [2, "always"],
    //     // const let を強制
    //     "no-var": 2,
    //     // 再代入がない限り const を強制
    //     "prefer-const": 2,
    //     // インデントを４スペースに強制
    //     "indent": [2, 4, {"SwitchCase": 1}],
    //     // 連続した空行を注意
    //     "no-multiple-empty-lines": [1, {"max": 1}],
    //     // alert を注意
    //     "no-alert": 1,
        // console を注意
        "no-console": 1,
        // １行の文字数を制限
        "max-len": [0, {"ignoreStrings": true, "ignoreTemplateLiterals": true}],
        // 改行のスタイルの指定を無視する
        "linebreak-style": 0,
    },
    "plugins": [
    ],
    "globals": {
    },
    "parserOptions": {
        "sourceType": "module"
    }
};