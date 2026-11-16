/**
 * Multilingual WhatsApp Message Generator for WifiGo Japan
 * Supports: Vietnamese (vi), English (en), Japanese (ja), Indonesian (id),
 * Chinese (zh-CN), Korean (ko), Thai (th), Tagalog (tl), French (fr), German (de), Spanish (es)
 */

export type SupportedLang = 'vi' | 'en' | 'ja' | 'id' | 'zh-CN' | 'ko' | 'th' | 'tl' | 'fr' | 'de' | 'es';

export interface ProductData {
  id?: string;
  name: string;
  monthlyPriceJPY: number;
  description: string;
  inStock?: boolean;
}

export interface CustomerOrderDetails {
  orderId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  deliveryMethod?: string;
  notes?: string;
}

/**
 * Detect current active language from cookie, localStorage, or fallback
 */
export const getActiveLanguage = (fallback = 'vi'): SupportedLang => {
  if (typeof window === 'undefined') return (fallback as SupportedLang) || 'vi';

  // 1. Direct param if provided and valid
  const normalize = (c: string): SupportedLang | null => {
    const code = c.trim();
    if (code === 'zh' || code.toLowerCase().startsWith('zh')) return 'zh-CN';
    const supported: SupportedLang[] = ['vi', 'en', 'ja', 'id', 'zh-CN', 'ko', 'th', 'tl', 'fr', 'de', 'es'];
    const found = supported.find(s => s.toLowerCase() === code.toLowerCase());
    return found || null;
  };

  if (fallback && normalize(fallback)) {
    const n = normalize(fallback);
    if (n && n !== 'vi') return n;
  }

  // 2. Read from localStorage
  try {
    const saved = localStorage.getItem('wifigo_current_lang');
    if (saved && normalize(saved)) {
      return normalize(saved)!;
    }
  } catch {
    /* ignore */
  }

  // 3. Read from Google Translate cookie: googtrans=/vi/<lang>
  try {
    const match = document.cookie.match(/googtrans=\/vi\/([a-zA-Z0-9_-]+)/);
    if (match && match[1] && normalize(match[1])) {
      return normalize(match[1])!;
    }
  } catch {
    /* ignore */
  }

  return (normalize(fallback) as SupportedLang) || 'vi';
};

/**
 * Pre-translated product details for 6 standard plans
 */
