import { PartDef } from '../types';

export const PARTS_DATA: PartDef[] = [
  // ================================================================
  // DRAGON HEAD
  // ================================================================
  {
    id: 'head_dragon_0', type: 'head', species: 'dragon', rarity: 'common',
    stats: { atk: 15, hp: 5, spd: 3 }, emoji: '\u{1F432}',
    name: '\u30C9\u30E9\u30B4\u30F3\u306E\u5E7C\u982D',
    description: '\u307E\u3060\u89D2\u3082\u751F\u3048\u3066\u3044\u306A\u3044\u5E7C\u3044\u30C9\u30E9\u30B4\u30F3\u306E\u982D\u3002\u3057\u304B\u3057\u77B3\u306B\u306F\u708E\u304C\u5BBF\u308B\u3002',
    svgKey: 'head_dragon_1',
  },
  {
    id: 'head_dragon_1', type: 'head', species: 'dragon', rarity: 'uncommon',
    stats: { atk: 27, hp: 9, spd: 5 }, emoji: '\u{1F432}',
    name: '\u30C9\u30E9\u30B4\u30F3\u306E\u89D2\u982D',
    description: '\u5C0F\u3055\u306A\u89D2\u304C2\u672C\u751F\u3048\u305F\u30C9\u30E9\u30B4\u30F3\u306E\u982D\u3002\u706B\u306E\u606F\u3092\u5C11\u3057\u5410\u3051\u308B\u3002',
    svgKey: 'head_dragon_2',
  },
  {
    id: 'head_dragon_2', type: 'head', species: 'dragon', rarity: 'rare',
    stats: { atk: 45, hp: 15, spd: 8 }, emoji: '\u{1F409}',
    name: '\u30C9\u30E9\u30B4\u30F3\u306E\u70C8\u982D',
    description: '\u92ED\u3044\u89D2\u3068\u7259\u3092\u6301\u3064\u6210\u719F\u3057\u305F\u30C9\u30E9\u30B4\u30F3\u306E\u982D\u3002\u707C\u71B1\u306E\u30D6\u30EC\u30B9\u3092\u653E\u3064\u3002',
    svgKey: 'head_dragon_3',
  },
  {
    id: 'head_dragon_3', type: 'head', species: 'dragon', rarity: 'epic',
    stats: { atk: 75, hp: 25, spd: 13 }, emoji: '\u{1F409}',
    name: '\u30C9\u30E9\u30B4\u30F3\u306E\u8987\u982D',
    description: '\u9EC4\u91D1\u306E\u89D2\u51A0\u3092\u6234\u304F\u53E4\u7ADC\u306E\u982D\u3002\u305D\u306E\u54AE\u54EE\u306F\u5C71\u3092\u9707\u308F\u305B\u308B\u3002',
    svgKey: 'head_dragon_4',
  },
  {
    id: 'head_dragon_4', type: 'head', species: 'dragon', rarity: 'legendary',
    stats: { atk: 120, hp: 40, spd: 20 }, emoji: '\u{1F409}',
    name: '\u59CB\u7956\u7ADC\u30D0\u30CF\u30E0\u30FC\u30C8\u306E\u982D',
    description: '\u4E07\u7269\u3092\u7070\u71FC\u306B\u5E30\u3059\u59CB\u7956\u7ADC\u306E\u982D\u3002\u8996\u7DDA\u3060\u3051\u3067\u9244\u3092\u6EB6\u304B\u3059\u3002',
    svgKey: 'head_dragon_5',
  },

  // ================================================================
  // PHOENIX HEAD
  // ================================================================
  {
    id: 'head_phoenix_0', type: 'head', species: 'phoenix', rarity: 'common',
    stats: { atk: 12, hp: 3, spd: 8 }, emoji: '\u{1F426}',
    name: '\u30D5\u30A7\u30CB\u30C3\u30AF\u30B9\u306E\u96DB\u982D',
    description: '\u307E\u3060\u7FBD\u6BDB\u3082\u307E\u3070\u3089\u306A\u706B\u306E\u9CE5\u306E\u96DB\u3002\u5C0F\u3055\u306A\u304F\u3061\u3070\u3057\u304C\u5149\u308B\u3002',
    svgKey: 'head_phoenix_1',
  },
  {
    id: 'head_phoenix_1', type: 'head', species: 'phoenix', rarity: 'uncommon',
    stats: { atk: 22, hp: 5, spd: 14 }, emoji: '\u{1F985}',
    name: '\u30D5\u30A7\u30CB\u30C3\u30AF\u30B9\u306E\u708E\u982D',
    description: '\u982D\u9802\u306E\u7FBD\u304C\u71C3\u3048\u59CB\u3081\u305F\u82E5\u9CE5\u3002\u92ED\u3044\u76EE\u304C\u7372\u7269\u3092\u898B\u9003\u3055\u306A\u3044\u3002',
    svgKey: 'head_phoenix_2',
  },
  {
    id: 'head_phoenix_2', type: 'head', species: 'phoenix', rarity: 'rare',
    stats: { atk: 38, hp: 8, spd: 22 }, emoji: '\u{1F985}',
    name: '\u30D5\u30A7\u30CB\u30C3\u30AF\u30B9\u306E\u70C8\u5634',
    description: '\u708E\u3092\u7E8F\u3046\u304F\u3061\u3070\u3057\u3067\u6575\u3092\u8CAB\u304F\u3002\u7FFC\u51A0\u304C\u5A01\u53B3\u3092\u653E\u3064\u3002',
    svgKey: 'head_phoenix_3',
  },
  {
    id: 'head_phoenix_3', type: 'head', species: 'phoenix', rarity: 'epic',
    stats: { atk: 63, hp: 13, spd: 37 }, emoji: '\u{1F525}',
    name: '\u30D5\u30A7\u30CB\u30C3\u30AF\u30B9\u306E\u7130\u51A0',
    description: '\u4E0D\u6B7B\u9CE5\u306E\u708E\u51A0\u3002\u6B7B\u3093\u3067\u3082\u7070\u304B\u3089\u84C7\u308B\u518D\u751F\u306E\u529B\u3092\u79D8\u3081\u308B\u3002',
    svgKey: 'head_phoenix_4',
  },
  {
    id: 'head_phoenix_4', type: 'head', species: 'phoenix', rarity: 'legendary',
    stats: { atk: 100, hp: 20, spd: 60 }, emoji: '\u{1F525}',
    name: '\u6C38\u52AB\u9CE5\u30B9\u30B6\u30AF\u306E\u982D',
    description: '\u592A\u967D\u3059\u3089\u713C\u304D\u5C3D\u304F\u3059\u6C38\u52AB\u306E\u706B\u9CE5\u3002\u7FBD\u3070\u305F\u304D\u304C\u4E16\u754C\u3092\u7167\u3089\u3059\u3002',
    svgKey: 'head_phoenix_5',
  },

  // ================================================================
  // KRAKEN HEAD
  // ================================================================
  {
    id: 'head_kraken_0', type: 'head', species: 'kraken', rarity: 'common',
    stats: { atk: 10, hp: 10, spd: 3 }, emoji: '\u{1F419}',
    name: '\u30AF\u30E9\u30FC\u30B1\u30F3\u306E\u5E7C\u982D',
    description: '\u6DF1\u6D77\u306B\u68F2\u3080\u5C0F\u3055\u306A\u30BF\u30B3\u306E\u982D\u3002\u58A8\u3092\u5410\u3044\u3066\u9003\u3052\u308B\u3053\u3068\u3057\u304B\u3067\u304D\u306A\u3044\u3002',
    svgKey: 'head_kraken_1',
  },
  {
    id: 'head_kraken_1', type: 'head', species: 'kraken', rarity: 'uncommon',
    stats: { atk: 18, hp: 18, spd: 5 }, emoji: '\u{1F419}',
    name: '\u30AF\u30E9\u30FC\u30B1\u30F3\u306E\u5438\u982D',
    description: '\u5438\u76E4\u304C\u767A\u9054\u3057\u305F\u6DF1\u6D77\u7363\u306E\u982D\u3002\u7372\u7269\u3092\u9003\u3055\u306A\u3044\u3002',
    svgKey: 'head_kraken_2',
  },
  {
    id: 'head_kraken_2', type: 'head', species: 'kraken', rarity: 'rare',
    stats: { atk: 30, hp: 30, spd: 8 }, emoji: '\u{1F991}',
    name: '\u30AF\u30E9\u30FC\u30B1\u30F3\u306E\u88C2\u984E',
    description: '\u5DE8\u5927\u306A\u304F\u3061\u3070\u3057\u3067\u8239\u306E\u7ADC\u9AA8\u3059\u3089\u564E\u307F\u7815\u304F\u3002\u6DF1\u6DF5\u306E\u6050\u6016\u3002',
    svgKey: 'head_kraken_3',
  },
  {
    id: 'head_kraken_3', type: 'head', species: 'kraken', rarity: 'epic',
    stats: { atk: 50, hp: 50, spd: 13 }, emoji: '\u{1F991}',
    name: '\u30AF\u30E9\u30FC\u30B1\u30F3\u306E\u6DF1\u6DF5\u982D',
    description: '\u6D77\u6E9D\u306E\u5E95\u3067\u7720\u308B\u53E4\u4EE3\u6D77\u7363\u306E\u982D\u3002\u305D\u306E\u76EE\u306F\u95C7\u3092\u898B\u901A\u3059\u3002',
    svgKey: 'head_kraken_4',
  },
  {
    id: 'head_kraken_4', type: 'head', species: 'kraken', rarity: 'legendary',
    stats: { atk: 80, hp: 80, spd: 20 }, emoji: '\u{1F991}',
    name: '\u5927\u6D77\u9B54\u30EA\u30F4\u30A1\u30A4\u30A2\u30B5\u30F3\u306E\u982D',
    description: '\u6D77\u3092\u652F\u914D\u3059\u308B\u59CB\u7956\u6D77\u7363\u3002\u6D25\u6CE2\u3092\u8D77\u3053\u3057\u5927\u9678\u3092\u6C88\u3081\u308B\u3002',
    svgKey: 'head_kraken_5',
  },

  // ================================================================
  // DRAGON BODY
  // ================================================================
  {
    id: 'body_dragon_0', type: 'body', species: 'dragon', rarity: 'common',
    stats: { atk: 5, hp: 20, spd: 3 }, emoji: '\u{1F7E4}',
    name: '\u30C9\u30E9\u30B4\u30F3\u306E\u5E7C\u80F4',
    description: '\u9C57\u304C\u307E\u3070\u3089\u306A\u5E7C\u7ADC\u306E\u80F4\u4F53\u3002\u67D4\u3089\u304B\u3044\u304C\u6E29\u304B\u3044\u3002',
    svgKey: 'body_dragon_1',
  },
  {
    id: 'body_dragon_1', type: 'body', species: 'dragon', rarity: 'uncommon',
    stats: { atk: 9, hp: 36, spd: 5 }, emoji: '\u{1F536}',
    name: '\u30C9\u30E9\u30B4\u30F3\u306E\u9C57\u80F4',
    description: '\u786C\u3044\u9C57\u306B\u8986\u308F\u308C\u305F\u82E5\u7ADC\u306E\u80F4\u3002\u5263\u3067\u306F\u50B7\u3064\u304B\u306A\u3044\u3002',
    svgKey: 'body_dragon_2',
  },
  {
    id: 'body_dragon_2', type: 'body', species: 'dragon', rarity: 'rare',
    stats: { atk: 15, hp: 60, spd: 8 }, emoji: '\u{1F536}',
    name: '\u30C9\u30E9\u30B4\u30F3\u306E\u92FC\u80F4',
    description: '\u6EB6\u5CA9\u3067\u935B\u3048\u3089\u308C\u305F\u92FC\u9C57\u306E\u80F4\u3002\u708E\u3092\u6D74\u3073\u308B\u307B\u3069\u786C\u304F\u306A\u308B\u3002',
    svgKey: 'body_dragon_3',
  },
  {
    id: 'body_dragon_3', type: 'body', species: 'dragon', rarity: 'epic',
    stats: { atk: 25, hp: 100, spd: 13 }, emoji: '\u{1F7E0}',
    name: '\u30C9\u30E9\u30B4\u30F3\u306E\u6EB6\u5CA9\u80F4',
    description: '\u4F53\u5185\u306B\u30DE\u30B0\u30DE\u304C\u6D41\u308C\u308B\u53E4\u7ADC\u306E\u80F4\u3002\u89E6\u308C\u308B\u3060\u3051\u3067\u713C\u3051\u308B\u3002',
    svgKey: 'body_dragon_4',
  },
  {
    id: 'body_dragon_4', type: 'body', species: 'dragon', rarity: 'legendary',
    stats: { atk: 40, hp: 160, spd: 20 }, emoji: '\u{1F7E0}',
    name: '\u59CB\u7956\u7ADC\u30D0\u30CF\u30E0\u30FC\u30C8\u306E\u80F4',
    description: '\u9695\u77F3\u306E\u885D\u7A81\u306B\u3082\u8010\u3048\u308B\u4E0D\u6EC5\u306E\u7ADC\u9C57\u3002\u661F\u306E\u6838\u3068\u540C\u3058\u5BC6\u5EA6\u3092\u6301\u3064\u3002',
    svgKey: 'body_dragon_5',
  },

  // ================================================================
  // PHOENIX BODY
  // ================================================================
  {
    id: 'body_phoenix_0', type: 'body', species: 'phoenix', rarity: 'common',
    stats: { atk: 3, hp: 15, spd: 8 }, emoji: '\u{1FAB6}',
    name: '\u30D5\u30A7\u30CB\u30C3\u30AF\u30B9\u306E\u96DB\u80F4',
    description: '\u6E29\u304B\u306A\u7FBD\u6BDB\u306B\u5305\u307E\u308C\u305F\u96DB\u306E\u80F4\u3002\u8EFD\u304F\u3066\u98A8\u306B\u4E57\u308A\u3084\u3059\u3044\u3002',
    svgKey: 'body_phoenix_1',
  },
  {
    id: 'body_phoenix_1', type: 'body', species: 'phoenix', rarity: 'uncommon',
    stats: { atk: 5, hp: 27, spd: 14 }, emoji: '\u{1FAB6}',
    name: '\u30D5\u30A7\u30CB\u30C3\u30AF\u30B9\u306E\u7FBD\u80F4',
    description: '\u708E\u306E\u7FBD\u6BDB\u304C\u751F\u3048\u63C3\u3063\u305F\u82E5\u9CE5\u306E\u80F4\u3002\u89E6\u308C\u308B\u3068\u6E29\u304B\u3044\u3002',
    svgKey: 'body_phoenix_2',
  },
  {
    id: 'body_phoenix_2', type: 'body', species: 'phoenix', rarity: 'rare',
    stats: { atk: 8, hp: 45, spd: 22 }, emoji: '\u{1F525}',
    name: '\u30D5\u30A7\u30CB\u30C3\u30AF\u30B9\u306E\u708E\u7FFC\u80F4',
    description: '\u80F4\u304B\u3089\u76F4\u63A5\u708E\u306E\u7FFC\u304C\u751F\u3048\u308B\u3002\u88AB\u5F3E\u3057\u3066\u3082\u7070\u304B\u3089\u518D\u751F\u3059\u308B\u3002',
    svgKey: 'body_phoenix_3',
  },
  {
    id: 'body_phoenix_3', type: 'body', species: 'phoenix', rarity: 'epic',
    stats: { atk: 13, hp: 75, spd: 37 }, emoji: '\u{1F525}',
    name: '\u30D5\u30A7\u30CB\u30C3\u30AF\u30B9\u306E\u518D\u751F\u80F4',
    description: '\u50B7\u3064\u304F\u305F\u3073\u306B\u708E\u3067\u518D\u751F\u3059\u308B\u4E0D\u6B7B\u9CE5\u306E\u80F4\u3002\u5012\u3057\u3066\u3082\u307E\u305F\u7ACB\u3061\u4E0A\u304C\u308B\u3002',
    svgKey: 'body_phoenix_4',
  },
  {
    id: 'body_phoenix_4', type: 'body', species: 'phoenix', rarity: 'legendary',
    stats: { atk: 20, hp: 120, spd: 60 }, emoji: '\u{1F525}',
    name: '\u6C38\u52AB\u9CE5\u30B9\u30B6\u30AF\u306E\u80F4',
    description: '\u592A\u967D\u306E\u708E\u3092\u4F53\u5185\u306B\u5BBF\u3059\u3002\u7834\u58CA\u3055\u308C\u3066\u3082\u7121\u9650\u306B\u84C7\u308B\u6C38\u52AB\u306E\u5668\u3002',
    svgKey: 'body_phoenix_5',
  },

  // ================================================================
  // KRAKEN BODY
  // ================================================================
  {
    id: 'body_kraken_0', type: 'body', species: 'kraken', rarity: 'common',
    stats: { atk: 3, hp: 25, spd: 2 }, emoji: '\u{1FAE7}',
    name: '\u30AF\u30E9\u30FC\u30B1\u30F3\u306E\u5E7C\u80F4',
    description: '\u3077\u306B\u3077\u306B\u3057\u305F\u6DF1\u6D77\u751F\u7269\u306E\u80F4\u3002\u9A5A\u304F\u307B\u3069\u5F3E\u529B\u304C\u3042\u308B\u3002',
    svgKey: 'body_kraken_1',
  },
  {
    id: 'body_kraken_1', type: 'body', species: 'kraken', rarity: 'uncommon',
    stats: { atk: 5, hp: 45, spd: 4 }, emoji: '\u{1FAE7}',
    name: '\u30AF\u30E9\u30FC\u30B1\u30F3\u306E\u58A8\u80F4',
    description: '\u58A8\u888B\u304C\u767A\u9054\u3057\u305F\u6D77\u7363\u306E\u80F4\u3002\u653B\u6483\u3055\u308C\u308B\u3068\u58A8\u3092\u566C\u5C04\u3059\u308B\u3002',
    svgKey: 'body_kraken_2',
  },
  {
    id: 'body_kraken_2', type: 'body', species: 'kraken', rarity: 'rare',
    stats: { atk: 8, hp: 75, spd: 6 }, emoji: '\u{1F30A}',
    name: '\u30AF\u30E9\u30FC\u30B1\u30F3\u306E\u93A7\u80F4',
    description: '\u6DF1\u6D77\u306E\u6C34\u5727\u3067\u935B\u3048\u3089\u308C\u305F\u5916\u6BBB\u3002\u9BE8\u306E\u4F53\u5F53\u305F\u308A\u306B\u3082\u8010\u3048\u308B\u3002',
    svgKey: 'body_kraken_3',
  },
  {
    id: 'body_kraken_3', type: 'body', species: 'kraken', rarity: 'epic',
    stats: { atk: 13, hp: 125, spd: 10 }, emoji: '\u{1F30A}',
    name: '\u30AF\u30E9\u30FC\u30B1\u30F3\u306E\u6E26\u80F4',
    description: '\u4F53\u306E\u5468\u56F2\u306B\u6E26\u6F6E\u3092\u7E8F\u3046\u53E4\u4EE3\u6D77\u7363\u306E\u80F4\u3002\u8FD1\u3065\u304F\u8005\u3092\u98F2\u307F\u8FBC\u3080\u3002',
    svgKey: 'body_kraken_4',
  },
  {
    id: 'body_kraken_4', type: 'body', species: 'kraken', rarity: 'legendary',
    stats: { atk: 20, hp: 200, spd: 15 }, emoji: '\u{1F30A}',
    name: '\u5927\u6D77\u9B54\u30EA\u30F4\u30A1\u30A4\u30A2\u30B5\u30F3\u306E\u80F4',
    description: '\u6D77\u305D\u306E\u3082\u306E\u304C\u93A7\u3002\u30DE\u30EA\u30A2\u30CA\u6D77\u6E9D\u306E\u6C34\u5727\u3059\u3089\u611F\u3058\u306A\u3044\u7D76\u5BFE\u306E\u9632\u5FA1\u3002',
    svgKey: 'body_kraken_5',
  },

  // ================================================================
  // DRAGON LEGS
  // ================================================================
  {
    id: 'legs_dragon_0', type: 'legs', species: 'dragon', rarity: 'common',
    stats: { atk: 5, hp: 5, spd: 12 }, emoji: '\u{1F98E}',
    name: '\u30C9\u30E9\u30B4\u30F3\u306E\u5E7C\u811A',
    description: '\u5C0F\u3055\u306A\u722A\u304C\u751F\u3048\u305F\u5E7C\u7ADC\u306E\u811A\u3002\u8D70\u308B\u3068\u307A\u305F\u307A\u305F\u97F3\u304C\u3059\u308B\u3002',
    svgKey: 'legs_dragon_1',
  },
  {
    id: 'legs_dragon_1', type: 'legs', species: 'dragon', rarity: 'uncommon',
    stats: { atk: 9, hp: 9, spd: 22 }, emoji: '\u{1F98E}',
    name: '\u30C9\u30E9\u30B4\u30F3\u306E\u9264\u811A',
    description: '\u92ED\u3044\u9264\u722A\u306E\u82E5\u7ADC\u306E\u811A\u3002\u5CA9\u58C1\u3092\u99C6\u3051\u4E0A\u304C\u308B\u3002',
    svgKey: 'legs_dragon_2',
  },
  {
    id: 'legs_dragon_2', type: 'legs', species: 'dragon', rarity: 'rare',
    stats: { atk: 15, hp: 15, spd: 36 }, emoji: '\u{1F43E}',
    name: '\u30C9\u30E9\u30B4\u30F3\u306E\u70C8\u811A',
    description: '\u5730\u9762\u3092\u8E74\u308C\u3070\u5730\u5272\u308C\u304C\u8D77\u304D\u308B\u3002\u722A\u306E\u4E00\u6483\u306F\u5CA9\u3092\u7815\u304F\u3002',
    svgKey: 'legs_dragon_3',
  },
  {
    id: 'legs_dragon_3', type: 'legs', species: 'dragon', rarity: 'epic',
    stats: { atk: 25, hp: 25, spd: 60 }, emoji: '\u{1F43E}',
    name: '\u30C9\u30E9\u30B4\u30F3\u306E\u96F7\u811A',
    description: '\u7A32\u59BB\u306E\u901F\u3055\u3067\u5927\u5730\u3092\u8E0F\u307F\u3057\u3081\u308B\u53E4\u7ADC\u306E\u811A\u3002\u97F3\u901F\u3092\u8D85\u3048\u308B\u3002',
    svgKey: 'legs_dragon_4',
  },
  {
    id: 'legs_dragon_4', type: 'legs', species: 'dragon', rarity: 'legendary',
    stats: { atk: 40, hp: 40, spd: 96 }, emoji: '\u{1F43E}',
    name: '\u59CB\u7956\u7ADC\u30D0\u30CF\u30E0\u30FC\u30C8\u306E\u811A',
    description: '\u5927\u5730\u3092\u652F\u3048\u308B\u56DB\u672C\u306E\u67F1\u3002\u4E00\u6B69\u8E0F\u3081\u3070\u5C71\u304C\u5D29\u308C\u3001\u8C37\u304C\u751F\u307E\u308C\u308B\u3002',
    svgKey: 'legs_dragon_5',
  },

  // ================================================================
  // PHOENIX LEGS
  // ================================================================
  {
    id: 'legs_phoenix_0', type: 'legs', species: 'phoenix', rarity: 'common',
    stats: { atk: 3, hp: 3, spd: 18 }, emoji: '\u{1F424}',
    name: '\u30D5\u30A7\u30CB\u30C3\u30AF\u30B9\u306E\u96DB\u811A',
    description: '\u7D30\u304F\u3066\u9812\u308A\u306A\u3044\u96DB\u306E\u811A\u3002\u3057\u304B\u3057\u9A5A\u304F\u307B\u3069\u7D20\u65E9\u3044\u3002',
    svgKey: 'legs_phoenix_1',
  },
  {
    id: 'legs_phoenix_1', type: 'legs', species: 'phoenix', rarity: 'uncommon',
    stats: { atk: 5, hp: 5, spd: 32 }, emoji: '\u{1F9B6}',
    name: '\u30D5\u30A7\u30CB\u30C3\u30AF\u30B9\u306E\u708E\u811A',
    description: '\u708E\u3092\u7E8F\u3046\u9CE5\u811A\u3002\u8D70\u3063\u305F\u8DE1\u306B\u706B\u306E\u9053\u304C\u6B8B\u308B\u3002',
    svgKey: 'legs_phoenix_2',
  },
  {
    id: 'legs_phoenix_2', type: 'legs', species: 'phoenix', rarity: 'rare',
    stats: { atk: 8, hp: 8, spd: 52 }, emoji: '\u{1F9B6}',
    name: '\u30D5\u30A7\u30CB\u30C3\u30AF\u30B9\u306E\u75BE\u811A',
    description: '\u76EE\u306B\u3082\u6B62\u307E\u3089\u306C\u901F\u3055\u306E\u9CE5\u811A\u3002\u98A8\u3059\u3089\u8FFD\u3044\u3064\u3051\u306A\u3044\u3002',
    svgKey: 'legs_phoenix_3',
  },
  {
    id: 'legs_phoenix_3', type: 'legs', species: 'phoenix', rarity: 'epic',
    stats: { atk: 13, hp: 13, spd: 87 }, emoji: '\u{1F4A8}',
    name: '\u30D5\u30A7\u30CB\u30C3\u30AF\u30B9\u306E\u5239\u90A3\u811A',
    description: '\u4E00\u77AC\u3067\u4E16\u754C\u3092\u4E00\u5468\u3059\u308B\u4E0D\u6B7B\u9CE5\u306E\u811A\u3002\u6B8B\u50CF\u3059\u3089\u898B\u3048\u306A\u3044\u3002',
    svgKey: 'legs_phoenix_4',
  },
  {
    id: 'legs_phoenix_4', type: 'legs', species: 'phoenix', rarity: 'legendary',
    stats: { atk: 20, hp: 20, spd: 140 }, emoji: '\u{1F4A8}',
    name: '\u6C38\u52AB\u9CE5\u30B9\u30B6\u30AF\u306E\u811A',
    description: '\u6642\u3092\u8D85\u3048\u308B\u901F\u3055\u3002\u904E\u53BB\u3082\u672A\u6765\u3082\u30B9\u30B6\u30AF\u306E\u811A\u306E\u524D\u3067\u306F\u9759\u6B62\u3059\u308B\u3002',
    svgKey: 'legs_phoenix_5',
  },

  // ================================================================
  // KRAKEN LEGS
  // ================================================================
  {
    id: 'legs_kraken_0', type: 'legs', species: 'kraken', rarity: 'common',
    stats: { atk: 3, hp: 10, spd: 10 }, emoji: '\u{1F991}',
    name: '\u30AF\u30E9\u30FC\u30B1\u30F3\u306E\u89E6\u811A',
    description: '\u306B\u3085\u308B\u306B\u3085\u308B\u52D5\u304F\u89E6\u624B\u306E\u811A\u3002\u6ED1\u308A\u3084\u3059\u3044\u5730\u5F62\u3082\u5E73\u6C17\u3002',
    svgKey: 'legs_kraken_1',
  },
  {
    id: 'legs_kraken_1', type: 'legs', species: 'kraken', rarity: 'uncommon',
    stats: { atk: 5, hp: 18, spd: 18 }, emoji: '\u{1F991}',
    name: '\u30AF\u30E9\u30FC\u30B1\u30F3\u306E\u5438\u811A',
    description: '\u5438\u76E4\u3060\u3089\u3051\u306E\u592A\u3044\u89E6\u624B\u811A\u3002\u3069\u3093\u306A\u58C1\u3082\u5929\u4E95\u3082\u6B69\u3051\u308B\u3002',
    svgKey: 'legs_kraken_2',
  },
  {
    id: 'legs_kraken_2', type: 'legs', species: 'kraken', rarity: 'rare',
    stats: { atk: 8, hp: 30, spd: 30 }, emoji: '\u{1F419}',
    name: '\u30AF\u30E9\u30FC\u30B1\u30F3\u306E\u5DFB\u811A',
    description: '\u8239\u306E\u9328\u3092\u5F15\u304D\u3061\u304E\u308B\u5DFB\u304D\u3064\u304D\u89E6\u624B\u3002\u7DE0\u3081\u4ED8\u3051\u306F\u9244\u306E\u3088\u3046\u306B\u786C\u3044\u3002',
    svgKey: 'legs_kraken_3',
  },
  {
    id: 'legs_kraken_3', type: 'legs', species: 'kraken', rarity: 'epic',
    stats: { atk: 13, hp: 50, spd: 50 }, emoji: '\u{1F419}',
    name: '\u30AF\u30E9\u30FC\u30B1\u30F3\u306E\u5927\u89E6\u811A',
    description: '\u6D77\u5E95\u3092\u9019\u3044\u56DE\u308B\u5DE8\u5927\u89E6\u624B\u3002\u5CF6\u3054\u3068\u5F15\u304D\u305A\u308A\u8FBC\u3080\u529B\u304C\u3042\u308B\u3002',
    svgKey: 'legs_kraken_4',
  },
  {
    id: 'legs_kraken_4', type: 'legs', species: 'kraken', rarity: 'legendary',
    stats: { atk: 20, hp: 80, spd: 80 }, emoji: '\u{1F419}',
    name: '\u5927\u6D77\u9B54\u30EA\u30F4\u30A1\u30A4\u30A2\u30B5\u30F3\u306E\u89E6\u811A',
    description: '\u5927\u9678\u3092\u7E4B\u3050\u7121\u9650\u306E\u89E6\u624B\u3002\u6D77\u306E\u5E95\u304B\u3089\u4E16\u754C\u4E2D\u3069\u3053\u3078\u3067\u3082\u4F38\u3073\u308B\u3002',
    svgKey: 'legs_kraken_5',
  },
];

export function getPartDef(defId: string): PartDef | undefined {
  return PARTS_DATA.find(p => p.id === defId);
}

export function getPartsByType(type: string): PartDef[] {
  return PARTS_DATA.filter(p => p.type === type);
}

export function getPartsBySpecies(species: string): PartDef[] {
  return PARTS_DATA.filter(p => p.species === species);
}
