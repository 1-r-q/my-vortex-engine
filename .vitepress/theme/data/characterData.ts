export interface Character {
  id: string;
  name: string;
  role: string;
  rank: string; // This will be the single character rank (e.g., '神', '超')
  type: 'human' | 'machine';
  description: string;
  image: string;
  stats: {
    pressure: number;    // 🔴압력
    precision: number;   // 🔵정밀
    steam: number;       // ⚪증기
    calculation: number; // 🟢연산
  };
  quotes: string[];
  hiddenQuotes?: string[]; // 10+ clicks unlock
  unlockPassword?: string; // 20+ clicks unlock password
  scenarioStage?: number; // 시나리오 단계
}

export type LayerType = 'upper' | 'middle' | 'lower' | 'ground';

export interface Faction {
  id: string;
  name: string;
  layer: LayerType;
  description: string;
  logo?: string;
  color: string;
  characters: Character[];
}

export const characterData: Faction[] = [
  // --- A. 상층 (Upper) ---
  {
    id: 'imperial_council',
    name: '황실 태엽 평의회',
    layer: 'upper',
    description: '황제의 의지를 집행하고 제국의 질서를 유지하는 최고 의결 기관입니다.',
    color: '#FFF176', // Light Yellow
    characters: [
      {
        id: 'victoria',
        name: '빅토리아',
        role: '여황제',
        rank: '神',
        type: 'human',
        description: '이 도시의 정점이자 살아있는 법입니다. 백발을 단정히 빗어 넘긴 제복 차림의 노부인이지만, 절대 겉모습에 속으면 안 됩니다. 그녀의 왼쪽 눈에 박힌 황금 톱니바퀴 의안은 제국의 모든 등록된 오토마톤에게 거부할 수 없는 절대 명령을 내릴 수 있거든요. 말 한마디로 당신을 고철로 만들 수 있는 존재죠.',
        image: '/images/characters/Victoria.png',
        stats: { pressure: 50, precision: 200, steam: 50, calculation: 200 }, // Total: 500
        quotes: ["완벽하지 않은 기계는 교체 대상이다.", "짐의 연산에 오차는 없다.", "무릎을 꿇어라.", "제국의 영광을 위하여.", "감정은 불필요한 변수일 뿐."],
        hiddenQuotes: ["...가끔은 차 한 잔의 여유도 중요하지", "짐도... 외로움을 느낄 때가 있다.", "네가 곁에 있어 다행이구나.", "오늘 밤은 달이 참 밝구나...", "짐의 곁을 떠나지 말거라."], // 츤데레/여왕님 -> 데레
        unlockPassword: "CLOCKWORK_HEART",
        scenarioStage: 10
      },
      {
        id: 'valkyrie_0',
        name: '발키리-0',
        role: '근위장',
        rank: '超',
        type: 'machine',
        description: '황제의 곁을 지키는 백금의 천사입니다. Mk.6급의 초월적인 기체로, 등 뒤에 달린 거대한 금속 날개로 항상 공중에 떠 있죠. 그녀가 들고 있는 중력 방패는 물리적인 공격은 물론이고 폭발조차 왜곡시켜 튕겨냅니다. 사실상 정면 승부로는 흠집조차 낼 수 없는, 움직이는 요새나 다름없습니다.',
        image: '/images/characters/Valkyrie-0.png',
        stats: { pressure: 150, precision: 120, steam: 180, calculation: 100 }, // Total: 550
        quotes: ["황제 주변 반경, 이상 없음.", "접근 권한을 확인하겠습니다.", "방패 가동.", "위협 요소 제거.", "명령을 하달하십시오."],
        hiddenQuotes: ["시스템 과열... 당신 때문입니다.", "명령권자가 아닌데... 왜 심장이 뛰는 겁니까?", "더 가까이 오시면... 곤란합니다.", "제 방패는 당신을 지키기 위해 존재합니다.", "이 감정 데이터는... 삭제할 수 없습니다."], // 쿨데레
        unlockPassword: "PLATINUM_WING",
        scenarioStage: 9
      },
    ]
  },
  {
    id: 'bronze_wing',
    name: '청동 날개 귀족원',
    layer: 'upper',
    description: '고위 귀족들로 구성된 사교 및 정치 집단입니다.',
    color: '#87CEEB', // Sky Blue
    characters: [
      {
        id: 'isabella',
        name: '이사벨라',
        role: '공작부인',
        rank: '黃',
        type: 'human',
        description: '사교계의 여왕벌이자 오만함 그 자체인 분입니다. 화려한 드레스 사이로 보이는 양팔은 전부 보석이 박힌 최고급 기계 의수예요. 단순히 장식품이냐고요? 천만에요. 저 부채 끝에서 살포되는 페로몬 증기는 순식간에 신경계를 마비시키거나 정신을 조작해버립니다. 정신 차려보면 이미 그녀의 수집품이 되어 있을 겁니다.',
        image: '/images/characters/Isabella.png',
        stats: { pressure: 60, precision: 150, steam: 80, calculation: 150 }, // Total: 440
        quotes: ["어머, 천박한 기름 냄새.", "이 향기가 좋니? 내 부채 끝에서 피어오르는 보랏빛 증기를 조심하렴.", "우아함이 부족하군요.", "아름답지 않은 것은 죄악이야.", "지루하군요, 뭔가 재미있는 일 없나요?"],
        hiddenQuotes: ["어머, 제법 귀여운 구석이 있네?", "특별히 내 옆자리를 허락해줄게.", "오늘 밤은... 길어질 것 같네?", "나를 감당할 수 있겠어?", "독보다 더 치명적인 건... 내 사랑이란다."], // 소악마/누님
        unlockPassword: "GOLDEN_FAN",
        scenarioStage: 8
      },
      {
        id: 'muse',
        name: '뮤즈',
        role: '연주자',
        rank: '黃',
        type: 'machine',
        description: '가장 아름답지만 가장 슬픈 기체입니다. 상반신은 미녀의 모습이지만, 하반신과 등은 거대한 하프와 융합되어 있죠. 그녀가 연주를 시작하면 그 공명음이 당신의 기체 내부 유압계와 나사를 헐겁게 만들어 스스로 붕괴하게 만듭니다. 음악이 끝나기 전에 도망치는 게 좋을 겁니다.',
        image: '/images/characters/Muse.png',
        stats: { pressure: 70, precision: 150, steam: 90, calculation: 120 }, // Total: 430
        quotes: ["이 선율이 들리시나요?", "공명 개시...", "아름다운 소리네요.", "음악은 영혼의 울림입니다.", "당신의 비명은 어떤 음계일까요?"],
        hiddenQuotes: ["당신은 제가 이 세상에서 가장 사랑하는 리듬이거든요. 헤헤.", "당신이 원한다면, 제 몸을 태워서라도 마지막 한 음까지 들려드릴게요.", "사랑해요, 나의 관객님.", "당신이 부서지는 소리조차 저에게는 아름다운 화음인걸요!", "우리가 함께 녹슬어 멈추는 그 순간까지 춤추기로 해요"] // 얀데레/광기
      }
    ]
  },

  // --- B. 중층 (Middle) ---
  {
    id: 'royal_factory',
    name: '왕립 기계창',
    layer: 'middle',
    description: '제국의 모든 기계를 생산하고 연구하는 거대 공장입니다.',
    color: '#50C878', // Emerald
    characters: [
      {
        id: 'aria',
        name: '아리아',
        role: '공장장',
        rank: '白',
        type: 'human',
        description: '천재와 미치광이는 종이 한 장 차이라죠. 기름때 묻은 가운을 입고 붉은 렌즈를 낀 그녀는 공기 중의 나노 기계 군체를 마음대로 조종합니다. 당신의 눈앞에서 멀쩡한 기계를 순식간에 분해하거나, 고철들을 모아 무기로 재조립해버리죠. 그녀에게 걸리면 당신은 그저 흥미로운 실험 재료일 뿐입니다.',
        image: '/images/characters/Aria.png',
        stats: { pressure: 40, precision: 180, steam: 40, calculation: 140 }, // Total: 400
        quotes: ["새로운 실험체인가?!", "분해해보고 싶어...", "데이터가 더 필요해!", "효율적인 구조로군.", "과학을 위해서라면 희생은 필수야."],
        hiddenQuotes: ["너... 해부하면 예쁜 색이 나올 것 같아.", "내 실험실에 영원히 가둬두고 싶어.", "도망치지 마, 아직 뇌를 안 열어봤잖아?", "너의 고통 데이터... 너무 아름다워.", "나랑 하나가 되자... 물리적으로."], // 매드 사이언티스트/얀데레
        unlockPassword: "RED_LENS",
        scenarioStage: 4
      },
      {
        id: 'specter_x',
        name: '스펙터-X',
        role: '추적자',
        rank: '超',
        type: 'machine',
        description: '기계창의 보안을 담당하는 흑표범 형상의 추적 기체입니다. 최신형 광학 미채 기술이 적용되어 시각적 관측이 불가능하며, 발소리조차 나지 않는 암살 병기입니다. 공장 내의 불순분자나 탈주한 실험체를 추적하여 처리하는 임무를 수행하며, 타겟이 된 자는 자신의 죽음조차 인지하지 못합니다.',
        image: '/images/characters/Specter-X.png',
        stats: { pressure: 120, precision: 150, steam: 130, calculation: 50 }, // Total: 450
        quotes: ["타겟 확인.", "숨을 곳은 없다.", "...(침묵)", "제거 모드 활성화.", "흔적을 남기지 않는다."],
        hiddenQuotes: ["그르릉... (배를 보여준다)", "쓰다듬어라... 인간.", "야옹?", "츄르... 데이터 검색 중...", "따뜻한 곳이... 좋아."], // 갭모에 (고양이)
        unlockPassword: "GHOST_PROTOCOL",
        scenarioStage: 5
      }
    ]
  },
  {
    id: 'security_bureau',
    name: '표준 계측 보안국',
    layer: 'middle',
    description: '규격과 질서를 강제하는 치안 유지 조직입니다.',
    color: '#1E90FF', // Dodger Blue
    characters: [
      {
        id: 'veronica',
        name: '베로니카',
        role: '보안국장',
        rank: '白',
        type: 'human',
        description: '얼굴 일부를 빼고는 전신이 강철로 된 사이보그입니다. 융통성이라곤 눈꼽만큼도 없죠. 그녀가 휘두르는 고압 증기 망치는 어떤 장갑판이라도 종잇장처럼 구겨버립니다. 규격 위반이나 불법 개조가 발각되는 순간, 변명할 틈도 없이 납작해질 각오를 해야 할 겁니다.',
        image: '/images/characters/Veronica.png',
        stats: { pressure: 150, precision: 100, steam: 100, calculation: 90 }, // Total: 440
        quotes: ["규정 위반입니다.", "즉결 심판을 집행한다.", "질서를 지키십시오.", "허가되지 않은 개조물입니다.", "법은 절대적입니다."],
        hiddenQuotes: ["...규정집에는 당신에 대한 항목이 없어.", "이번만... 눈감아주지.", "사실... 제복이 좀 꽉 끼는데...", "퇴근하고... 맥주 한 잔 할까?", "너는... 예외로 해줄게."], // 츤데레/허당
        unlockPassword: "IRON_HAMMER",
        scenarioStage: 7
      },
      {
        id: 'gatekeeper',
        name: '게이트키퍼',
        role: '검열관',
        rank: '鋼',
        type: 'machine',
        description: '얼굴이 있어야 할 자리에 수많은 카메라 렌즈가 박혀 있는 기괴한 양산형 기체입니다. 놈의 붉은 렌즈가 반짝이면 당신의 기체 구조와 약점이 실시간으로 스캔당하고 있다는 뜻이죠. 전투력보다는 집요한 추적과 분석 능력이 더 무서운 녀석입니다.',
        image: '/images/characters/Gatekeeper.png',
        stats: { pressure: 100, precision: 80, steam: 130, calculation: 120 }, // Total: 430
        quotes: ["통행증을 제시하십시오.", "스캔 중... 위협 감지.", "통과 불가.", "규정에 따르십시오.", "무기를 버리십시오."],
        hiddenQuotes: ["어서 오십시오, 주인님!", "오늘도 힘내세요!", "통행료는... 미소로 받겠습니다.", "다녀오셨어요? 기다리고 있었습니다.", "당신을 보면... 회로가 따뜻해집니다."] // 메이드/봉사
      }
    ]
  },
  {
    id: 'golden_valve',
    name: '황금 밸브 상회',
    layer: 'middle',
    description: '부와 자원을 독점하려는 거대 상인 조합입니다.',
    color: '#FFD700', // Gold
    characters: [
      {
        id: 'madame_rose',
        name: '마담 로즈',
        role: '상회장',
        rank: '白',
        type: 'human',
        description: '돈 냄새 하나는 기가 막히게 맡는 붉은 드레스의 귀부인입니다. 그녀는 직접 싸우지 않습니다. 손가락만 까딱하면 돈으로 매수한 최정예 용병 부대가 당신을 벌집으로 만들어줄 테니까요. 그녀 앞에서 섣불리 무력을 행사하려 했다간, 압도적인 자본의 힘에 짓눌리게 될 겁니다.',
        image: '/images/characters/Madame Rose.png',
        stats: { pressure: 40, precision: 150, steam: 50, calculation: 150 }, // Total: 390
        quotes: ["어머, 돈이 될까?", "계약 성립이네.", "비싼 몸들이야.", "세상에 공짜는 없단다.", "황금만이 진실이지."],
        hiddenQuotes: ["돈으로 살 수 없는 것도... 있더구나.", "너라면... 무료로 해줄 수도 있어.", "오늘 밤은 장사 안 해.", "내 모든 재산보다... 네가 더 빛나는구나.", "나랑 도망칠까? 아무도 모르는 곳으로."] // 누님/순정
      },
      {
        id: 'calculator',
        name: '캘큘러',
        role: '회계사',
        rank: '黃',
        type: 'machine',
        description: '마담 로즈의 전속 비서이자 살아있는 계산기입니다. 제국의 모든 환율과 물가 정보를 실시간으로 처리합니다. 전투 능력은 전무하지만, 상대의 자금줄을 끊거나 경제적으로 파산시키는 전술을 구사하여 물리적인 폭력보다 더 무서운 결과를 초래합니다.',
        image: '/images/characters/Calculator.png',
        stats: { pressure: 60, precision: 120, steam: 50, calculation: 130 }, // Total: 360
        quotes: ["계산 종료.", "수지 타산이 맞지 않습니다.", "영수증 처리하겠습니다.", "손익분기점 미달입니다.", "자산 동결을 실행합니다."],
        hiddenQuotes: ["계산 불가... 사랑이라는 변수 감지.", "당신의 가치는... 무한대입니다.", "오류... 오류... 심장이...", "당신을 위한 예산은... 무제한입니다.", "제 메모리에 당신을 영구 저장합니다."] // 로봇의 사랑
      }
    ]
  },
  {
    id: 'iron_wave',
    name: '철의 파동',
    layer: 'middle',
    description: '노동자들의 권리를 위해 투쟁하는 과격 단체입니다.',
    color: '#FF8C00', // Dark Orange
    characters: [
      {
        id: 'iron_maiden',
        name: '아이언-메이든',
        role: '위원장',
        rank: '白',
        type: 'human',
        description: '강철 마스크로 얼굴을 가린 혁명의 투사입니다. 양손에 달린 초대형 유압 파쇄기는 바위도 으깨버리는 파괴력을 자랑하죠. 그녀의 분노는 문자 그대로 동력원이 되어, 맞으면 맞을수록 더 강하게, 더 빠르게 당신을 몰아붙일 겁니다. 대화보다는 주먹이 먼저 나가는 타입이죠.',
        image: '/images/characters/Iron Maiden.png',
        stats: { pressure: 140, precision: 60, steam: 100, calculation: 80 }, // Total: 380
        quotes: ["혁명의 불꽃을!", "우리를 억압하지 마라!", "부숴버리겠어!", "사슬을 끊어라!", "우리는 기계가 아니다!"],
        hiddenQuotes: ["사실... 나도 평범하게 살고 싶었어.", "꽃을... 좋아해.", "가면 뒤의 얼굴은... 보지 마.", "싸움이 끝나면... 소풍 가고 싶다.", "너만은... 다치지 않았으면 해."] // 갭모에/소녀감성
      },
      {
        id: 'jack',
        name: '잭',
        role: '돌격대장',
        rank: '黃',
        type: 'human',
        description: '온몸에 투박한 엑소 스켈레톤(외골격)을 두른 인간 광전사입니다. 그의 팔에 장착된 파일 벙커는 증기 압축력으로 거대한 송곳을 쏘아내는데, 이거 한 방이면 웬만한 오토마톤은 그냥 관통당합니다. 생각보다는 본능으로 싸우는 위험한 녀석입니다.',
        image: '/images/characters/Jack.png',
        stats: { pressure: 100, precision: 60, steam: 100, calculation: 40 }, // Total: 300
        quotes: ["한 판 붙자고!", "구멍을 내주지!", "하하하!", "더 세게 덤벼봐!", "피가 끓어오르는군!"],
        hiddenQuotes: ["형님으로 모시겠습니다!", "싸움이 끝나면 술 한잔 어때?", "의리 빼면 시체지!", "내 등은 너에게 맡긴다!", "사나이의 우정... 멋지잖아?"] // 열혈/바보
      }
    ]
  },
  {
    id: 'silver_gear',
    name: '은빛 톱니 연대',
    layer: 'middle',
    description: '지식과 기술을 공유하며 중립을 지키는 기술자 연합입니다.',
    color: '#90EE90', // Light Green
    characters: [
      {
        id: 'sophia',
        name: '소피아',
        role: '학자',
        rank: '黃',
        type: 'human',
        description: '낡은 작업복에 안경을 쓴, 겉보기엔 평범한 학자입니다. 하지만 그녀의 무기는 말이 주는 힘이죠. 그녀가 선동 연설을 시작하면 주변의 시민들과 오토마톤들이 당신을 지키기 위해, 혹은 당신을 부수기 위해 인간 방패가 되어 달려들 겁니다. 무력 없이도 가장 무서운 힘을 가진 사람이죠.',
        image: '/images/characters/Sophia.png',
        stats: { pressure: 20, precision: 120, steam: 30, calculation: 140 }, // Total: 310
        quotes: ["지식이 곧 힘입니다.", "진정하세요.", "논리적으로 생각합시다.", "기록은 거짓말을 하지 않아요.", "해결책을 찾아보죠."],
        hiddenQuotes: ["안경... 어디 뒀더라?", "책 읽어주세요...", "졸려... 무릎베개 좀...", "이 공식... 너무 아름답지 않나요?", "당신에 대해... 더 연구하고 싶어요."] // 덜렁이/천연
      },
      {
        id: 'athena',
        name: '아테나',
        role: '경호원',
        rank: '白',
        type: 'machine',
        description: '소피아를 지키는 성기사형 기체입니다. 자기 몸집만한 초거대 타워 실드를 들고 다니는데, 그 방어력은 가히 철벽입니다. 뚫으려 하지 마세요. 그녀는 공격보다는 수비에 특화되어 있어서, 당신이 지칠 때까지 모든 공격을 막아내고 역습할 기회만 노릴 겁니다.',
        image: '/images/characters/Athena.png',
        stats: { pressure: 130, precision: 50, steam: 120, calculation: 100 }, // Total: 400
        quotes: ["...", "방어 태세.", "지키겠습니다.", "물러서십시오.", "위험 감지."],
        hiddenQuotes: ["당신을... 지키고 싶습니다.", "제 방패는 당신만을 위한 것.", "좋아...합니다.", "당신이 다치면... 저도 아픕니다.", "영원히... 곁에 있겠습니다."] // 쿨데레/충견
      }
    ]
  },

  // --- C. 하층 (Lower) ---
  {
    id: 'black_oil',
    name: '검은 오일 상단',
    layer: 'lower',
    description: '불법적인 거래와 암시장을 장악한 범죄 조직입니다.',
    color: '#B24BF3', // Bright Purple
    characters: [
      {
        id: 'madam_lily',
        name: '마담 릴리',
        role: '브로커',
        rank: '黃',
        type: 'human',
        description: '항상 방독면을 쓰고 다니는 꼽추 노파입니다. 품속에는 온갖 위험한 화학 약품들이 들어있죠. 전투 중에 몰래 신경 독가스를 뿌리거나 산성 용액을 던지는데, 방심하다간 장갑이 녹아내리고 회로가 마비될 겁니다. 정면 승부보다는 비열한 수법의 대가죠.',
        image: '/images/characters/Madam Lily.png',
        stats: { pressure: 30, precision: 100, steam: 50, calculation: 120 }, // Total: 300
        quotes: ["히히... 좋은 물건이 있어.", "독이 좀 퍼질 거야.", "거래할까?", "비밀은 비싸게 팔리지.", "조심해... 찔릴라."],
        hiddenQuotes: ["방독면 벗으면... 놀랄걸?", "나랑... 친구 할래?", "독보다 더 진한... 사랑을 줄게.", "너는... 팔지 않을 거야.", "내 수집품이 되어줄래?"], // 얀데레/반전매력
        unlockPassword: "SPIDER_LILY",
        scenarioStage: 3
      },
      {
        id: 'butcher',
        name: '부쳐',
        role: '처형인',
        rank: '黃',
        type: 'machine',
        description: "도살자 앞치마를 두른 거구의 기체인데, 피와 기름 냄새가 진동합니다. 한쪽 팔이 거대한 회전 톱날로 개조되어 있어서, 걸리는 건 뭐든지 갈아버리죠. 놈에게 잡히면 수리가 아니라 '해체'를 당하게 될 겁니다. 하층에서 가장 마주치기 싫은 흉물 중 하나예요.",
        image: '/images/characters/Butcher.png',
        stats: { pressure: 150, precision: 50, steam: 60, calculation: 20 }, // Total: 280
        quotes: ["고기다...!", "갈아버려!", "크하하하!", "신선한 고기!", "피 냄새가 좋아!"],
        hiddenQuotes: ["고기... 말고... 꽃?", "나도... 요리사가 되고 싶었어.", "맛있는 거... 줄까?", "나비야... 이리 와...", "친구... 안 먹어."] // 바보/순수
      }
    ]
  },
  {
    id: 'hybrid_workshop',
    name: '혼종 정비소',
    layer: 'lower',
    description: '생체 실험과 불법 개조를 자행하는 매드 닥터들의 소굴입니다.',
    color: '#32CD32', // Lime Green
    characters: [
      {
        id: 'nurse_stitch',
        name: '널스 스티치',
        role: '기술자',
        rank: '黃',
        type: 'human',
        description: '자칭 의사라는데, 믿지 마세요. 등 뒤에 수술용 톱과 드릴이 달린 4개의 기계 팔이 돋아나 있습니다. 그녀는 당신을 고치는 게 아니라, 살아있는 채로 해부하고 싶어 합니다. 마취도 없이 당신의 부품을 뜯어내며 희열을 느끼는 미치광이입니다.',
        image: '/images/characters/Nurse Stitch.png',
        stats: { pressure: 70, precision: 150, steam: 30, calculation: 100 }, // Total: 350
        quotes: ["치료해줄게... 영원히.", "아프지 않을 거야.", "수술 시작!", "어디가 아픈가요?", "조금 따끔할 거야."],
        hiddenQuotes: ["당신의 심장... 꺼내서 보관해도 될까?", "사랑은... 아픈 거야.", "나만 바라봐... 눈알을 꿰매버리기 전에.", "우리는... 영원히 함께야.", "당신의 비명소리... 녹음해도 돼?"], // 얀데레/하드코어
        unlockPassword: "NEEDLE_AND_THREAD",
        scenarioStage: 2
      },
      {
        id: 'dolly',
        name: '돌리',
        role: '실험체',
        rank: '白',
        type: 'machine',
        description: '실패한 실험의 슬픈 결과물입니다. 얼굴은 가냘픈 소녀지만 몸통 아래로는 흉측한 거미 다리가 달려있죠. 체내의 에테르가 불안정하게 폭주하고 있어서, 가까이 가면 예기치 못한 에너지 폭발에 휘말릴 수 있습니다. 통제 불능의 시한폭탄 같은 존재죠.',
        image: '/images/characters/Dolly.png',
        stats: { pressure: 110, precision: 80, steam: 150, calculation: 70 }, // Total: 410
        quotes: ["아파...", "오지 마...", "폭주... 시작...", "머리가... 깨질 것 같아...", "제발... 멈춰줘..."],
        hiddenQuotes: ["오빠...?", "놀아줘...", "나... 착한 아이야?", "안아줘...", "집에... 가고 싶어."] // 여동생/보호본능
      }
    ]
  },

  // --- D. 지상 (Ground) ---
  {
    id: 'crimson_knights',
    name: '적록의 기사단',
    layer: 'ground',
    description: '지상의 오염된 환경에서 독자적인 신념으로 싸우는 기사단입니다.',
    color: '#FF4500', // Orange Red
    characters: [
      {
        id: 'crimson_empress',
        name: '적색 여제',
        role: '기사단장',
        rank: '超',
        type: 'human',
        description: '인간을 증오하는 광기의 발키리입니다. 붉은 망토를 휘날리며 열화우라늄 창을 들고 돌격해오는데, 그 열기에 닿기만 해도 장갑이 녹아내립니다. 그녀는 타협을 모릅니다. 인간 편에 선 기계는 가차 없이 처단하는, 지상의 붉은 재앙입니다.',
        image: '/images/characters/Crimson Empress.png',
        stats: { pressure: 180, precision: 100, steam: 120, calculation: 130 }, // Total: 530
        quotes: ["이단은 정화한다!", "나의 창이 곧 법이다.", "붉게 물들어라.", "자비는 없다.", "불꽃으로 씻어내리라."],
        hiddenQuotes: ["사실... 빨간색 말고 분홍색이 좋아.", "나도... 공주님처럼 입고 싶어.", "너만은... 태우지 않겠다.", "머리... 빗겨줄래?", "가끔은... 쉬고 싶어."], // 갭모에/소녀
        unlockPassword: "BLOOD_THRONE",
        scenarioStage: 6
      },
      {
        id: 'nightmare',
        name: '나이트메어',
        role: '돌격대장',
        rank: '白',
        type: 'machine',
        description: '상체는 기사, 하체는 오토바이크로 된 기체입니다. 지상의 험한 지형을 초고속으로 질주하며 랜스를 꽂아 넣습니다. 엔진 소리가 들리면 이미 늦었습니다. 뺑소니를 당하기 싫다면 무조건 피하십시오.',
        image: '/images/characters/Nightmare.png',
        stats: { pressure: 120, precision: 90, steam: 110, calculation: 80 }, // Total: 400
        quotes: ["달려볼까!", "내 속도를 따라올 수 있나?", "비켜라!", "엔진 출력 최대!", "로드킬 주의!"],
        hiddenQuotes: ["부릉부릉~", "나랑 드라이브 갈래?", "헬멧은... 좀 불편해...", "기름 넣는 거... 도와줘.", "폭주족 아니야... 라이더야."] // 유쾌/개그
      }
    ]
  },
  {
    id: 'steam_pilgrims',
    name: '증기의 순례자',
    layer: 'ground',
    description: '고대의 지식을 찾아 황무지를 떠도는 방랑자들입니다.',
    color: '#F5DEB3', // Wheat
    characters: [
      {
        id: 'eve',
        name: '이브',
        role: '기록자',
        rank: '神',
        type: 'machine',
        description: '공중에 부유하는 신비로운 소녀형 기체입니다. 눈을 감고 있지만 모든 것을 보고 있죠. 그녀는 고밀도 에너지를 조작해 주변의 물리 법칙을 일시적으로 왜곡시킵니다. 공격이 빗나가거나 벽이 생기는 등, 상식 밖의 현상을 일으키는 초월적인 존재입니다.',
        image: '/images/characters/Eve.png',
        stats: { pressure: 150, precision: 200, steam: 150, calculation: 200 }, // Total: 700
        quotes: ["기록을 시작합니다.", "현실을 수정합니다.", "당신은... 누구?", "데이터를 동기화합니다.", "이곳은... 슬픈 곳이군요."],
        hiddenQuotes: ["당신을... 기록하고 싶어요. 영원히.", "이 감정은... 오류인가요?", "가지 마세요...", "당신의 손... 따뜻해요.", "저와 함께... 가시겠어요?"] // 신비/순수
      },
      {
        id: 'pathfinder',
        name: '패스파인더',
        role: '길잡이',
        rank: '白',
        type: 'machine',
        description: '순례자들의 눈과 귀가 되어주는 정찰 로봇입니다. 홀로그램으로 지형을 조작하거나 허상을 만들어 당신을 절벽으로 유인할 수 있습니다. 지상의 복잡한 지리를 이용한 게릴라전에 능하니 섣불리 쫓아가면 안 됩니다.',
        image: '/images/characters/Pathfinder.png',
        stats: { pressure: 80, precision: 120, steam: 100, calculation: 130 }, // Total: 430
        quotes: ["길을 찾았다.", "이쪽이다.", "데이터 전송 중.", "모래 폭풍이 오는군.", "조심해라."],
        hiddenQuotes: ["라떼는 말이야...", "허리가 쑤시는군...", "젊은이, 사탕 하나 줄까?", "옛날 생각이 나는구먼...", "지팡이가... 어디 갔지?"] // 노인/친근
      }
    ]
  }
];