export const PRODUCT_TRANSLATIONS: Record<string, Partial<Record<SupportedLang, { name: string; description: string }>>> = {
  'prod-wifi-softbank': {
    vi: {
      name: 'Pocket WiFi SoftBank 100GB Không Giới Hạn',
      description: 'Cục phát WiFi bỏ túi tốc độ cao mạng SoftBank 4G/5G LTE. Dung lượng 100GB/tháng, pin trâu 16 tiếng, kết nối cùng lúc tối đa 5 thiết bị điện thoại, laptop mượt mà.'
    },
    en: {
      name: 'SoftBank Pocket WiFi 100GB Unlimited',
      description: 'High-speed pocket WiFi router powered by SoftBank 4G/5G LTE. 100GB/month high-speed data, 16-hour long battery life, seamlessly connects up to 5 smartphones and laptops simultaneously.'
    },
    ja: {
      name: 'SoftBank ポケットWiFi 100GB 無制限',
      description: 'SoftBank 4G/5G LTE回線対応の高速モバイルWiFiルーター。月間100GBの大容量、16時間持続バッテリー、スマホやPCなど最大5台まで同時接続可能。'
    },
    id: {
      name: 'Pocket WiFi SoftBank 100GB Unlimited',
      description: 'Router WiFi saku berkecepatan tinggi dengan jaringan SoftBank 4G/5G LTE. Kuota 100GB/bulan, daya tahan baterai 16 jam, menghubungkan hingga 5 perangkat smartphone dan laptop secara bersamaan dengan lancar.'
    },
    'zh-CN': {
      name: 'SoftBank 随身口袋WiFi 100GB 高速无限',
      description: 'SoftBank 4G/5G LTE 高速随身口袋WiFi路由器。每月100GB超大高速流量，16小时超长续航电池，最多可同时稳定连接5台手机与电脑。'
    },
    ko: {
      name: '소프트뱅크 포켓 와이파이 100GB 무제한',
      description: '소프트뱅크 4G/5G LTE 고속 포켓 와이파이 단말기. 월 100GB 대용량 데이터, 16시간 지속 배터리, 스마트폰 및 노트북 등 최대 5대 동시 연결 지원.'
    },
    th: {
      name: 'Pocket WiFi SoftBank 100GB ไม่จำกัด',
      description: 'เครื่องปล่อยสัญญาณ WiFi พกพาความเร็วสูงบนเครือข่าย SoftBank 4G/5G LTE ปริมาณ 100GB/เดือน แบตเตอรี่ใช้งานได้ยาวนาน 16 ชั่วโมง เชื่อมต่อได้สูงสุด 5 เครื่องพร้อมกัน'
    },
    tl: {
      name: 'Pocket WiFi SoftBank 100GB Unlimited',
      description: 'High-speed pocket WiFi router sa SoftBank 4G/5G LTE network. 100GB bawat buwan, 16 oras na battery life, kayang ikonekta ang hanggang 5 devices (phones, laptops) nang maayos.'
    },
    fr: {
      name: 'Pocket WiFi SoftBank 100 Go Illimité',
      description: 'Routeur WiFi de poche haut débit sur le réseau SoftBank 4G/5G LTE. 100 Go/mois de données, autonomie de 16 heures, connexion fluide jusqu\'à 5 appareils simultanément.'
    },
    de: {
      name: 'Pocket WiFi SoftBank 100 GB Unbegrenzt',
      description: 'Mobiles Highspeed-WLAN-Gerät im SoftBank 4G/5G LTE-Netz. 100 GB/Monat Highspeed-Daten, 16 Stunden Akkulaufzeit, verbindet bis zu 5 Geräte gleichzeitig.'
    },
    es: {
      name: 'Pocket WiFi SoftBank 100GB Ilimitado',
      description: 'Dispositivo router WiFi de bolsillo de alta velocidad con red SoftBank 4G/5G LTE. 100GB/mes de datos, batería de 16 horas de duración, conecta hasta 5 dispositivos a la vez sin cortes.'
    }
  },
  'prod-sim-docomo': {
    vi: {
      name: 'SIM Data NTT Docomo 5G 50GB Tốc Độ Cao',
      description: 'SIM data mạng Docomo số 1 Nhật Bản, phủ sóng rộng khắp từ thành phố đến vùng quê. Tốc độ ổn định, không bóp băng thông, phù hợp học tập và làm việc lâu dài.'
    },
    en: {
      name: 'NTT Docomo 5G 50GB High-Speed Data SIM',
      description: 'Data SIM on Japan\'s #1 NTT Docomo network, with comprehensive coverage from major cities to rural regions. Stable speed, no throttling, ideal for long-term study and work.'
    },
    ja: {
      name: 'NTTドコモ 5G 50GB 高速データSIM',
      description: '日本シェアNo.1のNTTドコモ回線データSIM。全国津々浦々まで広範な通信エリアをカバー。安定した通信速度で速度制限なし、長期の留学やビジネスに最適。'
    },
    id: {
      name: 'SIM Data NTT Docomo 5G 50GB Kecepatan Tinggi',
      description: 'SIM data jaringan Docomo No. 1 di Jepang, jangkauan luas dari kota hingga pelosok. Kecepatan stabil tanpa pembatasan bandwidth, cocok untuk belajar dan bekerja jangka panjang.'
    },
    'zh-CN': {
      name: 'NTT Docomo 5G 50GB 高速流量卡',
      description: '日本覆盖率第一的 NTT Docomo 网络数据SIM卡，城市与乡村信号全面覆盖。高速稳定不限速，非常适合长期留学生与在日工作人士。'
    },
    ko: {
      name: 'NTT 도코모 5G 50GB 고속 데이터 SIM',
      description: '일본 1위 통신망 NTT 도코모 데이터 SIM 카드. 대도시부터 지방까지 광범위한 커버리지 지원. 안정적인 속도와 대역폭 보장으로 장기 유학 및 근무에 최적.'
    },
    th: {
      name: 'ซิมเน็ต NTT Docomo 5G 50GB ความเร็วสูง',
      description: 'ซิมเน็ตบนเครือข่าย Docomo อันดับ 1 ของญี่ปุ่น ครอบคลุมสัญญาณทั่วประเทศตั้งแต่ในเมืองจนถึงต่างจังหวัด ความเร็วเสถียร ไม่ลดสปีด เหมาะสำหรับเรียนและทำงานระยะยาว'
    },
    tl: {
      name: 'SIM Data NTT Docomo 5G 50GB High-Speed',
      description: 'Data SIM sa No. 1 network ng Japan na Docomo, may malawak na coverage mula lungsod hanggang lalawigan. Matatag na bilis, walang throttling, bagay sa pag-aaral at trabaho.'
    },
    fr: {
      name: 'Carte SIM Données NTT Docomo 5G 50 Go Haute Vitesse',
      description: 'SIM de données sur le réseau Docomo n°1 au Japon, couverture étendue des métropoles aux campagnes. Débit stable sans bridage, idéal pour les études et le travail.'
    },
    de: {
      name: 'NTT Docomo 5G 50 GB Highspeed-Daten-SIM',
      description: 'Daten-SIM im Docomo-Netz, der Nummer 1 in Japan, mit flächendeckender Abdeckung. Stabile Geschwindigkeit ohne Drosselung, optimal für Studium und Beruf.'
    },
    es: {
      name: 'SIM de Datos NTT Docomo 5G 50GB Alta Velocidad',
      description: 'SIM de datos en la red Docomo n.º 1 de Japón, amplia cobertura desde grandes urbes hasta zonas rurales. Velocidad constante sin restricciones, ideal para estudios y trabajo.'
    }
  },
  'prod-esim-au': {
    vi: {
      name: 'eSIM Nhật Bản UQ Mobile / au 20GB Cước Rẻ',
      description: 'Cài đặt tức thì qua mã QR sau 5 phút. Dung lượng 20GB tốc độ cao mỗi tháng, giữ nguyên sim chính Việt Nam nhận mã OTP ngân hàng.'
    },
    en: {
      name: 'Japan eSIM UQ Mobile / au 20GB Budget Plan',
      description: 'Instant activation via QR code in 5 minutes. 20GB high-speed data per month, keep your primary home SIM active to receive banking OTP codes.'
    },
    ja: {
      name: '日本eSIM UQ mobile / au 20GB 格安プラン',
      description: 'QRコード読み取りでわずか5分で即時設定完了。月間20GBの高速データ通信、母国の主回線SIMをそのまま残して銀行OTP等のSMSも受信可能。'
    },
    id: {
      name: 'eSIM Jepang UQ Mobile / au 20GB Hemat',
      description: 'Aktivasi instan via kode QR dalam 5 menit. Kuota 20GB kecepatan tinggi per bulan, tetap dapat memakai SIM utama untuk menerima kode OTP bank.'
    },
    'zh-CN': {
      name: '日本 eSIM UQ Mobile / au 20GB 超值套餐',
      description: '扫码仅需5分钟即可极速配置激活。每月20GB高速流量，可同时保留国内原SIM卡以正常接收银行与各类短信验证码。'
    },
    ko: {
      name: '일본 eSIM UQ모바일 / au 20GB 알뜰 요금제',
      description: 'QR 코드 스캔으로 5분 만에 즉시 설치 완료. 매월 20GB 고속 데이터 제공, 기존 본국 메인 유심을 유지하여 은행 OTP 문자 수신 가능.'
    },
    th: {
      name: 'eSIM ญี่ปุ่น UQ Mobile / au 20GB ราคาประหยัด',
      description: 'เปิดใช้งานได้ทันทีผ่านรหัส QR ภายใน 5 นาที เน็ตความเร็วสูง 20GB ต่อเดือน สามารถเก็บซิมหลักเดิมไว้รับรหัส OTP ธนาคารได้สะดวก'
    },
    tl: {
      name: 'Japan eSIM UQ Mobile / au 20GB Murang Plan',
      description: 'Mabilis na activation gamit ang QR code sa loob ng 5 minuto. 20GB high-speed data bawat buwan, panatilihin ang iyong primaryang SIM para sa mga bank OTP.'
    },
    fr: {
      name: 'eSIM Japon UQ Mobile / au 20 Go Forfait Économique',
      description: 'Installation immédiate par code QR en 5 minutes. 20 Go de données haut débit par mois, permet de conserver votre SIM principale pour recevoir les codes OTP bancaires.'
    },
    de: {
      name: 'Japan eSIM UQ Mobile / au 20 GB Spartarif',
      description: 'Sofortige Aktivierung per QR-Code in 5 Minuten. 20 GB Highspeed-Daten pro Monat, Haupt-SIM bleibt aktiv für den Empfang von Bank-OTPs.'
    },
    es: {
      name: 'eSIM Japón UQ Mobile / au 20GB Económico',
      description: 'Activación inmediata mediante código QR en 5 minutos. 20GB de datos de alta velocidad al mes, mantenga activa su SIM principal para recibir códigos OTP del banco.'
    }
  },
  'prod-wifi-ymobile': {
    vi: {
      name: 'Pocket WiFi Y!mobile 50GB Bỏ Túi Tiện Lợi',
      description: 'Thiết bị phát sóng WiFi nhỏ gọn di động, mạng phủ sóng toàn diện Nhật Bản. Hỗ trợ xem phim, chơi game, học online mượt mà không lo đứt mạng.'
    },
    en: {
      name: 'Y!mobile Pocket WiFi 50GB Portable Device',
      description: 'Compact and portable WiFi router with comprehensive nationwide coverage in Japan. Smooth video streaming, gaming, and online learning without disconnections.'
    },
    ja: {
      name: 'Y!mobile ポケットWiFi 50GB コンパクトルーター',
      description: '持ち運びに便利な小型モバイルルーター、日本全国充実のエリア展開。動画視聴、オンライン講義、ゲームも途切れずサクサク快適。'
    },
    id: {
      name: 'Pocket WiFi Y!mobile 50GB Portabel Praktis',
      description: 'Perangkat pemancar WiFi portabel ringkas dengan jangkauan sinyal menyeluruh di Jepang. Lancar untuk streaming video, game, dan kelas online tanpa putus.'
    },
    'zh-CN': {
      name: 'Y!mobile 便携随身WiFi 50GB',
      description: '精致轻巧易随身携带的口袋路由器，全日本网络无缝覆盖。流畅支持高清追剧、网课学习及畅快游戏，稳定不掉线。'
    },
    ko: {
      name: '와이모바일 포켓와이파이 50GB 휴대용 기기',
      description: '콤팩트한 휴대용 모바일 와이파이 단말기, 일본 전역 안정적인 통신망 제공. 동영상 시청, 온라인 강의, 게임까지 끊김 없이 쾌적하게 이용 가능.'
    },
    th: {
      name: 'Pocket WiFi Y!mobile 50GB พกพาสะดวก',
      description: 'เราเตอร์กระจายสัญญาณ WiFi ขนาดกะทัดรัดพกพาง่าย สัญญาณครอบคลุมทั่วประเทศญี่ปุ่น ดูวิดีโอ เล่นเกม เรียนออนไลน์ได้อย่างราบรื่นไม่มีสะดุด'
    },
    tl: {
      name: 'Pocket WiFi Y!mobile 50GB Portable Router',
      description: 'Maliit at madaling dalhing pocket WiFi device, may nationwide coverage sa Japan. Tamang-tama sa panonood, gaming, at online class nang walang aberya.'
    },
    fr: {
      name: 'Pocket WiFi Y!mobile 50 Go Format Compact',
      description: 'Boîtier WiFi portable ultra-compact offrant une excellente couverture à travers tout le Japon. Idéal pour le streaming, le télétravail et les jeux sans coupure.'
    },
    de: {
      name: 'Y!mobile Pocket WiFi 50 GB Kompakter Router',
      description: 'Kompakter mobiler WLAN-Router mit hervorragender Netzabdeckung in ganz Japan. Für flüssiges Streaming, Homeoffice und Gaming ohne Abbrüche.'
    },
    es: {
      name: 'Pocket WiFi Y!mobile 50GB Portátil Compacto',
      description: 'Dispositivo router WiFi de bolsillo ligero con cobertura completa en Japón. Disfrute de streaming, videollamadas y juegos sin cortes de conexión.'
    }
  },
  'prod-sim-rakuten': {
    vi: {
      name: 'SIM Nghe Gọi + Data Rakuten Mobile Un-limit',
      description: 'SIM kèm số điện thoại Nhật (+81) nghe gọi và nhận OTP nội địa. Data không giới hạn trong vùng sóng Rakuten, cước trọn gói tiết kiệm hàng tháng.'
    },
    en: {
      name: 'Rakuten Mobile Voice & Unlimited Data SIM',
      description: 'SIM with authentic Japanese phone number (+81) for domestic calls and local OTP verification. Unlimited high-speed data in Rakuten network zones at a low monthly rate.'
    },
    ja: {
      name: '楽天モバイル 音声通話＋無制限データSIM',
      description: '日本国内電話番号（+81）付きで通話・国内各種SMS認証（OTP）に対応。楽天回線エリア内データ完全無制限、毎月家計に優しいおトクな定額料金。'
    },
    id: {
      name: 'SIM Panggilan Suara + Data Unlimited Rakuten Mobile',
      description: 'SIM dengan nomor telepon resmi Jepang (+81) untuk telepon dan verifikasi OTP lokal. Data tanpa batas di zona jaringan Rakuten dengan biaya bulanan sangat hemat.'
    },
    'zh-CN': {
      name: '乐天移动 Rakuten 语音通话+无限流量SIM卡',
      description: '配备日本本土真实手机号（+81），支持拨打电话及接收日本本地各类短信验证码。乐天网络覆盖区内无限高速流量，每月极具性价比。'
    },
    ko: {
      name: '라쿠텐 모바일 음성통화 + 무제한 데이터 SIM',
      description: '일본 현지 번호(+81) 부여로 국내 통화 및 로컬 본인인증(OTP) 수신 가능. 라쿠텐 회선 구역 내 무제한 데이터 제공으로 경제적인 월 요금 실현.'
    },
    th: {
      name: 'ซิมโทรออก-รับสาย + เน็ตไม่จำกัด Rakuten Mobile',
      description: 'ซิมมาพร้อมเบอร์โทรศัพท์ญี่ปุ่นแท้ (+81) รองรับการโทรและรับรหัส OTP ภายในประเทศ อินเทอร์เน็ตไม่จำกัดในพื้นที่สัญญาณ Rakuten ราคาประหยัดสุดคุ้ม'
    },
    tl: {
      name: 'SIM Tawag at Unlimited Data Rakuten Mobile',
      description: 'SIM na may lehitimong numero ng telepono sa Japan (+81) para sa mga tawag at lokal na OTP verification. Walang limitasyong data sa Rakuten coverage areas.'
    },
    fr: {
      name: 'Carte SIM Appels + Données Illimitées Rakuten Mobile',
      description: 'SIM incluant un numéro de téléphone japonais officiel (+81) pour appels et codes OTP locaux. Données illimitées sur le réseau Rakuten à prix mensuel avantageux.'
    },
    de: {
      name: 'Rakuten Mobile Telefonie + Unbegrenzte Daten-SIM',
      description: 'SIM mit echter japanischer Telefonnummer (+81) für Inlandsgespräche und lokale SMS-Verifizierungen. Unbegrenztes Datenvolumen im Rakuten-Netz.'
    },
    es: {
      name: 'SIM Voz + Datos Ilimitados Rakuten Mobile',
      description: 'SIM con número de teléfono japonés real (+81) para llamadas locales y recepción de códigos OTP. Datos ilimitados en zona de cobertura Rakuten a bajo coste mensual.'
    }
  },
  'prod-sim-iijmio': {
    vi: {
      name: 'SIM Data Tiết Kiệm IIJmio 10GB Sinh Viên & Tu Nghiệp',
      description: 'Gói cước giá rẻ tối ưu chi phí cho du học sinh và người lao động tại Nhật. 10GB data tốc độ cao, hỗ trợ tích luỹ dung lượng thừa sang tháng sau.'
    },
    en: {
      name: 'IIJmio 10GB Budget Data SIM for Students & Trainees',
      description: 'Ultra-affordable plan optimized for international students and workers in Japan. 10GB high-speed data with automatic rollover of unused data to the next month.'
    },
    ja: {
      name: 'IIJmio 10GB 格安データSIM（留学生・実習生応援）',
      description: '留学生や技能実習生、在日ワーカーの通信費を徹底的に抑える格安プラン。月間10GBの高速通信に加え、余ったデータ通信量の翌月繰り越しにも対応。'
    },
    id: {
      name: 'SIM Data Hemat IIJmio 10GB untuk Pelajar & Pekerja',
      description: 'Paket super hemat yang dioptimalkan untuk mahasiswa dan pekerja magang di Jepang. Kuota 10GB berkecepatan tinggi dengan fitur carry-over sisa kuota ke bulan depan.'
    },
    'zh-CN': {
      name: 'IIJmio 10GB 留学生与研修生超值流量卡',
      description: '专为在日留学生、技能实习生量身定制的超低月租流量套餐。包含每月10GB高速流量，支持未用完流量自动结转至次月继续使用。'
    },
    ko: {
      name: 'IIJmio 10GB 유학생 및 연수생 알뜰 데이터 SIM',
      description: '일본 유학생 및 기능실습생의 통신비 절감을 위해 특화된 실속형 플랜. 매월 10GB 고속 데이터 제공 및 남은 데이터 익월 이월 기능 지원.'
    },
    th: {
      name: 'ซิมเน็ตสุดประหยัด IIJmio 10GB สำหรับนักเรียนและผู้ฝึกงาน',
      description: 'แพ็กเกจราคาสุดคุ้ม ออกแบบมาเพื่อนักเรียนและแรงงานในญี่ปุ่นโดยเฉพาะ เน็ตความเร็วสูง 10GB พร้อมระบบยกยอดเน็ตที่เหลือไปใช้ในเดือนถัดไปได้'
    },
    tl: {
      name: 'SIM Data Matipid IIJmio 10GB para sa Estudyante at Trainee',
      description: 'Sulit na plan para sa mga estudyante at overseas workers sa Japan. May 10GB high-speed data at awtomatikong naililipat ang natirang data sa susunod na buwan.'
    },
    fr: {
      name: 'Carte SIM Données Économique IIJmio 10 Go Étudiants & Travailleurs',
      description: 'Formule ultra-économique conçue pour les étudiants et stagiaires au Japon. 10 Go de données haut débit avec report automatique du solde non consommé au mois suivant.'
    },
    de: {
      name: 'IIJmio 10 GB Budget-Daten-SIM für Studenten & Auszubildende',
      description: 'Extrem kostengünstiger Tarif für Studierende und Fachkräfte in Japan. 10 GB Highspeed-Daten mit automatischer Übertragung von Restvolumen in den Folgemonat.'
    },
    es: {
      name: 'SIM de Datos Económica IIJmio 10GB Estudiantes y Trabajadores',
      description: 'Tarifa súper asequible diseñada para estudiantes extranjeros y trabajadores en Japón. 10GB de datos de alta velocidad con traspaso de datos sobrantes al mes siguiente.'
    }
  }
};

