/**
 * Script to add missing translation keys to all language JSON files
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const translationsDir = join(__dirname, '..', 'src', 'data', 'translations');

// Missing keys to add with translations for all languages
const missingKeys = {
  en: {
    timer: {
      durationMode: 'Duration Mode',
      countdownMode: 'Countdown to Date'
    },
    alarm: {
      placeholderTitle: 'Wake up!',
      alarmRinging: 'Alarm!',
      timesUp: 'Time\'s up!',
      dismissAlarm: 'Dismiss Alarm',
      alarmSetFor: 'Alarm set for {time} (in {hours}h {minutes}m)',
      in: 'in',
      alarmTitle: 'ALARM!',
      sounds: {
        classicAlarm: 'Classic Alarm',
        beepBeep: 'Beep Beep',
        rooster: 'Rooster',
        bell: 'Bell',
        chime: 'Chime',
        digital: 'Digital'
      }
    }
  },
  es: {
    timer: { durationMode: 'Modo de Duración', countdownMode: 'Cuenta Regresiva a Fecha' },
    alarm: { placeholderTitle: '¡Despierta!', alarmRinging: '¡Alarma!', timesUp: '¡Se acabó el tiempo!', dismissAlarm: 'Descartar Alarma', alarmSetFor: 'Alarma configurada para {time} (en {hours}h {minutes}m)', in: 'en', alarmTitle: '¡ALARMA!', sounds: { classicAlarm: 'Alarma Clásica', beepBeep: 'Bip Bip', rooster: 'Gallo', bell: 'Campana', chime: 'Carillón', digital: 'Digital' } }
  },
  fr: {
    timer: { durationMode: 'Mode Durée', countdownMode: 'Compte à Rebours vers Date' },
    alarm: { placeholderTitle: 'Réveillez-vous !', alarmRinging: 'Alarme !', timesUp: 'Temps écoulé !', dismissAlarm: 'Ignorer l\'Alarme', alarmSetFor: 'Alarme réglée pour {time} (dans {hours}h {minutes}m)', in: 'dans', alarmTitle: 'ALARME !', sounds: { classicAlarm: 'Alarme Classique', beepBeep: 'Bip Bip', rooster: 'Coq', bell: 'Cloche', chime: 'Carillon', digital: 'Numérique' } }
  },
  de: {
    timer: { durationMode: 'Dauer-Modus', countdownMode: 'Countdown zu Datum' },
    alarm: { placeholderTitle: 'Aufwachen!', alarmRinging: 'Alarm!', timesUp: 'Zeit ist um!', dismissAlarm: 'Alarm Beenden', alarmSetFor: 'Alarm gestellt für {time} (in {hours}h {minutes}m)', in: 'in', alarmTitle: 'ALARM!', sounds: { classicAlarm: 'Klassischer Alarm', beepBeep: 'Piep Piep', rooster: 'Hahn', bell: 'Glocke', chime: 'Glockenspiel', digital: 'Digital' } }
  },
  pt: {
    timer: { durationMode: 'Modo de Duração', countdownMode: 'Contagem Regressiva para Data' },
    alarm: { placeholderTitle: 'Acorde!', alarmRinging: 'Alarme!', timesUp: 'Tempo esgotado!', dismissAlarm: 'Dispensar Alarme', alarmSetFor: 'Alarme definido para {time} (em {hours}h {minutes}m)', in: 'em', alarmTitle: 'ALARME!', sounds: { classicAlarm: 'Alarme Clássico', beepBeep: 'Bip Bip', rooster: 'Galo', bell: 'Sino', chime: 'Carrilhão', digital: 'Digital' } }
  },
  it: {
    timer: { durationMode: 'Modalità Durata', countdownMode: 'Conto alla Rovescia a Data' },
    alarm: { placeholderTitle: 'Svegliati!', alarmRinging: 'Allarme!', timesUp: 'Tempo scaduto!', dismissAlarm: 'Ignora Allarme', alarmSetFor: 'Allarme impostato per {time} (tra {hours}h {minutes}m)', in: 'tra', alarmTitle: 'ALLARME!', sounds: { classicAlarm: 'Allarme Classico', beepBeep: 'Bip Bip', rooster: 'Gallo', bell: 'Campana', chime: 'Carillon', digital: 'Digitale' } }
  },
  ru: {
    timer: { durationMode: 'Режим Длительности', countdownMode: 'Обратный Отсчет до Даты' },
    alarm: { placeholderTitle: 'Просыпайтесь!', alarmRinging: 'Будильник!', timesUp: 'Время вышло!', dismissAlarm: 'Отключить Будильник', alarmSetFor: 'Будильник установлен на {time} (через {hours}ч {minutes}м)', in: 'через', alarmTitle: 'БУДИЛЬНИК!', sounds: { classicAlarm: 'Классический Будильник', beepBeep: 'Бип-Бип', rooster: 'Петух', bell: 'Колокол', chime: 'Звон', digital: 'Цифровой' } }
  },
  ja: {
    timer: { durationMode: '所要時間モード', countdownMode: '日付までのカウントダウン' },
    alarm: { placeholderTitle: '起きて!', alarmRinging: 'アラーム!', timesUp: '時間切れ!', dismissAlarm: 'アラームを解除', alarmSetFor: '{time}にアラームを設定しました（{hours}時間{minutes}分後）', in: '後', alarmTitle: 'アラーム!', sounds: { classicAlarm: 'クラシックアラーム', beepBeep: 'ビープ音', rooster: 'ニワトリ', bell: 'ベル', chime: 'チャイム', digital: 'デジタル' } }
  },
  ko: {
    timer: { durationMode: '기간 모드', countdownMode: '날짜까지 카운트다운' },
    alarm: { placeholderTitle: '일어나세요!', alarmRinging: '알람!', timesUp: '시간 종료!', dismissAlarm: '알람 해제', alarmSetFor: '{time}에 알람 설정됨 ({hours}시간 {minutes}분 후)', in: '후', alarmTitle: '알람!', sounds: { classicAlarm: '클래식 알람', beepBeep: '삐삐', rooster: '수탉', bell: '종', chime: '차임벨', digital: '디지털' } }
  },
  'zh-CN': {
    timer: { durationMode: '持续时间模式', countdownMode: '倒计时到日期' },
    alarm: { placeholderTitle: '起床了！', alarmRinging: '闹钟！', timesUp: '时间到！', dismissAlarm: '关闭闹钟', alarmSetFor: '闹钟设置为{time}（{hours}小时{minutes}分钟后）', in: '后', alarmTitle: '闹钟！', sounds: { classicAlarm: '经典闹钟', beepBeep: '哔哔声', rooster: '公鸡', bell: '铃声', chime: '钟声', digital: '数字' } }
  },
  'zh-HK': {
    timer: { durationMode: '持續時間模式', countdownMode: '倒數到日期' },
    alarm: { placeholderTitle: '起床了！', alarmRinging: '鬧鐘！', timesUp: '時間到！', dismissAlarm: '關閉鬧鐘', alarmSetFor: '鬧鐘設置為{time}（{hours}小時{minutes}分鐘後）', in: '後', alarmTitle: '鬧鐘！', sounds: { classicAlarm: '經典鬧鐘', beepBeep: '嗶嗶聲', rooster: '公雞', bell: '鈴聲', chime: '鐘聲', digital: '數碼' } }
  },
  ar: {
    timer: { durationMode: 'وضع المدة', countdownMode: 'العد التنازلي إلى التاريخ' },
    alarm: { placeholderTitle: 'استيقظ!', alarmRinging: 'منبه!', timesUp: 'انتهى الوقت!', dismissAlarm: 'إيقاف المنبه', alarmSetFor: 'تم ضبط المنبه على {time} (بعد {hours}س {minutes}د)', in: 'بعد', alarmTitle: 'منبه!', sounds: { classicAlarm: 'منبه كلاسيكي', beepBeep: 'بيب بيب', rooster: 'ديك', bell: 'جرس', chime: 'رنين', digital: 'رقمي' } }
  },
  hi: {
    timer: { durationMode: 'अवधि मोड', countdownMode: 'तिथि तक उलटी गिनती' },
    alarm: { placeholderTitle: 'जाग जाओ!', alarmRinging: 'अलार्म!', timesUp: 'समय समाप्त!', dismissAlarm: 'अलार्म बंद करें', alarmSetFor: '{time} के लिए अलार्म सेट किया गया ({hours}घं {minutes}मि में)', in: 'में', alarmTitle: 'अलार्म!', sounds: { classicAlarm: 'क्लासिक अलार्म', beepBeep: 'बीप बीप', rooster: 'मुर्गा', bell: 'घंटी', chime: 'झंकार', digital: 'डिजिटल' } }
  },
  bn: {
    timer: { durationMode: 'সময়কাল মোড', countdownMode: 'তারিখ পর্যন্ত কাউন্টডাউন' },
    alarm: { placeholderTitle: 'জেগে ওঠো!', alarmRinging: 'অ্যালার্ম!', timesUp: 'সময় শেষ!', dismissAlarm: 'অ্যালার্ম বন্ধ করুন', alarmSetFor: '{time} এর জন্য অ্যালার্ম সেট করা হয়েছে ({hours}ঘ {minutes}মি পরে)', in: 'পরে', alarmTitle: 'অ্যালার্ম!', sounds: { classicAlarm: 'ক্লাসিক অ্যালার্ম', beepBeep: 'বীপ বীপ', rooster: 'মোরগ', bell: 'ঘণ্টা', chime: 'ঝংকার', digital: 'ডিজিটাল' } }
  },
  id: {
    timer: { durationMode: 'Mode Durasi', countdownMode: 'Hitung Mundur ke Tanggal' },
    alarm: { placeholderTitle: 'Bangun!', alarmRinging: 'Alarm!', timesUp: 'Waktu habis!', dismissAlarm: 'Matikan Alarm', alarmSetFor: 'Alarm diatur untuk {time} (dalam {hours}j {minutes}m)', in: 'dalam', alarmTitle: 'ALARM!', sounds: { classicAlarm: 'Alarm Klasik', beepBeep: 'Bip Bip', rooster: 'Ayam Jago', bell: 'Lonceng', chime: 'Dentang', digital: 'Digital' } }
  },
  tr: {
    timer: { durationMode: 'Süre Modu', countdownMode: 'Tarihe Geri Sayım' },
    alarm: { placeholderTitle: 'Uyan!', alarmRinging: 'Alarm!', timesUp: 'Süre doldu!', dismissAlarm: 'Alarmı Kapat', alarmSetFor: '{time} için alarm kuruldu ({hours}s {minutes}d içinde)', in: 'içinde', alarmTitle: 'ALARM!', sounds: { classicAlarm: 'Klasik Alarm', beepBeep: 'Bip Bip', rooster: 'Horoz', bell: 'Çan', chime: 'Zil Sesi', digital: 'Dijital' } }
  },
  vi: {
    timer: { durationMode: 'Chế độ Thời lượng', countdownMode: 'Đếm ngược đến Ngày' },
    alarm: { placeholderTitle: 'Thức dậy!', alarmRinging: 'Báo thức!', timesUp: 'Hết giờ!', dismissAlarm: 'Tắt Báo thức', alarmSetFor: 'Đã đặt báo thức lúc {time} (sau {hours}g {minutes}p)', in: 'sau', alarmTitle: 'BÁO THỨC!', sounds: { classicAlarm: 'Báo thức Cổ điển', beepBeep: 'Bíp Bíp', rooster: 'Gà trống', bell: 'Chuông', chime: 'Tiếng chuông', digital: 'Kỹ thuật số' } }
  },
  pl: {
    timer: { durationMode: 'Tryb Czasu Trwania', countdownMode: 'Odliczanie do Daty' },
    alarm: { placeholderTitle: 'Obudź się!', alarmRinging: 'Alarm!', timesUp: 'Czas minął!', dismissAlarm: 'Wyłącz Alarm', alarmSetFor: 'Alarm ustawiony na {time} (za {hours}godz {minutes}min)', in: 'za', alarmTitle: 'ALARM!', sounds: { classicAlarm: 'Klasyczny Alarm', beepBeep: 'Bip Bip', rooster: 'Kogut', bell: 'Dzwonek', chime: 'Dzwon', digital: 'Cyfrowy' } }
  },
  nl: {
    timer: { durationMode: 'Duurmodus', countdownMode: 'Aftellen naar Datum' },
    alarm: { placeholderTitle: 'Wordt wakker!', alarmRinging: 'Alarm!', timesUp: 'Tijd is om!', dismissAlarm: 'Alarm Negeren', alarmSetFor: 'Alarm ingesteld voor {time} (over {hours}u {minutes}m)', in: 'over', alarmTitle: 'ALARM!', sounds: { classicAlarm: 'Klassiek Alarm', beepBeep: 'Piep Piep', rooster: 'Haan', bell: 'Bel', chime: 'Klokkenspel', digital: 'Digitaal' } }
  },
  th: {
    timer: { durationMode: 'โหมดระยเวลา', countdownMode: 'นับถอยหลังถึงวันที่' },
    alarm: { placeholderTitle: 'ตื่นได้แล้ว!', alarmRinging: 'นาฬิกาปลุก!', timesUp: 'หมดเวลา!', dismissAlarm: 'ปิดนาฬิกาปลุก', alarmSetFor: 'ตั้งนาฬิกาปลุกไว้ที่ {time} (ใน {hours}ชม. {minutes}น.)', in: 'ใน', alarmTitle: 'นาฬิกาปลุก!', sounds: { classicAlarm: 'นาฬิกาปลุกคลาสสิก', beepBeep: 'เสียงบี๊บ', rooster: 'ไก่ขัน', bell: 'กระดิ่ง', chime: 'เสียงระฆัง', digital: 'ดิจิทัล' } }
  },
  pa: {
    timer: { durationMode: 'ਮਿਆਦ ਮੋਡ', countdownMode: 'ਮਿਤੀ ਤੱਕ ਉਲਟੀ ਗਿਣਤੀ' },
    alarm: { placeholderTitle: 'ਜਾਗ ਜਾਓ!', alarmRinging: 'ਅਲਾਰਮ!', timesUp: 'ਸਮਾਂ ਖਤਮ!', dismissAlarm: 'ਅਲਾਰਮ ਬੰਦ ਕਰੋ', alarmSetFor: '{time} ਲਈ ਅਲਾਰਮ ਸੈੱਟ ਕੀਤਾ ({hours}ਘੰ {minutes}ਮਿੰ ਵਿੱਚ)', in: 'ਵਿੱਚ', alarmTitle: 'ਅਲਾਰਮ!', sounds: { classicAlarm: 'ਕਲਾਸਿਕ ਅਲਾਰਮ', beepBeep: 'ਬੀਪ ਬੀਪ', rooster: 'ਮੁਰਗਾ', bell: 'ਘੰਟੀ', chime: 'ਝੰਕਾਰ', digital: 'ਡਿਜੀਟਲ' } }
  },
  mr: {
    timer: { durationMode: 'कालावधी मोड', countdownMode: 'तारखेपर्यंत उलटी मोजणी' },
    alarm: { placeholderTitle: 'जागे व्हा!', alarmRinging: 'अलार्म!', timesUp: 'वेळ संपली!', dismissAlarm: 'अलार्म बंद करा', alarmSetFor: '{time} साठी अलार्म सेट केला ({hours}ता {minutes}मि मध्ये)', in: 'मध्ये', alarmTitle: 'अलार्म!', sounds: { classicAlarm: 'क्लासिक अलार्म', beepBeep: 'बीप बीप', rooster: 'कोंबडा', bell: 'घंटा', chime: 'नाद', digital: 'डिजिटल' } }
  },
  te: {
    timer: { durationMode: 'వ్యవధి మోడ్', countdownMode: 'తేదీ వరకు కౌంట్‌డౌన్' },
    alarm: { placeholderTitle: 'మేల్కొనండి!', alarmRinging: 'అలారం!', timesUp: 'సమయం ముగిసింది!', dismissAlarm: 'అలారం మూసివేయండి', alarmSetFor: '{time} కు అలారం సెట్ చేయబడింది ({hours}గం {minutes}ని లో)', in: 'లో', alarmTitle: 'అలారం!', sounds: { classicAlarm: 'క్లాసిక్ అలారం', beepBeep: 'బీప్ బీప్', rooster: 'కోడి', bell: 'గంట', chime: 'మ్రోత', digital: 'డిజిటల్' } }
  },
  ta: {
    timer: { durationMode: 'காலஅளவு பயன்முறை', countdownMode: 'தேதி வரை கவுண்ட்டவுன்' },
    alarm: { placeholderTitle: 'எழுந்திருங்கள்!', alarmRinging: 'அலாரம்!', timesUp: 'நேரம் முடிந்தது!', dismissAlarm: 'அலாரத்தை நிறுத்து', alarmSetFor: '{time} க்கு அலாரம் அமைக்கப்பட்டது ({hours}ம {minutes}நி இல்)', in: 'இல்', alarmTitle: 'அலாரம்!', sounds: { classicAlarm: 'கிளாசிக் அலாரம்', beepBeep: 'பீப் பீப்', rooster: 'சேவல்', bell: 'மணி', chime: 'சங்கு', digital: 'டிஜிட்டல்' } }
  },
  gu: {
    timer: { durationMode: 'અવધિ મોડ', countdownMode: 'તારીખ સુધી કાઉન્ટડાઉન' },
    alarm: { placeholderTitle: 'જાગો!', alarmRinging: 'અલાર્મ!', timesUp: 'સમય પૂરો થયો!', dismissAlarm: 'અલાર્મ બંધ કરો', alarmSetFor: '{time} માટે અલાર્મ સેટ કર્યો ({hours}કલાક {minutes}મિનિટમાં)', in: 'માં', alarmTitle: 'અલાર્મ!', sounds: { classicAlarm: 'ક્લાસિક અલાર્મ', beepBeep: 'બીપ બીપ', rooster: 'કૂકડો', bell: 'ઘંટ', chime: 'ઘંટનાદ', digital: 'ડિજિટલ' } }
  },
  kn: {
    timer: { durationMode: 'ಅವಧಿ ಮೋಡ್', countdownMode: 'ದಿನಾಂಕದವರೆಗೆ ಕೌಂಟ್‌ಡೌನ್' },
    alarm: { placeholderTitle: 'ಎಚ್ಚರಗೊಳ್ಳಿ!', alarmRinging: 'ಅಲಾರಂ!', timesUp: 'ಸಮಯ ಮುಗಿಯಿತು!', dismissAlarm: 'ಅಲಾರಂ ಮುಚ್ಚಿ', alarmSetFor: '{time} ಗೆ ಅಲಾರಂ ಹೊಂದಿಸಲಾಗಿದೆ ({hours}ಗಂ {minutes}ನಿ ನಲ್ಲಿ)', in: 'ನಲ್ಲಿ', alarmTitle: 'ಅಲಾರಂ!', sounds: { classicAlarm: 'ಕ್ಲಾಸಿಕ್ ಅಲಾರಂ', beepBeep: 'ಬೀಪ್ ಬೀಪ್', rooster: 'ಕೋಳಿ', bell: 'ಗಂಟೆ', chime: 'ಘಂಟಾನಾದ', digital: 'ಡಿಜಿಟಲ್' } }
  },
  ml: {
    timer: { durationMode: 'ദൈർഘ്യ മോഡ്', countdownMode: 'തീയതി വരെ കൗണ്ട്ഡൗൺ' },
    alarm: { placeholderTitle: 'എഴുന്നേൽക്കൂ!', alarmRinging: 'അലാറം!', timesUp: 'സമയം കഴിഞ്ഞു!', dismissAlarm: 'അലാറം അടയ്ക്കുക', alarmSetFor: '{time} ന് അലാറം സജ്ജീകരിച്ചു ({hours}മ {minutes}മി യിൽ)', in: 'യിൽ', alarmTitle: 'അലാറം!', sounds: { classicAlarm: 'ക്ലാസിക് അലാറം', beepBeep: 'ബീപ് ബീപ്', rooster: 'കോഴി', bell: 'മണി', chime: 'മണിനാദം', digital: 'ഡിജിറ്റൽ' } }
  },
  or: {
    timer: { durationMode: 'ଅବଧି ମୋଡ୍', countdownMode: 'ତାରିଖ ପର୍ଯ୍ୟନ୍ତ କାଉଣ୍ଟଡାଉନ୍' },
    alarm: { placeholderTitle: 'ଉଠ!', alarmRinging: 'ଆଲାର୍ମ!', timesUp: 'ସମୟ ସରିଲା!', dismissAlarm: 'ଆଲାର୍ମ ବନ୍ଦ କରନ୍ତୁ', alarmSetFor: '{time} ପାଇଁ ଆଲାର୍ମ ସେଟ୍ ହୋଇଛି ({hours}ଘ {minutes}ମି ରେ)', in: 'ରେ', alarmTitle: 'ଆଲାର୍ମ!', sounds: { classicAlarm: 'କ୍ଲାସିକ୍ ଆଲାର୍ମ', beepBeep: 'ବିପ୍ ବିପ୍', rooster: 'କୁକୁଡ଼ା', bell: 'ଘଣ୍ଟି', chime: 'ଝଙ୍କାର', digital: 'ଡିଜିଟାଲ୍' } }
  },
  sd: {
    timer: { durationMode: 'مدت موڊ', countdownMode: 'تاريخ تائين ڳڻپ' },
    alarm: { placeholderTitle: 'جاڳو!', alarmRinging: 'الارم!', timesUp: 'وقت ختم!', dismissAlarm: 'الارم بند ڪريو', alarmSetFor: '{time} لاءِ الارم سيٽ ڪيو ({hours}ڪ {minutes}م ۾)', in: '۾', alarmTitle: 'الارم!', sounds: { classicAlarm: 'ڪلاسڪ الارم', beepBeep: 'بيپ بيپ', rooster: 'ڪڪڙ', bell: 'گھنٽي', chime: 'آواز', digital: 'ڊجيٽل' } }
  },
  ne: {
    timer: { durationMode: 'अवधि मोड', countdownMode: 'मिति सम्म काउन्टडाउन' },
    alarm: { placeholderTitle: 'उठ्नुहोस्!', alarmRinging: 'अलार्म!', timesUp: 'समय सकियो!', dismissAlarm: 'अलार्म बन्द गर्नुहोस्', alarmSetFor: '{time} को लागि अलार्म सेट गरियो ({hours}घ {minutes}मि मा)', in: 'मा', alarmTitle: 'अलार्म!', sounds: { classicAlarm: 'क्लासिक अलार्म', beepBeep: 'बीप बीप', rooster: 'भाले', bell: 'घण्टी', chime: 'घन्टाको आवाज', digital: 'डिजिटल' } }
  },
  ur: {
    timer: { durationMode: 'مدت موڈ', countdownMode: 'تاریخ تک الٹی گنتی' },
    alarm: { placeholderTitle: 'اٹھو!', alarmRinging: 'الارم!', timesUp: 'وقت ختم!', dismissAlarm: 'الارم بند کریں', alarmSetFor: '{time} کے لیے الارم سیٹ کیا ({hours}گھ {minutes}م میں)', in: 'میں', alarmTitle: 'الارم!', sounds: { classicAlarm: 'کلاسک الارم', beepBeep: 'بیپ بیپ', rooster: 'مرغا', bell: 'گھنٹی', chime: 'جھنکار', digital: 'ڈیجیٹل' } }
  },
  ms: {
    timer: { durationMode: 'Mod Tempoh', countdownMode: 'Kira Detik ke Tarikh' },
    alarm: { placeholderTitle: 'Bangun!', alarmRinging: 'Penggera!', timesUp: 'Masa tamat!', dismissAlarm: 'Tutup Penggera', alarmSetFor: 'Penggera ditetapkan untuk {time} (dalam {hours}j {minutes}m)', in: 'dalam', alarmTitle: 'PENGGERA!', sounds: { classicAlarm: 'Penggera Klasik', beepBeep: 'Bip Bip', rooster: 'Ayam Jantan', bell: 'Loceng', chime: 'Dentingan', digital: 'Digital' } }
  },
  fil: {
    timer: { durationMode: 'Mode ng Tagal', countdownMode: 'Countdown sa Petsa' },
    alarm: { placeholderTitle: 'Gising!', alarmRinging: 'Alarm!', timesUp: 'Tapos na ang oras!', dismissAlarm: 'Patayin ang Alarm', alarmSetFor: 'Alarm nakatakda sa {time} (sa loob ng {hours}o {minutes}m)', in: 'sa loob ng', alarmTitle: 'ALARM!', sounds: { classicAlarm: 'Classic na Alarm', beepBeep: 'Beep Beep', rooster: 'Tandang', bell: 'Kampana', chime: 'Tugtog ng Kampana', digital: 'Digital' } }
  },
  jv: {
    timer: { durationMode: 'Mode Durasi', countdownMode: 'Countdown menyang Tanggal' },
    alarm: { placeholderTitle: 'Tangi!', alarmRinging: 'Alarm!', timesUp: 'Wektune wis rampung!', dismissAlarm: 'Pateni Alarm', alarmSetFor: 'Alarm disetel kanggo {time} (ing {hours}j {minutes}m)', in: 'ing', alarmTitle: 'ALARM!', sounds: { classicAlarm: 'Alarm Klasik', beepBeep: 'Bip Bip', rooster: 'Jago', bell: 'Lonceng', chime: 'Genta', digital: 'Digital' } }
  },
  su: {
    timer: { durationMode: 'Mode Durasi', countdownMode: 'Itungan Mundur ka Tanggal' },
    alarm: { placeholderTitle: 'Hudang!', alarmRinging: 'Alarm!', timesUp: 'Waktuna geus réngsé!', dismissAlarm: 'Pareuman Alarm', alarmSetFor: 'Alarm disetél pikeun {time} (dina {hours}j {minutes}m)', in: 'dina', alarmTitle: 'ALARM!', sounds: { classicAlarm: 'Alarm Klasik', beepBeep: 'Bip Bip', rooster: 'Jago', bell: 'Lonceng', chime: 'Genta', digital: 'Digital' } }
  },
  my: {
    timer: { durationMode: 'ကြာချိန်မုဒ်', countdownMode: 'ရက်စွဲသို့ ရေတွက်ခြင်း' },
    alarm: { placeholderTitle: 'နိုးလာ!', alarmRinging: 'နှိုးစက်!', timesUp: 'အချိန်ကုန်ပြီ!', dismissAlarm: 'နှိုးစက်ပိတ်ရန်', alarmSetFor: '{time} အတွက် နှိုးစက်သတ်မှတ်ထားသည် ({hours}နာရီ {minutes}မိနစ်အတွင်း)', in: 'အတွင်း', alarmTitle: 'နှိုးစက်!', sounds: { classicAlarm: 'ဂန္တဝင် နှိုးစက်', beepBeep: 'ဘိပ် ဘိပ်', rooster: 'ကြက်ဖ', bell: 'ခေါင်းလောင်း', chime: 'ခေါင်းလောင်းသံ', digital: 'ဒစ်ဂျစ်တယ်' } }
  },
  fa: {
    timer: { durationMode: 'حالت مدت زمان', countdownMode: 'شمارش معکوس به تاریخ' },
    alarm: { placeholderTitle: 'بیدار شو!', alarmRinging: 'زنگ هشدار!', timesUp: 'زمان تمام شد!', dismissAlarm: 'خاموش کردن زنگ', alarmSetFor: 'زنگ برای {time} تنظیم شد (در {hours}س {minutes}د)', in: 'در', alarmTitle: 'زنگ هشدار!', sounds: { classicAlarm: 'زنگ کلاسیک', beepBeep: 'بوق بوق', rooster: 'خروس', bell: 'زنگ', chime: 'صدای زنگ', digital: 'دیجیتال' } }
  },
  am: {
    timer: { durationMode: 'የጊዜ ርዝመት ሁነታ', countdownMode: 'ወደ ቀን ቆጠራ' },
    alarm: { placeholderTitle: 'ንቁ!', alarmRinging: 'ማንቂያ!', timesUp: 'ጊዜው አብቅቷል!', dismissAlarm: 'ማንቂያ አጥፋ', alarmSetFor: 'ማንቂያ ለ {time} ተዘጋጅቷል (በ {hours}ሰ {minutes}ደ ውስጥ)', in: 'ውስጥ', alarmTitle: 'ማንቂያ!', sounds: { classicAlarm: 'ክላሲክ ማንቂያ', beepBeep: 'ቢፕ ቢፕ', rooster: 'ዶሮ', bell: 'ደወል', chime: 'የደወል ድምፅ', digital: 'ዲጂታል' } }
  },
  he: {
    timer: { durationMode: 'מצב משך זמן', countdownMode: 'ספירה לאחור לתאריך' },
    alarm: { placeholderTitle: '!התעורר', alarmRinging: '!התראה', timesUp: '!הזמן נגמר', dismissAlarm: 'סגור התראה', alarmSetFor: 'התראה הוגדרה ל-{time} (בעוד {hours}ש {minutes}ד)', in: 'בעוד', alarmTitle: '!התראה', sounds: { classicAlarm: 'התראה קלאסית', beepBeep: 'ביפ ביפ', rooster: 'תרנגול', bell: 'פעמון', chime: 'צלצול', digital: 'דיגיטלי' } }
  },
  ha: {
    timer: { durationMode: 'Yanayin Tsawon Lokaci', countdownMode: 'Ƙirga zuwa Kwanan Wata' },
    alarm: { placeholderTitle: 'Farka!', alarmRinging: 'Ƙararrawa!', timesUp: 'Lokaci ya ƙare!', dismissAlarm: 'Kashe Ƙararrawa', alarmSetFor: 'An saita ƙararrawa don {time} (cikin {hours}a {minutes}m)', in: 'cikin', alarmTitle: 'ƘARARRAWA!', sounds: { classicAlarm: 'Ƙararrawa na Gargajiya', beepBeep: 'Bip Bip', rooster: 'Zakara', bell: 'Kararrawa', chime: 'Ƙararrawa', digital: 'Dijital' } }
  },
  yo: {
    timer: { durationMode: 'Ipo Akoko Gigun', countdownMode: 'Kika si Ojo' },
    alarm: { placeholderTitle: 'Ji!', alarmRinging: 'Afọwọkọ!', timesUp: 'Akoko ti pari!', dismissAlarm: 'Pa Afọwọkọ', alarmSetFor: 'Afọwọkọ ti ṣeto fun {time} (ni {hours}w {minutes}i)', in: 'ni', alarmTitle: 'AFỌWỌKỌ!', sounds: { classicAlarm: 'Afọwọkọ Atọwọdọwọ', beepBeep: 'Biipu Biipu', rooster: 'Akuko', bell: 'Agogo', chime: 'Ohun Agogo', digital: 'Dijitali' } }
  },
  ig: {
    timer: { durationMode: 'Ọnọdụ Ogologo Oge', countdownMode: 'Ngụkọ ruo Ụbọchị' },
    alarm: { placeholderTitle: 'Teta!', alarmRinging: 'Mkpu!', timesUp: 'Oge agwụla!', dismissAlarm: 'Mechie Mkpu', alarmSetFor: 'E debere mkpu maka {time} (n\'ime {hours}a {minutes}n)', in: 'n\'ime', alarmTitle: 'MKPU!', sounds: { classicAlarm: 'Mkpu Ochie', beepBeep: 'Biipu Biipu', rooster: 'Ọkụkọ', bell: 'Mgbịrịgba', chime: 'Ụda Mgbịrịgba', digital: 'Dijitalụ' } }
  },
  sw: {
    timer: { durationMode: 'Hali ya Muda', countdownMode: 'Hesabu Mpaka Tarehe' },
    alarm: { placeholderTitle: 'Amka!', alarmRinging: 'Kengele!', timesUp: 'Muda umeisha!', dismissAlarm: 'Zima Kengele', alarmSetFor: 'Kengele imewekwa kwa {time} (ndani ya {hours}s {minutes}d)', in: 'ndani ya', alarmTitle: 'KENGELE!', sounds: { classicAlarm: 'Kengele ya Kawaida', beepBeep: 'Bipu Bipu', rooster: 'Jogoo', bell: 'Kengele', chime: 'Sauti ya Kengele', digital: 'Dijitali' } }
  },
  uk: {
    timer: { durationMode: 'Режим Тривалості', countdownMode: 'Зворотний Відлік до Дати' },
    alarm: { placeholderTitle: 'Прокидайся!', alarmRinging: 'Будильник!', timesUp: 'Час вийшов!', dismissAlarm: 'Вимкнути Будильник', alarmSetFor: 'Будильник встановлено на {time} (через {hours}год {minutes}хв)', in: 'через', alarmTitle: 'БУДИЛЬНИК!', sounds: { classicAlarm: 'Класичний Будильник', beepBeep: 'Біп-Біп', rooster: 'Півень', bell: 'Дзвін', chime: 'Дзвоник', digital: 'Цифровий' } }
  },
  ro: {
    timer: { durationMode: 'Mod Durată', countdownMode: 'Numărătoare Inversă până la Dată' },
    alarm: { placeholderTitle: 'Trezește-te!', alarmRinging: 'Alarmă!', timesUp: 'Timpul a expirat!', dismissAlarm: 'Închide Alarma', alarmSetFor: 'Alarmă setată pentru {time} (peste {hours}o {minutes}m)', in: 'peste', alarmTitle: 'ALARMĂ!', sounds: { classicAlarm: 'Alarmă Clasică', beepBeep: 'Bip Bip', rooster: 'Cocoș', bell: 'Clopot', chime: 'Dangăt', digital: 'Digital' } }
  },
  cs: {
    timer: { durationMode: 'Režim Trvání', countdownMode: 'Odpočítávání k Datu' },
    alarm: { placeholderTitle: 'Probuď se!', alarmRinging: 'Budík!', timesUp: 'Čas vypršel!', dismissAlarm: 'Vypnout Budík', alarmSetFor: 'Budík nastaven na {time} (za {hours}h {minutes}m)', in: 'za', alarmTitle: 'BUDÍK!', sounds: { classicAlarm: 'Klasický Budík', beepBeep: 'Pípnutí', rooster: 'Kohout', bell: 'Zvonek', chime: 'Zvon', digital: 'Digitální' } }
  },
  el: {
    timer: { durationMode: 'Λειτουργία Διάρκειας', countdownMode: 'Αντίστροφη Μέτρηση σε Ημερομηνία' },
    alarm: { placeholderTitle: 'Ξύπνα!', alarmRinging: 'Ξυπνητήρι!', timesUp: 'Ο χρόνος τελείωσε!', dismissAlarm: 'Απόρριψη Ξυπνητηριού', alarmSetFor: 'Το ξυπνητήρι ορίστηκε για {time} (σε {hours}ω {minutes}λ)', in: 'σε', alarmTitle: 'ΞΥΠΝΗΤΗΡΙ!', sounds: { classicAlarm: 'Κλασικό Ξυπνητήρι', beepBeep: 'Μπιπ Μπιπ', rooster: 'Κόκορας', bell: 'Καμπάνα', chime: 'Κουδούνισμα', digital: 'Ψηφιακό' } }
  },
  sv: {
    timer: { durationMode: 'Varaktighetsläge', countdownMode: 'Nedräkning till Datum' },
    alarm: { placeholderTitle: 'Vakna!', alarmRinging: 'Alarm!', timesUp: 'Tiden är ute!', dismissAlarm: 'Stäng av Alarm', alarmSetFor: 'Alarm inställt för {time} (om {hours}t {minutes}m)', in: 'om', alarmTitle: 'ALARM!', sounds: { classicAlarm: 'Klassiskt Alarm', beepBeep: 'Pip Pip', rooster: 'Tupp', bell: 'Klocka', chime: 'Klockspel', digital: 'Digital' } }
  },
  hu: {
    timer: { durationMode: 'Időtartam Mód', countdownMode: 'Visszaszámlálás Dátumig' },
    alarm: { placeholderTitle: 'Ébredj!', alarmRinging: 'Ébresztő!', timesUp: 'Lejárt az idő!', dismissAlarm: 'Ébresztő Bezárása', alarmSetFor: 'Ébresztő beállítva {time}-ra ({hours}ó {minutes}p múlva)', in: 'múlva', alarmTitle: 'ÉBRESZTŐ!', sounds: { classicAlarm: 'Klasszikus Ébresztő', beepBeep: 'Csipogás', rooster: 'Kakas', bell: 'Csengő', chime: 'Harangszó', digital: 'Digitális' } }
  },
  uz: {
    timer: { durationMode: 'Davomiylik Rejimi', countdownMode: 'Sanaga Ortga Hisoblash' },
    alarm: { placeholderTitle: 'Uyg\'on!', alarmRinging: 'Signal!', timesUp: 'Vaqt tugadi!', dismissAlarm: 'Signalni O\'chirish', alarmSetFor: 'Signal {time} uchun o\'rnatildi ({hours}s {minutes}d ichida)', in: 'ichida', alarmTitle: 'SIGNAL!', sounds: { classicAlarm: 'Klassik Signal', beepBeep: 'Bip Bip', rooster: 'Xo\'roz', bell: 'Qo\'ng\'iroq', chime: 'Jaranglash', digital: 'Raqamli' } }
  }
};

// Process all language files
async function addMissingTranslations() {
  let updated = 0;
  let errors = 0;

  for (const [lang, translations] of Object.entries(missingKeys)) {
    try {
      const filePath = join(translationsDir, `${lang}.json`);
      const content = JSON.parse(readFileSync(filePath, 'utf-8'));

      // Add missing timer keys
      if (!content.timer.durationMode) {
        content.timer.durationMode = translations.timer.durationMode;
      }
      if (!content.timer.countdownMode) {
        content.timer.countdownMode = translations.timer.countdownMode;
      }

      // Add missing alarm keys
      for (const [key, value] of Object.entries(translations.alarm)) {
        if (!content.alarm[key]) {
          content.alarm[key] = value;
        }
      }

      // Write back to file with proper formatting
      writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf-8');
      console.log(`✓ Updated ${lang}.json`);
      updated++;
    } catch (error) {
      console.error(`✗ Error updating ${lang}.json:`, error.message);
      errors++;
    }
  }

  console.log(`\n${updated} files updated successfully`);
  if (errors > 0) {
    console.log(`${errors} files had errors`);
  }
}

addMissingTranslations().catch(console.error);
