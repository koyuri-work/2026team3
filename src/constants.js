import puzzleIcon from './assets/self.png';
import multiIcon from './assets/each.png';
import historyIcon from './assets/history.png';
import friendIcon from './assets/friends.png';
import leftImg from './assets/left.png';
import sLeftImg from './assets/s-left.png';
import midImg from './assets/mid.png';
import sRightImg from './assets/s-right.png';
import rightImg from './assets/right.png';
import homeImg from './assets/home.png';
import home2Img from './assets/home2.png';
import hosizoraImg from './assets/hosizora.png';
import yoakemaeImg from './assets/yoakemae.png';
import akegataImg from './assets/akegata.png';
import soutyouImg from './assets/soutyou.png';
import gozentyuuImg from './assets/gozentyuu.png';
import mahiruImg from './assets/mahiru.png';
import hakutyuuImg from './assets/hakutyuu.png';
import hirusagariImg from './assets/hirusagari.png';
import yugataImg from './assets/yuugata.png';
import higureImg from './assets/higure.png';
import yohukeImg from './assets/yohuke.png';
import mayonakaImg from './assets/mayonaka.png';
import sinyaImg from './assets/sinya.png';

export const IMAGES = {
  puzzleIcon, multiIcon, historyIcon, friendIcon,
  leftImg, sLeftImg, midImg, sRightImg, rightImg,
  homeImg, home2Img, hosizoraImg,
  yoakemaeImg, akegataImg, soutyouImg, gozentyuuImg,
  mahiruImg, hakutyuuImg, hirusagariImg, yugataImg,
  higureImg, yohukeImg, mayonakaImg, sinyaImg
};

export const KEY_MAPPING = {
  reimei: 'yoakemae', shinonome: 'akegata', asanagi: 'soutyou', socho: 'soutyou',
  choko: 'gozentyuu', hiutsuri: 'mahiru', hakuchu: 'hakutyuu', hakubo: 'hirusagari',
  gorei: 'yugata', tasogare: 'higure', yunagi: 'yohuke', yofuke: 'yohuke',
  yoiyami: 'mayonaka', ushimitsu: 'sinya', shinya: 'sinya'
};

export const TYPE_IMAGES = {
  yoakemae: yoakemaeImg, akegata: akegataImg, soutyou: soutyouImg, gozentyuu: gozentyuuImg,
  mahiru: mahiruImg, hakutyuu: hakutyuuImg, hirusagari: hirusagariImg, yugata: yugataImg,
  higure: higureImg, yohuke: yohukeImg, mayonaka: mayonakaImg, sinya: sinyaImg,
};

export const TYPE_DISPLAY_NAMES = {
  mayonaka: '真夜中タイプ', sinya: '深夜タイプ', yoakemae: '夜明け前タイプ', akegata: '明け方タイプ',
  soutyou: '早朝タイプ', gozentyuu: '午前中タイプ', mahiru: '真昼タイプ', hakutyuu: '白昼タイプ',
  hirusagari: '昼下がりタイプ', yugata: '夕方タイプ', higure: '日暮れタイプ', yohuke: '夜更けタイプ',
};

export const TYPE_HOURS = {
  yoakemae: 4, akegata: 6, soutyou: 8, gozentyuu: 10, mahiru: 12, hakutyuu: 14,
  hirusagari: 16, yugata: 18, higure: 20, yohuke: 22, mayonaka: 0, sinya: 2,
};