/**
 * Multilingual Templates for WhatsApp Messages
 */
interface WhatsAppLocaleTemplate {
  greeting: (siteName: string) => string;
  planNameLabel: string;
  monthlyPriceLabel: string;
  pricePerMonth: (priceStr: string) => string;
  statusLabel: string;
  inStockText: string;
  outOfStockText: string;
  detailsLabel: string;
  registrationHeader: string;
  orderIdLabel: string;
  customerNameLabel: string;
  customerPhoneLabel: string;
  customerEmailLabel: string;
  deliveryMethodLabel: string;
  deliveryMethods: Record<string, string>;
  notesLabel: string;
  closingNote: string;
}

export const LOCALE_TEMPLATES: Record<SupportedLang, WhatsAppLocaleTemplate> = {
  vi: {
    greeting: (site) => `Xin chào ${site}!\nTôi muốn đăng ký gói cước sau:`,
    planNameLabel: '📱 *Tên gói cước:*',
    monthlyPriceLabel: '💰 *Cước hàng tháng:*',
    pricePerMonth: (price) => `${price} / tháng`,
    statusLabel: '⚡ *Tình trạng:*',
    inStockText: 'Còn hàng (Sẵn sàng kích hoạt)',
    outOfStockText: 'Tạm hết hàng',
    detailsLabel: '📋 *Nội dung chi tiết gói:*',
    registrationHeader: '👤 *Thông tin đăng ký:*',
    orderIdLabel: '- Mã đơn:',
    customerNameLabel: '- Họ và tên:',
    customerPhoneLabel: '- Số điện thoại:',
    customerEmailLabel: '- Email:',
    deliveryMethodLabel: '- Hình thức nhận:',
    deliveryMethods: {
      esim_email: 'eSIM gửi qua Email / WhatsApp',
      home_delivery: 'Giao tận nơi (Nhật Bản / Việt Nam)',
      airport_pickup: 'Nhận tại quầy sân bay'
    },
    notesLabel: '- Ghi chú:',
    closingNote: 'Vui lòng tư vấn và hỗ trợ tôi hoàn tất thủ tục đăng ký gói này nhé! Xin cảm ơn.'
  },
  en: {
    greeting: (site) => `Hello ${site}!\nI would like to register for the following plan:`,
    planNameLabel: '📱 *Plan Name:*',
    monthlyPriceLabel: '💰 *Monthly Price:*',
    pricePerMonth: (price) => `${price} / month`,
    statusLabel: '⚡ *Status:*',
    inStockText: 'In Stock (Ready to activate)',
    outOfStockText: 'Out of Stock',
    detailsLabel: '📋 *Plan Details:*',
    registrationHeader: '👤 *Registration Details:*',
    orderIdLabel: '- Order ID:',
    customerNameLabel: '- Full Name:',
    customerPhoneLabel: '- Phone Number:',
    customerEmailLabel: '- Email:',
    deliveryMethodLabel: '- Delivery Method:',
    deliveryMethods: {
      esim_email: 'eSIM sent via Email / WhatsApp',
      home_delivery: 'Home delivery (Japan / Vietnam)',
      airport_pickup: 'Airport Counter Pickup'
    },
    notesLabel: '- Note:',
    closingNote: 'Please consult and assist me in completing the registration for this plan! Thank you.'
  },
  ja: {
    greeting: (site) => `こんにちは、${site}様！\n以下のプランの申し込みを希望します：`,
    planNameLabel: '📱 *プラン名:*',
    monthlyPriceLabel: '💰 *月額料金:*',
    pricePerMonth: (price) => `${price} / 月`,
    statusLabel: '⚡ *在庫状況:*',
    inStockText: '在庫あり（即時開通可能）',
    outOfStockText: '一時品切れ',
    detailsLabel: '📋 *プラン詳細・内容:*',
    registrationHeader: '👤 *お申し込み情報:*',
    orderIdLabel: '- 注文番号:',
    customerNameLabel: '- お名前:',
    customerPhoneLabel: '- 電話番号:',
    customerEmailLabel: '- メールアドレス:',
    deliveryMethodLabel: '- 受取方法:',
    deliveryMethods: {
      esim_email: 'eSIM（メール / WhatsAppでのQRコード送付）',
      home_delivery: 'ご指定住所へ配送（日本全国・ベトナム）',
      airport_pickup: '空港カウンター受取'
    },
    notesLabel: '- 備考:',
    closingNote: 'プランの契約手続きとサポートをお願いいたします！よろしくお願いいたします。'
  },
  id: {
    greeting: (site) => `Halo ${site}!\nSaya ingin mendaftar untuk paket berikut:`,
    planNameLabel: '📱 *Nama Paket:*',
    monthlyPriceLabel: '💰 *Biaya Bulanan:*',
    pricePerMonth: (price) => `${price} / bulan`,
    statusLabel: '⚡ *Status:*',
    inStockText: 'Tersedia (Siap diaktifkan)',
    outOfStockText: 'Habis',
    detailsLabel: '📋 *Detail Paket:*',
    registrationHeader: '👤 *Informasi Pendaftaran:*',
    orderIdLabel: '- Nomor Pesanan:',
    customerNameLabel: '- Nama Lengkap:',
    customerPhoneLabel: '- Nomor Telepon:',
    customerEmailLabel: '- Email:',
    deliveryMethodLabel: '- Metode Pengiriman:',
    deliveryMethods: {
      esim_email: 'eSIM dikirim via Email / WhatsApp',
      home_delivery: 'Pengiriman ke rumah (Jepang / Vietnam)',
      airport_pickup: 'Ambil di Konter Bandara'
    },
    notesLabel: '- Catatan:',
    closingNote: 'Mohon bantu dan pandu saya untuk menyelesaikan proses pendaftaran paket ini! Terima kasih.'
  },
  'zh-CN': {
    greeting: (site) => `您好，${site}！\n我想申请办理以下套餐：`,
    planNameLabel: '📱 *套餐名称:*',
    monthlyPriceLabel: '💰 *每月资费:*',
    pricePerMonth: (price) => `${price} / 月`,
    statusLabel: '⚡ *库存状态:*',
    inStockText: '有现货（立即可开通）',
    outOfStockText: '暂时缺货',
    detailsLabel: '📋 *套餐详情说明:*',
    registrationHeader: '👤 *申请人信息:*',
    orderIdLabel: '- 订单编号:',
    customerNameLabel: '- 姓名:',
    customerPhoneLabel: '- 联系电话:',
    customerEmailLabel: '- 电子邮箱:',
    deliveryMethodLabel: '- 领取方式:',
    deliveryMethods: {
      esim_email: 'eSIM 通过邮件 / WhatsApp 发送二维码',
      home_delivery: '送货上门（日本全国 / 越南）',
      airport_pickup: '机场柜台领取'
    },
    notesLabel: '- 备注:',
    closingNote: '请协助指导我完成该套餐的开通申请，非常感谢！'
  },
  ko: {
    greeting: (site) => `안녕하세요, ${site}님!\n다음 요금제 상품 신청을 원합니다:`,
    planNameLabel: '📱 *요금제 상품명:*',
    monthlyPriceLabel: '💰 *월 이용료:*',
    pricePerMonth: (price) => `${price} / 월`,
    statusLabel: '⚡ *재고 상태:*',
    inStockText: '재고 있음 (즉시 개통 가능)',
    outOfStockText: '일시 품절',
    detailsLabel: '📋 *요금제 상세 내용:*',
    registrationHeader: '👤 *신청자 정보:*',
    orderIdLabel: '- 주문 번호:',
    customerNameLabel: '- 성명:',
    customerPhoneLabel: '- 전화번호:',
    customerEmailLabel: '- 이메일:',
    deliveryMethodLabel: '- 수령 방식:',
    deliveryMethods: {
      esim_email: 'eSIM 이메일 / WhatsApp QR 발송',
      home_delivery: '자택 배송 (일본 전역 / 베트남)',
      airport_pickup: '공항 카운터 수령'
    },
    notesLabel: '- 메모:',
    closingNote: '요금제 가입 절차 및 상담 안내를 부탁드립니다! 감사합니다.'
  },
  th: {
    greeting: (site) => `สวัสดี ${site}!\nฉันต้องการสมัครแพ็กเกจต่อไปนี้:`,
    planNameLabel: '📱 *ชื่อแพ็กเกจ:*',
    monthlyPriceLabel: '💰 *ค่าบริการรายเดือน:*',
    pricePerMonth: (price) => `${price} / เดือน`,
    statusLabel: '⚡ *สถานะ:*',
    inStockText: 'มีสินค้าพร้อมส่ง (พร้อมเปิดใช้งาน)',
    outOfStockText: 'สินค้าหมดชั่วคราว',
    detailsLabel: '📋 *รายละเอียดแพ็กเกจ:*',
    registrationHeader: '👤 *ข้อมูลการลงทะเบียน:*',
    orderIdLabel: '- หมายเลขคำสั่งซื้อ:',
    customerNameLabel: '- ชื่อ-นามสกุล:',
    customerPhoneLabel: '- เบอร์โทรศัพท์:',
    customerEmailLabel: '- อีเมล:',
    deliveryMethodLabel: '- วิธีการรับสินค้า:',
    deliveryMethods: {
      esim_email: 'eSIM ส่งทางอีเมล / WhatsApp',
      home_delivery: 'จัดส่งถึงบ้าน (ญี่ปุ่น / เวียดนาม)',
      airport_pickup: 'รับที่เคาน์เตอร์สนามบิน'
    },
    notesLabel: '- หมายเหตุ:',
    closingNote: 'กรุณาให้คำแนะนำและช่วยเหลือฉันในการทำรายการให้เสร็จสมบูรณ์ ขอบคุณมากครับ/ค่ะ!'
  },
  tl: {
    greeting: (site) => `Kumusta ${site}!\nNais ko pong mag-apply para sa sumusunod na plan:`,
    planNameLabel: '📱 *Pangalan ng Plan:*',
    monthlyPriceLabel: '💰 *Buwanang Bayad:*',
    pricePerMonth: (price) => `${price} / buwan`,
    statusLabel: '⚡ *Status:*',
    inStockText: 'Available (Handang i-activate)',
    outOfStockText: 'Out of Stock',
    detailsLabel: '📋 *Mga Detalye ng Plan:*',
    registrationHeader: '👤 *Impormasyon sa Pagpaparehistro:*',
    orderIdLabel: '- Order ID:',
    customerNameLabel: '- Buong Pangalan:',
    customerPhoneLabel: '- Telepono:',
    customerEmailLabel: '- Email:',
    deliveryMethodLabel: '- Paraan ng Pagpapadala:',
    deliveryMethods: {
      esim_email: 'eSIM sa pamamagitan ng Email / WhatsApp',
      home_delivery: 'Paghahatid sa tirahan (Japan / Vietnam)',
      airport_pickup: 'Airport counter pickup'
    },
    notesLabel: '- Paalala:',
    closingNote: 'Pakitulungan po ako na makumpleto ang pagpaparehistro para sa plan na ito! Maraming salamat po.'
  },
  fr: {
    greeting: (site) => `Bonjour ${site} !\nJe souhaite souscrire au forfait suivant :`,
    planNameLabel: '📱 *Nom du forfait :*',
    monthlyPriceLabel: '💰 *Tarif mensuel :*',
    pricePerMonth: (price) => `${price} / mois`,
    statusLabel: '⚡ *Disponibilité :*',
    inStockText: 'En stock (Prêt à être activé)',
    outOfStockText: 'Rupture de stock',
    detailsLabel: '📋 *Détails du forfait :*',
    registrationHeader: '👤 *Informations d\'inscription :*',
    orderIdLabel: '- Réf. commande :',
    customerNameLabel: '- Nom complet :',
    customerPhoneLabel: '- Téléphone :',
    customerEmailLabel: '- E-mail :',
    deliveryMethodLabel: '- Mode de livraison :',
    deliveryMethods: {
      esim_email: 'eSIM envoyé par Email / WhatsApp',
      home_delivery: 'Livraison à domicile (Japon / Vietnam)',
      airport_pickup: 'Retrait au comptoir de l\'aéroport'
    },
    notesLabel: '- Remarque :',
    closingNote: 'Merci de bien vouloir m\'assister pour finaliser l\'inscription à ce forfait ! Cordialement.'
  },
  de: {
    greeting: (site) => `Hallo ${site}!\nIch möchte folgenden Tarif buchen:`,
    planNameLabel: '📱 *Tarifname:*',
    monthlyPriceLabel: '💰 *Monatliche Gebühr:*',
    pricePerMonth: (price) => `${price} / Monat`,
    statusLabel: '⚡ *Verfügbarkeit:*',
    inStockText: 'Auf Lager (Sofort aktivierbar)',
    outOfStockText: 'Derzeit nicht verfügbar',
    detailsLabel: '📋 *Tarifdetails:*',
    registrationHeader: '👤 *Anmeldedaten:*',
    orderIdLabel: '- Bestellnummer:',
    customerNameLabel: '- Vollständiger Name:',
    customerPhoneLabel: '- Telefonnummer:',
    customerEmailLabel: '- E-Mail:',
    deliveryMethodLabel: '- Lieferart:',
    deliveryMethods: {
      esim_email: 'eSIM per E-Mail / WhatsApp',
      home_delivery: 'Lieferung nach Hause (Japan / Vietnam)',
      airport_pickup: 'Abholung am Flughafenschalter'
    },
    notesLabel: '- Anmerkung:',
    closingNote: 'Bitte beraten Sie mich und helfen Sie mir bei der Buchung dieses Tarifs! Vielen Dank.'
  },
  es: {
    greeting: (site) => `¡Hola ${site}!\nDeseo contratar el siguiente plan:`,
    planNameLabel: '📱 *Nombre del plan:*',
    monthlyPriceLabel: '💰 *Tarifa mensual:*',
    pricePerMonth: (price) => `${price} / mes`,
    statusLabel: '⚡ *Disponibilidad:*',
    inStockText: 'Disponible (Listo para activar)',
    outOfStockText: 'Agotado temporalmente',
    detailsLabel: '📋 *Detalles del plan:*',
    registrationHeader: '👤 *Datos de registro:*',
    orderIdLabel: '- N.º de pedido:',
    customerNameLabel: '- Nombre y apellidos:',
    customerPhoneLabel: '- Teléfono:',
    customerEmailLabel: '- Correo electrónico:',
    deliveryMethodLabel: '- Método de entrega:',
    deliveryMethods: {
      esim_email: 'eSIM enviado por Email / WhatsApp',
      home_delivery: 'Envío a domicilio (Japón / Vietnam)',
      airport_pickup: 'Recogida en el mostrador del aeropuerto'
    },
    notesLabel: '- Nota:',
    closingNote: '¡Por favor, ayúdenme a completar el registro de este plan! ¡Muchas gracias!'
  }
};

