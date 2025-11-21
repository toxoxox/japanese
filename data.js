const KANA_DATA = {
    hiragana: {
        a: [
            { char: 'あ', romaji: ['a'] },
            { char: 'い', romaji: ['i'] },
            { char: 'う', romaji: ['u'] },
            { char: 'え', romaji: ['e'] },
            { char: 'お', romaji: ['o'] }
        ],
        ka: [
            { char: 'か', romaji: ['ka'] },
            { char: 'き', romaji: ['ki'] },
            { char: 'く', romaji: ['ku'] },
            { char: 'け', romaji: ['ke'] },
            { char: 'こ', romaji: ['ko'] }
        ],
        sa: [
            { char: 'さ', romaji: ['sa'] },
            { char: 'し', romaji: ['shi', 'si'] },
            { char: 'す', romaji: ['su'] },
            { char: 'せ', romaji: ['se'] },
            { char: 'そ', romaji: ['so'] }
        ],
        ta: [
            { char: 'た', romaji: ['ta'] },
            { char: 'ち', romaji: ['chi', 'ti'] },
            { char: 'つ', romaji: ['tsu', 'tu'] },
            { char: 'て', romaji: ['te'] },
            { char: 'と', romaji: ['to'] }
        ],
        na: [
            { char: 'な', romaji: ['na'] },
            { char: 'に', romaji: ['ni'] },
            { char: 'ぬ', romaji: ['nu'] },
            { char: 'ね', romaji: ['ne'] },
            { char: 'の', romaji: ['no'] }
        ],
        ha: [
            { char: 'は', romaji: ['ha'] },
            { char: 'ひ', romaji: ['hi'] },
            { char: 'ふ', romaji: ['fu', 'hu'] },
            { char: 'へ', romaji: ['he'] },
            { char: 'ほ', romaji: ['ho'] }
        ],
        ma: [
            { char: 'ま', romaji: ['ma'] },
            { char: 'み', romaji: ['mi'] },
            { char: 'む', romaji: ['mu'] },
            { char: 'め', romaji: ['me'] },
            { char: 'も', romaji: ['mo'] }
        ],
        ya: [
            { char: 'や', romaji: ['ya'] },
            { char: 'ゆ', romaji: ['yu'] },
            { char: 'よ', romaji: ['yo'] }
        ],
        ra: [
            { char: 'ら', romaji: ['ra'] },
            { char: 'り', romaji: ['ri'] },
            { char: 'る', romaji: ['ru'] },
            { char: 'れ', romaji: ['re'] },
            { char: 'ろ', romaji: ['ro'] }
        ],
        wa: [
            { char: 'わ', romaji: ['wa'] },
            { char: 'を', romaji: ['wo', 'o'] },
            { char: 'ん', romaji: ['n', 'nn'] }
        ],
        // Dakuon
        ga: [
            { char: 'が', romaji: ['ga'] },
            { char: 'ぎ', romaji: ['gi'] },
            { char: 'ぐ', romaji: ['gu'] },
            { char: 'げ', romaji: ['ge'] },
            { char: 'ご', romaji: ['go'] }
        ],
        za: [
            { char: 'ざ', romaji: ['za'] },
            { char: 'じ', romaji: ['ji', 'zi'] },
            { char: 'ず', romaji: ['zu'] },
            { char: 'ぜ', romaji: ['ze'] },
            { char: 'ぞ', romaji: ['zo'] }
        ],
        da: [
            { char: 'だ', romaji: ['da'] },
            { char: 'ぢ', romaji: ['ji', 'di'] },
            { char: 'づ', romaji: ['zu', 'du'] },
            { char: 'で', romaji: ['de'] },
            { char: 'ど', romaji: ['do'] }
        ],
        ba: [
            { char: 'ば', romaji: ['ba'] },
            { char: 'び', romaji: ['bi'] },
            { char: 'ぶ', romaji: ['bu'] },
            { char: 'べ', romaji: ['be'] },
            { char: 'ぼ', romaji: ['bo'] }
        ],
        // Handakuon
        pa: [
            { char: 'ぱ', romaji: ['pa'] },
            { char: 'ぴ', romaji: ['pi'] },
            { char: 'ぷ', romaji: ['pu'] },
            { char: 'ぺ', romaji: ['pe'] },
            { char: 'ぽ', romaji: ['po'] }
        ],
        // Yōon
        kya: [
            { char: 'きゃ', romaji: ['kya'] },
            { char: 'きゅ', romaji: ['kyu'] },
            { char: 'きょ', romaji: ['kyo'] }
        ],
        sha: [
            { char: 'しゃ', romaji: ['sha', 'sya'] },
            { char: 'しゅ', romaji: ['shu', 'syu'] },
            { char: 'しょ', romaji: ['sho', 'syo'] }
        ],
        cha: [
            { char: 'ちゃ', romaji: ['cha', 'tya'] },
            { char: 'ちゅ', romaji: ['chu', 'tyu'] },
            { char: 'ちょ', romaji: ['cho', 'tyo'] }
        ],
        nya: [
            { char: 'にゃ', romaji: ['nya'] },
            { char: 'にゅ', romaji: ['nyu'] },
            { char: 'にょ', romaji: ['nyo'] }
        ],
        hya: [
            { char: 'ひゃ', romaji: ['hya'] },
            { char: 'ひゅ', romaji: ['hyu'] },
            { char: 'ひょ', romaji: ['hyo'] }
        ],
        mya: [
            { char: 'みゃ', romaji: ['mya'] },
            { char: 'みゅ', romaji: ['myu'] },
            { char: 'みょ', romaji: ['myo'] }
        ],
        rya: [
            { char: 'りゃ', romaji: ['rya'] },
            { char: 'りゅ', romaji: ['ryu'] },
            { char: 'りょ', romaji: ['ryo'] }
        ],
        gya: [
            { char: 'ぎゃ', romaji: ['gya'] },
            { char: 'ぎゅ', romaji: ['gyu'] },
            { char: 'ぎょ', romaji: ['gyo'] }
        ],
        ja: [
            { char: 'じゃ', romaji: ['ja', 'zya'] },
            { char: 'じゅ', romaji: ['ju', 'zyu'] },
            { char: 'じょ', romaji: ['jo', 'zyo'] }
        ],
        bya: [
            { char: 'びゃ', romaji: ['bya'] },
            { char: 'びゅ', romaji: ['byu'] },
            { char: 'びょ', romaji: ['byo'] }
        ],
        pya: [
            { char: 'ぴゃ', romaji: ['pya'] },
            { char: 'ぴゅ', romaji: ['pyu'] },
            { char: 'ぴょ', romaji: ['pyo'] }
        ]
    },
    katakana: {
        a: [
            { char: 'ア', romaji: ['a'] },
            { char: 'イ', romaji: ['i'] },
            { char: 'ウ', romaji: ['u'] },
            { char: 'エ', romaji: ['e'] },
            { char: 'オ', romaji: ['o'] }
        ],
        ka: [
            { char: 'カ', romaji: ['ka'] },
            { char: 'キ', romaji: ['ki'] },
            { char: 'ク', romaji: ['ku'] },
            { char: 'ケ', romaji: ['ke'] },
            { char: 'コ', romaji: ['ko'] }
        ],
        sa: [
            { char: 'サ', romaji: ['sa'] },
            { char: 'シ', romaji: ['shi', 'si'] },
            { char: 'ス', romaji: ['su'] },
            { char: 'セ', romaji: ['se'] },
            { char: 'ソ', romaji: ['so'] }
        ],
        ta: [
            { char: 'タ', romaji: ['ta'] },
            { char: 'チ', romaji: ['chi', 'ti'] },
            { char: 'ツ', romaji: ['tsu', 'tu'] },
            { char: 'テ', romaji: ['te'] },
            { char: 'ト', romaji: ['to'] }
        ],
        na: [
            { char: 'ナ', romaji: ['na'] },
            { char: 'ニ', romaji: ['ni'] },
            { char: 'ヌ', romaji: ['nu'] },
            { char: 'ネ', romaji: ['ne'] },
            { char: 'ノ', romaji: ['no'] }
        ],
        ha: [
            { char: 'ハ', romaji: ['ha'] },
            { char: 'ヒ', romaji: ['hi'] },
            { char: 'フ', romaji: ['fu', 'hu'] },
            { char: 'ヘ', romaji: ['he'] },
            { char: 'ホ', romaji: ['ho'] }
        ],
        ma: [
            { char: 'マ', romaji: ['ma'] },
            { char: 'ミ', romaji: ['mi'] },
            { char: 'ム', romaji: ['mu'] },
            { char: 'メ', romaji: ['me'] },
            { char: 'モ', romaji: ['mo'] }
        ],
        ya: [
            { char: 'ヤ', romaji: ['ya'] },
            { char: 'ユ', romaji: ['yu'] },
            { char: 'ヨ', romaji: ['yo'] }
        ],
        ra: [
            { char: 'ラ', romaji: ['ra'] },
            { char: 'リ', romaji: ['ri'] },
            { char: 'ル', romaji: ['ru'] },
            { char: 'レ', romaji: ['re'] },
            { char: 'ロ', romaji: ['ro'] }
        ],
        wa: [
            { char: 'ワ', romaji: ['wa'] },
            { char: 'ヲ', romaji: ['wo', 'o'] },
            { char: 'ン', romaji: ['n', 'nn'] }
        ],
        // Dakuon
        ga: [
            { char: 'ガ', romaji: ['ga'] },
            { char: 'ギ', romaji: ['gi'] },
            { char: 'グ', romaji: ['gu'] },
            { char: 'ゲ', romaji: ['ge'] },
            { char: 'ゴ', romaji: ['go'] }
        ],
        za: [
            { char: 'ザ', romaji: ['za'] },
            { char: 'ジ', romaji: ['ji', 'zi'] },
            { char: 'ズ', romaji: ['zu'] },
            { char: 'ゼ', romaji: ['ze'] },
            { char: 'ゾ', romaji: ['zo'] }
        ],
        da: [
            { char: 'ダ', romaji: ['da'] },
            { char: 'ヂ', romaji: ['ji', 'di'] },
            { char: 'ヅ', romaji: ['zu', 'du'] },
            { char: 'デ', romaji: ['de'] },
            { char: 'ド', romaji: ['do'] }
        ],
        ba: [
            { char: 'バ', romaji: ['ba'] },
            { char: 'ビ', romaji: ['bi'] },
            { char: 'ブ', romaji: ['bu'] },
            { char: 'ベ', romaji: ['be'] },
            { char: 'ボ', romaji: ['bo'] }
        ],
        // Handakuon
        pa: [
            { char: 'パ', romaji: ['pa'] },
            { char: 'ピ', romaji: ['pi'] },
            { char: 'プ', romaji: ['pu'] },
            { char: 'ペ', romaji: ['pe'] },
            { char: 'ポ', romaji: ['po'] }
        ],
        // Yōon
        kya: [
            { char: 'キャ', romaji: ['kya'] },
            { char: 'キュ', romaji: ['kyu'] },
            { char: 'キョ', romaji: ['kyo'] }
        ],
        sha: [
            { char: 'シャ', romaji: ['sha', 'sya'] },
            { char: 'シュ', romaji: ['shu', 'syu'] },
            { char: 'ショ', romaji: ['sho', 'syo'] }
        ],
        cha: [
            { char: 'チャ', romaji: ['cha', 'tya'] },
            { char: 'チュ', romaji: ['chu', 'tyu'] },
            { char: 'チョ', romaji: ['cho', 'tyo'] }
        ],
        nya: [
            { char: 'ニャ', romaji: ['nya'] },
            { char: 'ニュ', romaji: ['nyu'] },
            { char: 'ニョ', romaji: ['nyo'] }
        ],
        hya: [
            { char: 'ヒャ', romaji: ['hya'] },
            { char: 'ヒュ', romaji: ['hyu'] },
            { char: 'ヒョ', romaji: ['hyo'] }
        ],
        mya: [
            { char: 'ミャ', romaji: ['mya'] },
            { char: 'ミュ', romaji: ['myu'] },
            { char: 'ミョ', romaji: ['myo'] }
        ],
        rya: [
            { char: 'リャ', romaji: ['rya'] },
            { char: 'リュ', romaji: ['ryu'] },
            { char: 'リョ', romaji: ['ryo'] }
        ],
        gya: [
            { char: 'ギャ', romaji: ['gya'] },
            { char: 'ギュ', romaji: ['gyu'] },
            { char: 'ギョ', romaji: ['gyo'] }
        ],
        ja: [
            { char: 'ジャ', romaji: ['ja', 'zya'] },
            { char: 'ジュ', romaji: ['ju', 'zyu'] },
            { char: 'ジョ', romaji: ['jo', 'zyo'] }
        ],
        bya: [
            { char: 'ビャ', romaji: ['bya'] },
            { char: 'ビュ', romaji: ['byu'] },
            { char: 'ビョ', romaji: ['byo'] }
        ],
        pya: [
            { char: 'ピャ', romaji: ['pya'] },
            { char: 'ピュ', romaji: ['pyu'] },
            { char: 'ピョ', romaji: ['pyo'] }
        ]
    }
};