import React, { useState } from 'react';
import { MessageSquare, AlertTriangle, CheckCircle, Lightbulb, Shield, Clock, Mail, Smartphone, FileText, Loader, Globe, Zap } from 'lucide-react';

export default function MessageExplainer() {
  const [message, setMessage] = useState('');
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('english');

  // Translation dictionaries
  const translations = {
    english: {
      scamDetected: "⚠️ SCAM DETECTED!",
      appearsSafe: "✅ Appears Safe",
      riskLevel: "Risk Level:",
      simpleExplanation: "Simple Explanation:",
      keyPoints: "Key Points:",
      whatToDo: "What Should You Do?",
      warnings: "⚠️ Important Warnings:"
    },
    hindi: {
      scamDetected: "⚠️ धोखाधड़ी पकड़ी गई!",
      appearsSafe: "✅ सुरक्षित लगता है",
      riskLevel: "जोखिम स्तर:",
      simpleExplanation: "सरल व्याख्या:",
      keyPoints: "मुख्य बिंदु:",
      whatToDo: "आपको क्या करना चाहिए?",
      warnings: "⚠️ महत्वपूर्ण चेतावनियाँ:"
    },
    marathi: {
      scamDetected: "⚠️ फसवणूक आढळली!",
      appearsSafe: "✅ सुरक्षित दिसते",
      riskLevel: "जोखीम पातळी:",
      simpleExplanation: "सोपे स्पष्टीकरण:",
      keyPoints: "मुख्य मुद्दे:",
      whatToDo: "तुम्ही काय करावे?",
      warnings: "⚠️ महत्त्वाचे इशारे:"
    }
  };

  const analyzeMessage = (msg, lang) => {
    const lowerMsg = msg.toLowerCase();
    
    // Scam patterns
    const scamKeywords = [
      'click here', 'verify', 'suspended', 'urgent', 'winner', 'claim', 'prize', 
      'bank details', 'password', 'otp', 'won', 'lottery', 'congratulations',
      'account blocked', 'verify now', 'immediate action', 'expire', 'limited time',
      'aadhaar', 'pan card', 'credit card', 'debit card', 'cvv', 'pin',
      'tax refund', 'cash prize', 'lucky draw', 'free gift', 'click link'
    ];
    
    const suspiciousLinks = /bit\.ly|tinyurl|goo\.gl|short\.link|click here|verify now/i.test(msg);
    const hasScamWords = scamKeywords.some(word => lowerMsg.includes(word));
    const hasUrgentLanguage = /urgent|immediate|now|today|expire|block|suspend/i.test(lowerMsg);
    const requestsPersonalInfo = /password|otp|cvv|pin|bank details|card number|aadhaar|pan/i.test(lowerMsg);
    
    // Government/official patterns
    const isOfficial = /form \d+|section \d+|deadline|filing|tax|government|notice|itr|gst/i.test(msg);
    const hasOfficialLanguage = /pursuant|hereby|notification|circular|amendment/i.test(msg);
    
    let result = {};
    
    // High-risk scam detection
    if ((hasScamWords && suspiciousLinks) || requestsPersonalInfo) {
      result = getScamResponse(msg, lang, 'high');
    } 
    // Medium-risk suspicious message
    else if (hasScamWords || hasUrgentLanguage || suspiciousLinks) {
      result = getScamResponse(msg, lang, 'medium');
    }
    // Likely official notice
    else if (isOfficial || hasOfficialLanguage) {
      result = getOfficialResponse(msg, lang);
    }
    // Regular safe message
    else {
      result = getSafeResponse(msg, lang);
    }
    
    return result;
  };

  const getScamResponse = (msg, lang, riskLevel) => {
    const responses = {
      english: {
        high: {
          isScam: true,
          riskLevel: "high",
          simpleExplanation: "🚨 This is a SCAM message! It's trying to steal your money or personal information. Scammers create fake urgent messages to trick you into clicking links or sharing sensitive details. Real banks and companies NEVER ask for passwords, OTP, CVV, or Aadhaar details through SMS or WhatsApp.",
          keyPoints: [
            "The message uses fear tactics like 'account suspended' or 'urgent action' to make you panic",
            "It contains suspicious shortened links (bit.ly, tinyurl) that could lead to fake websites",
            "It asks for personal information like passwords, OTP, bank details, or card numbers",
            "Real organizations never ask for sensitive information through text messages",
            "The sender is trying to steal your money or identity by creating fake urgency"
          ],
          actionNeeded: "❌ DO NOT click any links! ❌ DO NOT share any personal information! ❌ DO NOT call any phone numbers in the message! Delete this message immediately. If you're worried about your account, contact your bank directly using the phone number on the back of your card or their official website. NEVER use contact details from suspicious messages.",
          warnings: [
            "Never click on shortened links (bit.ly, tinyurl, goo.gl) in unexpected messages",
            "Never share OTP, passwords, CVV, PIN, or Aadhaar details with anyone - not even 'bank staff'",
            "Banks never ask you to 'verify' your account through SMS links",
            "If you accidentally clicked the link, don't enter any information and close it immediately",
            "If you shared any information, contact your bank immediately and block your cards",
            "Report scam messages to cybercrime.gov.in"
          ]
        },
        medium: {
          isScam: true,
          riskLevel: "medium",
          simpleExplanation: "⚠️ This message looks suspicious! It has warning signs of a scam or phishing attempt. While it might be legitimate, it's using tactics that scammers commonly use to trick people. Be very careful before taking any action.",
          keyPoints: [
            "The message creates unnecessary urgency or fear",
            "It may contain suspicious links or unexpected requests",
            "Legitimate companies usually don't send urgent threats via text",
            "The tone and language suggest it might be trying to manipulate you",
            "It's better to verify through official channels before responding"
          ],
          actionNeeded: "⚠️ Don't rush! Before clicking anything or sharing information: 1) Verify the sender independently 2) Contact the organization through their official website or customer care 3) Ask yourself: 'Did I expect this message?' 4) When in doubt, ignore it and verify through official channels.",
          warnings: [
            "Don't act on urgent demands without verification",
            "Be skeptical of unexpected prizes, refunds, or account issues",
            "Legitimate organizations give you time to respond",
            "Always verify through official channels, not through message links"
          ]
        }
      },
      hindi: {
        high: {
          isScam: true,
          riskLevel: "high",
          simpleExplanation: "🚨 यह एक धोखाधड़ी का संदेश है! यह आपका पैसा या व्यक्तिगत जानकारी चुराने की कोशिश कर रहा है। धोखेबाज़ नकली जरूरी संदेश बनाते हैं ताकि आप लिंक पर क्लिक करें या संवेदनशील जानकारी साझा करें। असली बैंक और कंपनियाँ कभी भी SMS या WhatsApp के माध्यम से पासवर्ड, OTP, CVV या आधार विवरण नहीं मांगती।",
          keyPoints: [
            "संदेश में डर पैदा करने वाली भाषा है जैसे 'खाता बंद' या 'तुरंत कार्रवाई' ताकि आप घबरा जाएं",
            "इसमें संदिग्ध छोटे लिंक हैं (bit.ly, tinyurl) जो नकली वेबसाइटों की ओर ले जा सकते हैं",
            "यह पासवर्ड, OTP, बैंक विवरण या कार्ड नंबर जैसी व्यक्तिगत जानकारी मांग रहा है",
            "असली संगठन कभी भी टेक्स्ट संदेशों के माध्यम से संवेदनशील जानकारी नहीं मांगते",
            "भेजने वाला नकली जरूरत बनाकर आपका पैसा या पहचान चुराने की कोशिश कर रहा है"
          ],
          actionNeeded: "❌ किसी भी लिंक पर क्लिक न करें! ❌ कोई व्यक्तिगत जानकारी साझा न करें! ❌ संदेश में दिए गए फोन नंबर पर कॉल न करें! इस संदेश को तुरंत हटा दें। यदि आप अपने खाते के बारे में चिंतित हैं, तो अपने कार्ड के पीछे दिए गए नंबर या उनकी आधिकारिक वेबसाइट का उपयोग करके सीधे अपने बैंक से संपर्क करें।",
          warnings: [
            "अप्रत्याशित संदेशों में छोटे लिंक (bit.ly, tinyurl) पर कभी क्लिक न करें",
            "OTP, पासवर्ड, CVV, PIN या आधार विवरण किसी के साथ साझा न करें - यहां तक कि 'बैंक स्टाफ' के साथ भी नहीं",
            "बैंक कभी भी SMS लिंक के माध्यम से आपके खाते को 'सत्यापित' करने के लिए नहीं कहते",
            "यदि आपने गलती से लिंक पर क्लिक किया है, तो कोई जानकारी दर्ज न करें और इसे तुरंत बंद कर दें",
            "यदि आपने कोई जानकारी साझा की है, तो तुरंत अपने बैंक से संपर्क करें और अपने कार्ड ब्लॉक करें"
          ]
        },
        medium: {
          isScam: true,
          riskLevel: "medium",
          simpleExplanation: "⚠️ यह संदेश संदिग्ध लग रहा है! इसमें धोखाधड़ी के संकेत हैं। हालांकि यह वैध हो सकता है, यह उन तरीकों का उपयोग कर रहा है जो धोखेबाज़ आमतौर पर लोगों को धोखा देने के लिए उपयोग करते हैं। कोई भी कार्रवाई करने से पहले बहुत सावधान रहें।",
          keyPoints: [
            "संदेश अनावश्यक जरूरत या डर पैदा करता है",
            "इसमें संदिग्ध लिंक या अप्रत्याशित अनुरोध हो सकते हैं",
            "वैध कंपनियां आमतौर पर टेक्स्ट के माध्यम से तत्काल धमकी नहीं भेजती",
            "स्वर और भाषा से पता चलता है कि यह आपको हेरफेर करने की कोशिश कर रहा है"
          ],
          actionNeeded: "⚠️ जल्दबाजी न करें! कुछ भी क्लिक करने या जानकारी साझा करने से पहले: 1) भेजने वाले को स्वतंत्र रूप से सत्यापित करें 2) संगठन से उनकी आधिकारिक वेबसाइट या ग्राहक सेवा के माध्यम से संपर्क करें 3) खुद से पूछें: 'क्या मुझे इस संदेश की उम्मीद थी?' 4) संदेह होने पर, इसे अनदेखा करें।",
          warnings: [
            "सत्यापन के बिना तत्काल मांगों पर कार्रवाई न करें",
            "अप्रत्याशित पुरस्कार, रिफंड या खाता समस्याओं पर संदेह करें",
            "वैध संगठन आपको जवाब देने के लिए समय देते हैं"
          ]
        }
      },
      marathi: {
        high: {
          isScam: true,
          riskLevel: "high",
          simpleExplanation: "🚨 हा एक फसवणुकीचा संदेश आहे! हे तुमचे पैसे किंवा वैयक्तिक माहिती चोरण्याचा प्रयत्न करत आहे. फसवणूक करणारे लोक बनावट तातडीचे संदेश तयार करतात जेणेकरून तुम्ही दुवे क्लिक करा किंवा संवेदनशील तपशील शेअर करा. खरी बँका आणि कंपन्या कधीही SMS किंवा WhatsApp द्वारे पासवर्ड, OTP, CVV किंवा आधार तपशील विचारत नाहीत.",
          keyPoints: [
            "संदेशात भीती निर्माण करणारी भाषा आहे जसे की 'खाते निलंबित' किंवा 'तात्काळ कृती' यासाठी की तुम्ही घाबरून जावे",
            "यात संशयास्पद लहान दुवे आहेत (bit.ly, tinyurl) जे बनावट वेबसाइटकडे नेऊ शकतात",
            "हे पासवर्ड, OTP, बँक तपशील किंवा कार्ड क्रमांक यासारखी वैयक्तिक माहिती विचारत आहे",
            "खरी संस्था कधीही मजकूर संदेशांद्वारे संवेदनशील माहिती विचारत नाहीत",
            "पाठवणारा बनावट तातडी निर्माण करून तुमचे पैसे किंवा ओळख चोरण्याचा प्रयत्न करत आहे"
          ],
          actionNeeded: "❌ कोणत्याही दुव्यावर क्लिक करू नका! ❌ कोणतीही वैयक्तिक माहिती शेअर करू नका! ❌ संदेशातील फोन नंबरवर कॉल करू नका! हा संदेश लगेच हटवा. जर तुम्हाला तुमच्या खात्याबद्दल काळजी असेल, तर तुमच्या कार्डच्या मागील बाजूस दिलेल्या नंबरवर किंवा त्यांच्या अधिकृत वेबसाइटवर थेट तुमच्या बँकेशी संपर्क साधा.",
          warnings: [
            "अनपेक्षित संदेशांमधील लहान दुव्यांवर (bit.ly, tinyurl) कधीही क्लिक करू नका",
            "OTP, पासवर्ड, CVV, PIN किंवा आधार तपशील कोणाशीही शेअर करू नका - 'बँक कर्मचारी' यांच्याशीही नाही",
            "बँका कधीही SMS दुव्यांद्वारे तुमचे खाते 'सत्यापित' करण्यास सांगत नाहीत",
            "जर तुम्ही चुकून दुव्यावर क्लिक केला असेल, तर कोणतीही माहिती प्रविष्ट करू नका आणि ते लगेच बंद करा"
          ]
        },
        medium: {
          isScam: true,
          riskLevel: "medium",
          simpleExplanation: "⚠️ हा संदेश संशयास्पद दिसतो आहे! यात फसवणूक किंवा फिशिंगचे चेतावणी चिन्हे आहेत. जरी हे कायदेशीर असू शकते, परंतु ते फसवणूक करणारे सामान्यपणे लोकांना फसवण्यासाठी वापरतात अशा युक्त्या वापरत आहे. कोणतीही कृती करण्यापूर्वी अत्यंत सावध रहा.",
          keyPoints: [
            "संदेश अनावश्यक तातडी किंवा भीती निर्माण करतो",
            "यात संशयास्पद दुवे किंवा अनपेक्षित विनंत्या असू शकतात",
            "कायदेशीर कंपन्या सामान्यपणे मजकूराद्वारे तातडीच्या धमक्या पाठवत नाहीत",
            "स्वर आणि भाषा सूचित करते की ते तुमची फसवणूक करण्याचा प्रयत्न करत आहे"
          ],
          actionNeeded: "⚠️ घाई करू नका! काहीही क्लिक करण्यापूर्वी किंवा माहिती शेअर करण्यापूर्वी: 1) पाठवणाऱ्याची स्वतंत्रपणे पडताळणी करा 2) संस्थेशी त्यांच्या अधिकृत वेबसाइट किंवा ग्राहक सेवेद्वारे संपर्क साधा 3) स्वतःला विचारा: 'मला या संदेशाची अपेक्षा होती का?' 4) शंका असल्यास, त्याकडे दुर्लक्ष करा.",
          warnings: [
            "पडताळणीशिवाय तातडीच्या मागण्यांवर कारवाई करू नका",
            "अनपेक्षित बक्षिसे, परतावे किंवा खाते समस्यांवर संशय घ्या",
            "कायदेशीर संस्था तुम्हाला प्रतिसाद देण्यासाठी वेळ देतात"
          ]
        }
      }
    };

    return responses[lang][riskLevel];
  };

  const getOfficialResponse = (msg, lang) => {
    const responses = {
      english: {
        isScam: false,
        riskLevel: "low",
        simpleExplanation: "✅ This appears to be an official notice or communication. It uses formal language and specific terminology that government offices and legitimate organizations typically use. However, always verify important notices through official channels.",
        keyPoints: [
          "The message uses formal, official language and terminology",
          "It mentions specific forms, sections, deadlines, or legal references",
          "There are no requests for personal information or passwords",
          "The message is informational rather than creating fear or urgency",
          "It appears to be a legitimate notification about official matters"
        ],
        actionNeeded: "📋 Read the notice carefully and note important dates or requirements. If you need to take action: 1) Visit the official website of the organization 2) Call their official customer care number 3) Visit their office in person if needed. Don't rely solely on text messages for important official matters - always verify through official channels.",
        warnings: [
          "Even if it looks official, verify through the organization's official website",
          "Keep records of all official communications",
          "Don't ignore deadline-based notices - they may have penalties",
          "If you're unsure, consult a professional (like a CA for tax matters)"
        ]
      },
      hindi: {
        isScam: false,
        riskLevel: "low",
        simpleExplanation: "✅ यह एक आधिकारिक नोटिस या संचार प्रतीत होता है। यह औपचारिक भाषा और विशिष्ट शब्दावली का उपयोग करता है जो सरकारी कार्यालय और वैध संगठन आमतौर पर उपयोग करते हैं। हालांकि, हमेशा आधिकारिक चैनलों के माध्यम से महत्वपूर्ण नोटिस सत्यापित करें।",
        keyPoints: [
          "संदेश औपचारिक, आधिकारिक भाषा और शब्दावली का उपयोग करता है",
          "यह विशिष्ट फॉर्म, धारा, समय सीमा या कानूनी संदर्भों का उल्लेख करता है",
          "व्यक्तिगत जानकारी या पासवर्ड के लिए कोई अनुरोध नहीं है",
          "संदेश डर या तात्कालिकता पैदा करने के बजाय सूचनात्मक है"
        ],
        actionNeeded: "📋 नोटिस को ध्यान से पढ़ें और महत्वपूर्ण तारीखों या आवश्यकताओं को नोट करें। यदि आपको कार्रवाई करने की आवश्यकता है: 1) संगठन की आधिकारिक वेबसाइट पर जाएं 2) उनके आधिकारिक ग्राहक सेवा नंबर पर कॉल करें 3) यदि आवश्यक हो तो व्यक्तिगत रूप से उनके कार्यालय में जाएं।",
        warnings: [
          "भले ही यह आधिकारिक दिखे, संगठन की आधिकारिक वेबसाइट के माध्यम से सत्यापित करें",
          "सभी आधिकारिक संचार के रिकॉर्ड रखें",
          "समय सीमा-आधारित नोटिस को अनदेखा न करें - उनमें जुर्माना हो सकता है"
        ]
      },
      marathi: {
        isScam: false,
        riskLevel: "low",
        simpleExplanation: "✅ ही एक अधिकृत सूचना किंवा संप्रेषण असल्याचे दिसते. यात औपचारिक भाषा आणि विशिष्ट शब्दावली वापरली आहे जी सरकारी कार्यालये आणि कायदेशीर संस्था सामान्यपणे वापरतात. तथापि, नेहमी अधिकृत माध्यमांद्वारे महत्त्वाच्या सूचनांची पडताळणी करा.",
        keyPoints: [
          "संदेश औपचारिक, अधिकृत भाषा आणि शब्दावली वापरतो",
          "यात विशिष्ट फॉर्म, कलम, मुदत किंवा कायदेशीर संदर्भांचा उल्लेख आहे",
          "वैयक्तिक माहिती किंवा पासवर्डसाठी कोणत्याही विनंत्या नाहीत",
          "संदेश भीती किंवा तातडी निर्माण करण्याऐवजी माहितीपूर्ण आहे"
        ],
        actionNeeded: "📋 सूचना काळजीपूर्वक वाचा आणि महत्त्वाच्या तारखा किंवा आवश्यकता नोंदवा. जर तुम्हाला कारवाई करण्याची गरज असेल: 1) संस्थेच्या अधिकृत वेबसाइटला भेट द्या 2) त्यांच्या अधिकृत ग्राहक सेवा क्रमांकावर कॉल करा 3) आवश्यक असल्यास वैयक्तिकरित्या त्यांच्या कार्यालयात जा.",
        warnings: [
          "जरी ते अधिकृत दिसत असले तरी, संस्थेच्या अधिकृत वेबसाइटद्वारे पडताळणी करा",
          "सर्व अधिकृत संप्रेषणांचे रेकॉर्ड ठेवा",
          "मुदत-आधारित सूचनांकडे दुर्लक्ष करू नका - त्यांना दंड असू शकतो"
        ]
      }
    };

    return responses[lang];
  };

  const getSafeResponse = (msg, lang) => {
    const responses = {
      english: {
        isScam: false,
        riskLevel: "low",
        simpleExplanation: "✅ This message appears to be a regular, safe communication. It doesn't show obvious signs of being a scam or fraud attempt. However, always stay cautious with unexpected messages from unknown senders.",
        keyPoints: [
          "The message doesn't contain typical scam indicators",
          "There are no urgent demands for action or personal information",
          "No suspicious links or unusual requests detected",
          "However, always verify the sender if you're unsure about the message"
        ],
        actionNeeded: "If this message is from someone you know and trust, it's likely safe to respond. If it's from an unknown sender: 1) Think about whether you expected this message 2) Verify the sender through a different channel if needed 3) Don't share personal or financial information unless you're absolutely certain.",
        warnings: [
          "Stay alert for any follow-up messages asking for money or information",
          "Don't share personal details unless you're certain about the sender",
          "When in doubt, it's always safer to verify through official channels"
        ]
      },
      hindi: {
        isScam: false,
        riskLevel: "low",
        simpleExplanation: "✅ यह संदेश एक नियमित, सुरक्षित संचार प्रतीत होता है। इसमें धोखाधड़ी या फ्रॉड प्रयास के स्पष्ट संकेत नहीं हैं। हालांकि, अज्ञात प्रेषकों से अप्रत्याशित संदेशों के साथ हमेशा सावधान रहें।",
        keyPoints: [
          "संदेश में विशिष्ट स्कैम संकेतक नहीं हैं",
          "कार्रवाई या व्यक्तिगत जानकारी के लिए कोई तत्काल मांग नहीं है",
          "कोई संदिग्ध लिंक या असामान्य अनुरोध नहीं पाया गया",
          "हालांकि, यदि आप संदेश के बारे में अनिश्चित हैं तो हमेशा प्रेषक को सत्यापित करें"
        ],
        actionNeeded: "यदि यह संदेश किसी ऐसे व्यक्ति से है जिसे आप जानते हैं और भरोसा करते हैं, तो जवाब देना सुरक्षित है। यदि यह एक अज्ञात प्रेषक से है: 1) सोचें कि क्या आप इस संदेश की उम्मीद कर रहे थे 2) यदि आवश्यक हो तो एक अलग चैनल के माध्यम से प्रेषक को सत्यापित करें 3) जब तक आप पूरी तरह से निश्चित न हों, व्यक्तिगत या वित्तीय जानकारी साझा न करें।",
        warnings: [
          "पैसे या जानकारी मांगने वाले किसी भी फॉलो-अप संदेश के लिए सतर्क रहें",
          "जब तक आप प्रेषक के बारे में निश्चित न हों, व्यक्तिगत विवरण साझा न करें",
          "संदेह होने पर, आधिकारिक चैनलों के माध्यम से सत्यापित करना हमेशा सुरक्षित है"
        ]
      },
      marathi: {
        isScam: false,
        riskLevel: "low",
        simpleExplanation: "✅ हा संदेश एक नियमित, सुरक्षित संप्रेषण असल्याचे दिसते. यात फसवणूक किंवा फसवणुकीच्या प्रयत्नाची स्पष्ट चिन्हे नाहीत. तथापि, अज्ञात पाठवणाऱ्यांकडून अनपेक्षित संदेशांसह नेहमी सावध रहा.",
        keyPoints: [
          "संदेशात विशिष्ट घोटाळा सूचक नाहीत",
          "कृती किंवा वैयक्तिक माहितीसाठी कोणतीही तातडीची मागणी नाही",
          "कोणतेही संशयास्पद दुवे किंवा असामान्य विनंत्या आढळल्या नाहीत",
          "तथापि, जर तुम्हाला संदेशाबद्दल अनिश्चितता असेल तर नेहमी पाठवणाऱ्याची पडताळणी करा"
        ],
        actionNeeded: "जर हा संदेश एखाद्या व्यक्तीकडून आहे ज्याला तुम्ही ओळखता आणि विश्वास ठेवता, तर प्रतिसाद देणे सुरक्षित आहे. जर ते अज्ञात पाठवणाऱ्याकडून असेल: 1) विचार करा की तुम्हाला या संदेशाची अपेक्षा होती का 2) आवश्यक असल्यास वेगळ्या माध्यमातून पाठवणाऱ्याची पडताळणी करा 3) जोपर्यंत तुम्हाला पूर्णपणे खात्री नाही तोपर्यंत वैयक्तिक किंवा आर्थिक माहिती शेअर करू नका.",
        warnings: [
          "पैसे किंवा माहिती मागणाऱ्या कोणत्याही फॉलो-अप संदेशांसाठी सतर्क राहा",
          "जोपर्यंत तुम्हाला पाठवणाऱ्याबद्दल खात्री नाही तोपर्यंत वैयक्तिक तपशील शेअर करू नका",
          "शंका असल्यास, अधिकृत माध्यमांद्वारे पडताळणी करणे नेहमीच सुरक्षित आहे"
        ]
      }
    };

    return responses[lang];
  };

  const explainMessage = () => {
    if (!message.trim()) {
      alert('Please enter a message to explain');
      return;
    }

    setLoading(true);
    setExplanation(null);

    // Simulate processing time for better UX
    setTimeout(() => {
      const result = analyzeMessage(message, language);
      setExplanation(result);
      setLoading(false);
    }, 1500);
  };

  const examples = [
    {
      title: "Bank SMS Scam",
      text: "URGENT: Your bank account will be blocked. Click here immediately to verify: bit.ly/verify-now-123",
      icon: <Smartphone className="text-red-500" size={20} />,
      tag: "Scam Alert"
    },
    {
      title: "Phishing Email",
      text: "Dear Customer, We detected unusual activity. Update payment info within 24 hours or face account suspension.",
      icon: <Mail className="text-orange-500" size={20} />,
      tag: "High Risk"
    },
    {
      title: "Tax Notice",
      text: "Income Tax Notice: File ITR for FY 2024-25 before July 31, 2025. Late filing attracts penalty under Section 234F.",
      icon: <FileText className="text-green-500" size={20} />,
      tag: "Official"
    },
    {
      title: "Lottery Scam",
      text: "Congratulations! You won ₹50 Lakh in Lucky Draw. Send your Aadhaar and bank details to claim prize.",
      icon: <Zap className="text-yellow-500" size={20} />,
      tag: "Fraud"
    }
  ];

  const languages = [
    { code: 'english', name: 'English', flag: '🇬🇧' },
    { code: 'hindi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'marathi', name: 'मराठी', flag: '🇮🇳' }
  ];

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Premium Header with Logo */}
      <header className="bg-white shadow-md border-b-2 border-indigo-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Professional Logo */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                {/* Outer glow ring */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Main logo */}
                <div className="relative w-14 h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-105 transition-transform">
                  <MessageSquare className="text-white" size={28} strokeWidth={2.5} />
                </div>
                
                {/* Badge indicator */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                  <Lightbulb className="text-white" size={14} />
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI Message Explainer
                </h1>
                <p className="text-sm text-gray-600 font-medium">100% FREE • No API Required • Works Offline</p>
              </div>
            </div>

            {/* Language Globe Icon */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full border border-green-200">
              <Shield className="text-green-600" size={20} />
              <span className="text-sm font-semibold text-green-700">Free Forever</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 px-5 py-2 rounded-full text-sm font-bold mb-5 border-2 border-red-200 shadow-sm">
            <Shield size={18} />
            <span>Protect Yourself from Scams & Confusion</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Don't Understand a Message?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Paste any <span className="font-bold text-blue-600">SMS</span>, <span className="font-bold text-purple-600">WhatsApp</span>, <span className="font-bold text-green-600">Email</span>, or <span className="font-bold text-orange-600">Notice</span> below. 
            Our smart AI will explain it in simple words and warn you about scams - completely FREE!
          </p>
        </div>

        {/* Language Selector - Enhanced */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-indigo-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="text-indigo-600" size={24} />
            <label className="text-lg font-bold text-gray-800">
              Choose Your Language:
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-6 py-4 rounded-xl border-2 font-semibold transition-all transform hover:scale-105 ${
                  language === lang.code
                    ? 'border-indigo-500 bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300'
                }`}
              >
                <div className="text-3xl mb-2">{lang.flag}</div>
                <div className="text-lg">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Input Section */}
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-indigo-100 p-8 mb-6">
          <label className="block text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MessageSquare className="text-indigo-600" size={24} />
            Paste Your Message Here:
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Example: 'Your account has been suspended. Click here to verify immediately...' 

Paste any suspicious or confusing message and I'll explain what it means, whether it's a scam, and what you should do."
            className="w-full h-48 p-5 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none resize-none text-gray-800 text-lg font-medium"
          />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-5">
            <span className="text-sm text-gray-500 font-medium">
              {message.length} characters • Smart pattern analysis
            </span>
            <button
              onClick={explainMessage}
              disabled={loading || !message.trim()}
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={24} />
                  Analyzing...
                </>
              ) : (
                <>
                  <Lightbulb size={24} />
                  Explain This Message
                </>
              )}
            </button>
          </div>
        </div>

        {/* Example Messages */}
        {!explanation && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-2">
              <Zap className="text-yellow-500" size={28} />
              Try These Real Examples:
            </h3>
            <div className="grid md:grid-cols-2 gap-5">
              {examples.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setMessage(example.text)}
                  className="bg-white p-5 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:shadow-xl transition-all text-left transform hover:scale-102"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {example.icon}
                      <span className="font-bold text-gray-800">{example.title}</span>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      example.tag === 'Scam Alert' || example.tag === 'Fraud' ? 'bg-red-100 text-red-700' :
                      example.tag === 'High Risk' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {example.tag}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{example.text}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Section */}
        {explanation && (
          <div className="space-y-6">
            {/* Risk Alert */}
            <div className={`rounded-2xl p-8 border-4 shadow-2xl ${
              explanation.riskLevel === 'high' 
                ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-500'
                : explanation.riskLevel === 'medium'
                ? 'bg-gradient-to-r from-yellow-50 to-orange-100 border-yellow-500'
                : 'bg-gradient-to-r from-green-50 to-emerald-100 border-green-500'
            }`}>
              <div className="flex items-center gap-4">
                {explanation.riskLevel === 'high' ? (
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <AlertTriangle className="text-white" size={32} />
                  </div>
                ) : explanation.riskLevel === 'medium' ? (
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                    <AlertTriangle className="text-white" size={32} />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-white" size={32} />
                  </div>
                )}
                <div>
                  <h3 className="text-3xl font-black mb-1">
                    {explanation.isScam ? t.scamDetected : t.appearsSafe}
                  </h3>
                  <p className="text-lg font-bold capitalize">{t.riskLevel} {explanation.riskLevel.toUpperCase()}</p>
                </div>
              </div>
            </div>

            {/* Simple Explanation */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-8">
              <div className="flex items-center gap-3 mb-5">
                <MessageSquare className="text-blue-600" size={28} />
                <h3 className="text-2xl font-bold text-gray-800">{t.simpleExplanation}</h3>
              </div>
              <p className="text-gray-700 text-xl leading-relaxed">{explanation.simpleExplanation}</p>
            </div>

            {/* Key Points */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="text-purple-600" size={28} />
                <h3 className="text-2xl font-bold text-gray-800">{t.keyPoints}</h3>
              </div>
              <ul className="space-y-4">
                {explanation.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700 text-lg pt-0.5">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Needed */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-300 p-8">
              <div className="flex items-center gap-3 mb-5">
                <Clock className="text-blue-700" size={28} />
                <h3 className="text-2xl font-bold text-gray-800">{t.whatToDo}</h3>
              </div>
              <p className="text-gray-700 text-xl leading-relaxed">{explanation.actionNeeded}</p>
            </div>

            {/* Warnings */}
            {explanation.warnings && explanation.warnings.length > 0 && (
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border-2 border-red-300 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="text-red-700" size={28} />
                  <h3 className="text-2xl font-bold text-gray-800">{t.warnings}</h3>
                </div>
                <ul className="space-y-3">
                  {explanation.warnings.map((warning, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-red-800 text-lg">
                      <span className="text-2xl">⚠️</span>
                      <span className="pt-1">{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Try Another Button */}
            <div className="text-center pt-4">
              <button
                onClick={() => {
                  setMessage('');
                  setExplanation(null);
                }}
                className="px-10 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Explain Another Message
              </button>
            </div>
          </div>
        )}

        {/* Features Section */}
        {!explanation && (
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            {[
              { icon: <Shield className="text-blue-500" size={36} />, title: "Scam Detection", desc: "Smart pattern recognition identifies fraud instantly" },
              { icon: <Globe className="text-purple-500" size={36} />, title: "Multi-Language", desc: "English, Hindi & Marathi support" },
              { icon: <Zap className="text-yellow-500" size={36} />, title: "100% Free", desc: "No API costs, works completely offline" },
              { icon: <CheckCircle className="text-green-500" size={36} />, title: "Action Steps", desc: "Clear guidance on what to do next" }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all text-center transform hover:scale-105">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h4 className="font-bold text-gray-800 text-lg mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Premium Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white mt-16 py-8 border-t-4 border-indigo-500">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-lg font-semibold mb-2">🛡️ Stay Safe Online • Protect Yourself & Your Family</p>
          <p className="text-sm text-gray-400">100% Free • No API Required • Pattern-Based Intelligence</p>
        </div>
      </footer>
    </div>
  );
}