/**
 * Get translated product name and description based on product ID & target language
 */
export const getLocalizedProductInfo = (
  product: ProductData,
  lang: SupportedLang
): { name: string; description: string } => {
  if (lang === 'vi') {
    return { name: product.name, description: product.description };
  }

  // Check static dictionary if product ID is recognized
  if (product.id && PRODUCT_TRANSLATIONS[product.id]) {
    const matched = PRODUCT_TRANSLATIONS[product.id]![lang];
    if (matched) {
      return matched;
    }
  }

  // Check matching by Vietnamese name
  for (const pid of Object.keys(PRODUCT_TRANSLATIONS)) {
    const item = PRODUCT_TRANSLATIONS[pid];
    if (item && item.vi && item.vi.name === product.name && item[lang]) {
      return item[lang]!;
    }
  }

  // Fallback: return product's original name and description
  return {
    name: product.name,
    description: product.description
  };
};

/**
 * Build the full WhatsApp message in the user's selected language
 */
export const buildMultilingualWhatsAppMessage = (
  product: ProductData,
  siteName = 'WifiGo Japan',
  customerDetails?: CustomerOrderDetails,
  langCode?: string
): string => {
  const activeLang = getActiveLanguage(langCode);
  const t = LOCALE_TEMPLATES[activeLang] || LOCALE_TEMPLATES.vi;
  const localizedProduct = getLocalizedProductInfo(product, activeLang);

  const formattedYen = `¥${new Intl.NumberFormat('ja-JP').format(product.monthlyPriceJPY)}`;
  const priceDisplay = t.pricePerMonth(formattedYen);
  const stockDisplay = product.inStock !== false ? t.inStockText : t.outOfStockText;

  let msg = `${t.greeting(siteName)}\n\n`;
  msg += `${t.planNameLabel} ${localizedProduct.name}\n`;
  msg += `${t.monthlyPriceLabel} ${priceDisplay}\n`;
  msg += `${t.statusLabel} ${stockDisplay}\n\n`;
  msg += `${t.detailsLabel}\n${localizedProduct.description.trim()}\n`;

  if (customerDetails) {
    const hasAnyField = customerDetails.orderId ||
      customerDetails.customerName ||
      customerDetails.customerPhone ||
      customerDetails.customerEmail ||
      customerDetails.deliveryMethod ||
      customerDetails.notes;

    if (hasAnyField) {
      msg += `\n──────────────\n`;
      msg += `${t.registrationHeader}\n`;
      if (customerDetails.orderId) {
        msg += `${t.orderIdLabel} ${customerDetails.orderId}\n`;
      }
      if (customerDetails.customerName) {
        msg += `${t.customerNameLabel} ${customerDetails.customerName}\n`;
      }
      if (customerDetails.customerPhone) {
        msg += `${t.customerPhoneLabel} ${customerDetails.customerPhone}\n`;
      }
      if (customerDetails.customerEmail) {
        msg += `${t.customerEmailLabel} ${customerDetails.customerEmail}\n`;
      }
      if (customerDetails.deliveryMethod) {
        const methodDisplay = t.deliveryMethods[customerDetails.deliveryMethod] || customerDetails.deliveryMethod;
        msg += `${t.deliveryMethodLabel} ${methodDisplay}\n`;
      }
      if (customerDetails.notes) {
        msg += `${t.notesLabel} ${customerDetails.notes}\n`;
      }
    }
  }

  msg += `\n${t.closingNote}`;
  return msg;
};
