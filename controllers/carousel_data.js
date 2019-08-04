const request = require('request');

module.exports = {
    "pre_pregnancy": [
    {
        eng:"Increase your chances of conceiving by using the ovulation calculator",
        ar:"يمكنك زيادة فرصك في الحمل باستخدام حاسبة التبويض لدينا",
        image:"https://danone-apta-advice.herokuapp.com/fb/ov_tool.jpg", 
        url:"https://www.apta-advice.com/pre-pregnancy-signs/ovulation-calculator-tool", 
        urlAr:"https://www.apta-advice.com/ar/pre-pregnancy-signs-ar/ovulation-calculator-tool",
        langEn:"Ovulationcalculator_EN",
        langAr:"Ovulationcalculator_AR"
    },
    {
        eng:"Tips to improve fertility",
        ar:"نصائح لتحسين الخصوبة",
        image:"https://danone-apta-advice.herokuapp.com/fb/tips-to-improve-fertility.jpg", 
        url:"https://www.apta-advice.com/pre-pregnancy-signs/top-tips-improve-fertility/", 
        urlAr:"https://www.apta-advice.com/ar/pre-pregnancy-signs-ar/top-tips-improve-fertility",
        langEn:"Improvefertility_EN",
        langAr:"Improvefertility_AR"
    },
    {
        eng:"Read about home pregnancy tests",
        ar:"اقرئي عن اختبارات الحمل",
        image:"https://danone-apta-advice.herokuapp.com/fb/881-11.jpg", 
        url:"https://www.apta-advice.com/pre-pregnancy-signs/pregnancy-tests/", 
        urlAr:"https://www.apta-advice.com/ar/pre-pregnancy-signs-ar/pregnancy-tests",
        langEn:"Homepregnancytests_EN",
        langAr:"Homepregnancytests_AR"
    },
    {
        eng:"Would you like to know about something else?",
        ar:"هل تريدين معرفة شيء آخر؟",
        image:"https://danone-apta-advice.herokuapp.com/fb/carousel.jpg", 
        url:"https://www.apta-advice.com", 
        urlAr:"https://www.apta-advice.com/ar/",
        langEn:"Knowsomethingelse_EN",
        langAr:"Knowsomethingelse_AR"
    }
],
    "pregnancy": [
    {
        eng:"1st Trimester (week  6 - week 12)",
        ar:"الثلث الأول (الأسبوع 6 - الأسبوع 12)",
        image:"https://danone-apta-advice.herokuapp.com/fb/1st-trimester.jpg", 
        payload:"1st_trimester"
    },
    {
        eng:"2nd Trimester (week 13 - week 25)",
        ar:"الثلث الثاني (الأسبوع 13 - الأسبوع 25)",
        image:"https://danone-apta-advice.herokuapp.com/fb/second-trimester.jpg", 
        payload:"2nd_trimester"
    },
    {
        eng:"3rd Trimester (week 26 - week 40)",
        ar:"الثلث الثالث (الأسبوع 26 - الأسبوع 40)",
        image:"https://danone-apta-advice.herokuapp.com/fb/third-trimester-thumbnail.jpg",
        payload:"3rd_trimester"
    }
],
    "trimester1st": [
    {
        eng:"Week 6",
        ar:"الأسبوع 6",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-6.jpg", 
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-6.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-06&frequency=06", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-06&frequency=06",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 7",
        ar:"الأسبوع 7",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-7.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-7.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-07&frequency=07", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-07&frequency=07",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 8",
        ar:"الأسبوع 8",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-8.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-8.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-08&frequency=08", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-08&frequency=08",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 9",
        ar:"الأسبوع 9",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-9.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-9.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-09&frequency=09", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-09&frequency=09",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 10",
        ar:"الأسبوع 10",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-10.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-10.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-10&frequency=10", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-10&frequency=10",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 11",
        ar:"الأسبوع 11",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-11.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-11.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-11&frequency=11", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-11&frequency=11",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 12",
        ar:"الأسبوع 12",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-12.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-12.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-12&frequency=12", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-12&frequency=12",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Would you like to know about something else?",
        ar:"هل تريدين معرفة شيء آخر",
        image:"https://danone-apta-advice.herokuapp.com/fb/carousel.jpg",
        url:"1st_trimester_more",
        type:"btn"
    },
    {
        eng:"Subscribe to our frequent tips and advice",
        ar:"هل تريدين الاشتراك لمتابعة آخر الأخبار",
        image:"https://danone-apta-advice.herokuapp.com/fb/Montly-and-weekly-updates.jpg", 
        type: "subs"
    }
],
    "trimester1st_more": [
    {
        eng:"Healthy diet during pregnancy",
        ar:"نظام غذاء صحي أثناء الحمل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Diet-during-pregnancy.jpg",
        url:"https://www.apta-advice.com/pregnancy-nutrition", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-nutrition-ar",
        langEn:"Healthydietpregnancy_EN",
        langAr:"Healthydietpregnancy_AR"
    },
    {
        eng:"Supplements during pregnancy",
        ar:"المكملات الغذائية أثناء الحمل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Supplements-during-pregnancy.jpg",
        url:"https://www.apta-advice.com/pregnancy-vitamins", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-vitamins-ar",
        langEn:"Supplementsduringpregnancy_EN",
        langAr:"Supplementsduringpregnancy_AR"
    }
],
    "trimester2nd": [
    {
        eng:"Week 13",
        ar:"الأسبوع 13",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-13.jpg", 
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-13.jpg", 
        url:"https://www.apta-advice.com/pregnancy-stages/week-13&frequency=13", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-13&frequency=13",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 14",
        ar:"الأسبوع 14",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-14.jpg", 
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-14.jpg", 
        url:"https://www.apta-advice.com/pregnancy-stages/week-14&frequency=14", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-14&frequency=14",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 15",
        ar:"الأسبوع 15",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-15.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-15.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-15&frequency=15", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-15&frequency=15",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 16",
        ar:"الأسبوع 16",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-16.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-16.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-16&frequency=16", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-16&frequency=16",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 17",
        ar:"الأسبوع 17",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-17.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-17.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-17&frequency=17", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-17&frequency=17",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 18",
        ar:"الأسبوع 18",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-18.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-18.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-18&frequency=18", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-18&frequency=18",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 19",
        ar:"الأسبوع 19",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-19.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-19.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-19&frequency=19", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-19&frequency=19",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Read about other weeks in 2nd Trimester",
        ar:"اقرأي عن باقي الأسابيع في الثلث الثاني من الحمل",
        image:"https://danone-apta-advice.herokuapp.com/fb/carousel.jpg",
        url:"2nd_more",
        type:"btn"
    },
    {
        eng:"Would you like to know about something else?",
        ar:"هل تريدين معرفة شيء آخر",
        image:"https://danone-apta-advice.herokuapp.com/fb/carousel.jpg",
        url:"2nd_trimester_more",
        type:"btn"
    },
    {
        eng:"Subscribe to our frequent tips and advice",
        ar:"هل تريدين الاشتراك لمتابعة آخر الأخبار",
        image:"https://danone-apta-advice.herokuapp.com/fb/Montly-and-weekly-updates.jpg", 
        type: "subs"
    }
    
],
    "trimester2nd2": [
    {
        eng:"Week 20",
        ar:"الأسبوع 20",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-20.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-20.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-20&frequency=20", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-20&frequency=20",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 21",
        ar:"الأسبوع 21",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-21.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-21.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-21&frequency=21", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-21&frequency=21",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 22",
        ar:"الأسبوع 22",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-22.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-22.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-22&frequency=22", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-22&frequency=22",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 23",
        ar:"الأسبوع 23",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-23.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-23.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-23&frequency=23", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-23&frequency=23",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 24",
        ar:"الأسبوع 24",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-24.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-24.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-24&frequency=24", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-24&frequency=24",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 25",
        ar:"الأسبوع 25",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-25.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-25.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-25&frequency=25", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-25&frequency=25",
        langEn:"EN",
        langAr:"AR"
    }
],
    "trimester2nd_more": [
    {
        eng:"Healthy diet during pregnancy",
        ar:"نظام غذاء صحي أثناء الحمل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Diet-during-pregnancy.jpg",
        url:"https://www.apta-advice.com/pregnancy-nutrition/", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-nutrition-ar",
        langEn:"Healthydietpregnancy_EN",
        langAr:"Healthydietpregnancy_AR"
    },
    {
        eng:"Supplements during pregnancy",
        ar:"المكملات الغذائية أثناء الحمل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Supplements-during-pregnancy.jpg",
        url:"https://www.apta-advice.com/pregnancy-vitamins", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-vitamins-ar",
        langEn:"Supplementsduringpregnancy_EN",
        langAr:"Supplementsduringpregnancy_AR"
    },
    {
        eng:"Body during pregnancy",
        ar:"الجسم أثناء الحمل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Body-during-pregnancy.jpg",
        url:"https://www.apta-advice.com/pregnancy-symptoms/", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-symptoms-ar",
        langEn:"Bodyduringpregnancy_EN",
        langAr:"Bodyduringpregnancy_AR"
    }
],
    "trimester3rd": [
    {
        eng:"Week 26",
        ar:"الأسبوع 26",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-26.jpg", 
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-26.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-26&frequency=26", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-26&frequency=26",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 27",
        ar:"الأسبوع 27",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-27.jpg", 
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-27.jpg", 
        url:"https://www.apta-advice.com/pregnancy-stages/week-27&frequency=27", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-27&frequency=27",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 28",
        ar:"الأسبوع 28",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-28.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-28.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-28&frequency=28", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-28&frequency=28",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 29",
        ar:"الأسبوع 29",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-29.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-29.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-29&frequency=29", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-29&frequency=29",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 30",
        ar:"الأسبوع 30",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-30.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-30.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-30&frequency=30", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-30&frequency=30",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 31",
        ar:"الأسبوع 31",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-31.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-31.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-31&frequency=31", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-31&frequency=31",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 32",
        ar:"الأسبوع 32",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-32.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-32.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-32&frequency=32", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-32&frequency=32",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Read about other weeks in 3rd Trimester",
        ar:"اقرأي عن باقي الأسابيع في الثلث االثالث من الحمل",
        image:"https://danone-apta-advice.herokuapp.com/fb/carousel.jpg",
        url:"3rd_more",
        type:"btn"
    },
    {
        eng:"Would you like to know about something else?",
        ar:"هل تريدين معرفة شيء آخر",
        image:"https://danone-apta-advice.herokuapp.com/fb/carousel.jpg",
        url:"3rd_trimester_more",
        type:"btn"
    },
    {
        eng:"Subscribe to our frequent tips and advice",
        ar:"هل تريدين الاشتراك لمتابعة آخر الأخبار",
        image:"https://danone-apta-advice.herokuapp.com/fb/Montly-and-weekly-updates.jpg", 
        type: "subs"
    }
    
],
    "trimester3rd2": [
    {
        eng:"Week 33",
        ar:"الأسبوع 33",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-33.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week-33.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-33&frequency=33", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-33&frequency=33",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 34",
        ar:"الأسبوع 34",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-34.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week34.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-34&frequency=34", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-34&frequency=34",
        langEn:"EN",
        langAr:"AR"
    },
    
    {
        eng:"Week 35",
        ar:"الأسبوع 35",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-35.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week35.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-35&frequency=35", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-35&frequency=35",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 36",
        ar:"الأسبوع 36",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-36.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week36.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-36&frequency=36", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-36&frequency=36",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 37",
        ar:"الأسبوع 37",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-37.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week37.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-37&frequency=37", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-37&frequency=37",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 38",
        ar:"الأسبوع 38",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-38.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week38.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-38&frequency=38", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-38&frequency=38",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 39",
        ar:"الأسبوع 39",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-39.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week39.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-39&frequency=39", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-39&frequency=39",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Week 40",
        ar:"الأسبوع 40",
        image:"https://danone-apta-advice.herokuapp.com/fb/Week-40.jpg",
        arImage:"https://danone-apta-advice.herokuapp.com/fb/ar/Week40.jpg",
        url:"https://www.apta-advice.com/pregnancy-stages/week-40&frequency=40", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-stages-ar/week-40&frequency=40",
        langEn:"EN",
        langAr:"AR"
    }
],
    "trimester3rd_more": [
    {
        eng:"Virtual delivery lounge",
        ar:"منتدى الولادة الافتراضي",
        image:"https://danone-apta-advice.herokuapp.com/fb/Virtual-reality-lounge.jpg",
        url:"https://www.apta-advice.com/delivery-lounge/", 
        urlAr:"https://www.apta-advice.com/ar/delivery-lounge-ar",
        langEn:"Virtualdelivery_EN",
        langAr:"Virtualdelivery_AR"
    },
    {
        eng:"How to write a birthplan",
        ar:"كيف تعدين خطة الولادة",
        image:"https://danone-apta-advice.herokuapp.com/fb/How-to-write-a-birth-plan.jpg",
        url:"https://www.apta-advice.com/birth-plan-chart/", 
        urlAr:"https://www.apta-advice.com/ar/birth-plan-chart/",
        langEn:"WritebirthPLan_EN",
        langAr:"WritebirthPLan_AR"
    },
    {
        eng:"Body during pregnancy",
        ar:"الجسم أثناء الحمل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Body-during-pregnancy.jpg",
        url:"https://www.apta-advice.com/pregnancy-symptoms/", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-symptoms-ar",
        langEn:"Bodyduringpregnancy_EN",
        langAr:"Bodyduringpregnancy_AR"
    },
    {
        eng:"Healthy diet during pregnancy",
        ar:"نظام غذاء صحي أثناء الحمل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Diet-during-pregnancy.jpg",
        url:"https://www.apta-advice.com/pregnancy-nutrition/", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-nutrition-ar",
        langEn:"Healthydietpregnancy_EN",
        langAr:"Healthydietpregnancy_AR"
    },
    {
        eng:"Supplements during pregnancy",
        ar:"المكملات الغذائية أثناء الحمل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Supplements-during-pregnancy.jpg",
        url:"https://www.apta-advice.com/pregnancy-vitamins/", 
        urlAr:"https://www.apta-advice.com/ar/pregnancy-vitamins-ar",
        langEn:"Supplementsduringpregnancy_EN",
        langAr:"Supplementsduringpregnancy_AR"
    }
],
    "mth0_3": [
    {
        eng:"Breastfeeding",
        ar:"الرضاعة الطبيعية",
        image:"https://danone-apta-advice.herokuapp.com/fb/Breast-feeding.jpg", 
        url:"https://www.apta-advice.com/breastfeeding/", 
        urlAr:"https://www.apta-advice.com/ar/breastfeeding-ar",
        langEn:"Breastfeeding_EN",
        langAr:"Breastfeeding_AR"
    },
    {
        eng:"Baby Development",
        ar:"تطور الطفل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Baby-development.jpg", 
        url:"https://www.apta-advice.com/baby-development-stages/", 
        urlAr:"https://www.apta-advice.com/ar/baby-development-stages-ar",
        langEn:"Babydevelopment_EN",
        langAr:"Babydevelopment_AR"
    },
    {
        eng:"Baby Health",
        ar:"صحة الطفل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Baby-health.jpg", 
        url:"https://www.apta-advice.com/baby-health/", 
        urlAr:"https://www.apta-advice.com/ar/baby-health-ar",
        langEn:"Babyhealth_EN",
        langAr:"Babyhealth_AR"
    },
    {
        eng:"Baby growth",
        ar:"نمو الطفل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Baby-growth.jpg", 
        url:"https://www.apta-advice.com/baby-development-stages/baby-growth-tool", 
        urlAr:"https://www.apta-advice.com/ar/baby-development-stages-ar/baby-growth-tool",
        langEn:"Babygrowth_EN",
        langAr:"Babygrowth_AR"
    },
    {
        eng:"Baby Allergies",
        ar:"حساسية الطفل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Baby-allergies.jpg", 
        url:"https://www.apta-advice.com/baby-allergies/", 
        urlAr:"https://www.apta-advice.com/ar/baby-allergies-ar",
        langEn:"Babyallergies_EN",
        langAr:"Babyallergies_AR"
    },
    {
        eng:"Would you like to know about something else?",
        ar:"هل تريدين معرفة شيء آخر؟",
        image:"https://danone-apta-advice.herokuapp.com/fb/Logo.jpg", 
        url:"https://www.apta-advice.com/", 
        urlAr:"https://www.apta-advice.com/ar/",
        langEn:"Knowsomethingelse_EN",
        langAr:"Knowsomethingelse_AR"
    },
    {
        eng:"Subscribe to our frequent tips and advice",
        ar:"هل تريدين الاشتراك لمتابعة آخر الأخبار؟",
        image:"https://danone-apta-advice.herokuapp.com/fb/Montly-and-weekly-updates.jpg", 
        type: "subs"
    }
],
    "mth4_6": [
    {
        eng:"Breastfeeding",
        ar:"الرضاعة الطبيعية",
        image:"https://danone-apta-advice.herokuapp.com/fb/Breast-feeding.jpg", 
        url:"https://www.apta-advice.com/breastfeeding/", 
        urlAr:"https://www.apta-advice.com/ar/breastfeeding-ar",
        langEn:"Breastfeeding_EN",
        langAr:"Breastfeeding_AR"
    },
    {
        eng:"Baby Development",
        ar:"تطور الطفل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Baby-development.jpg", 
        url:"https://www.apta-advice.com/baby-development-stages/", 
        urlAr:"https://www.apta-advice.com/ar/baby-development-stages-ar",
        langEn:"Babydevelopment_EN",
        langAr:"Babydevelopment_AR"
    },
    {
        eng:"Baby nutrition",
        ar:"تغذية الطفل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Baby-nutrition.jpg", 
        url:"https://www.apta-advice.com/weaning/weaning-your-baby-4-months/", 
        urlAr:"https://www.apta-advice.com/ar/weaning-ar/weaning-your-baby-4-months",
        langEn:"BabyNutrition_EN",
        langAr:"BabyNutrition_AR"
    },
    {
        eng:"Baby Health",
        ar:"صحة الطفل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Baby-health.jpg", 
        url:"https://www.apta-advice.com/baby-health/", 
        urlAr:"https://www.apta-advice.com/ar/baby-health-ar",
        langEn:"Babyhealth_EN",
        langAr:"Babyhealth_AR"
    },
    {
        eng:"Baby Growth",
        ar:"نمو الطفل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Baby-development.jpg", 
        url:"https://www.apta-advice.com/baby-growth/", 
        urlAr:"https://www.apta-advice.com/ar/baby-growth-ar",
        langEn:"Babygrowth_EN",
        langAr:"Babygrowth_AR"
    },
    {
        eng:"Baby Allergies",
        ar:"حساسية الطفل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Baby-allergies.jpg", 
        url:"https://www.apta-advice.com/baby-allergies/", 
        urlAr:"https://www.apta-advice.com/ar/baby-allergies-ar",
        langEn:"Babyallergies_EN",
        langAr:"Babyallergies_AR"
    },
    {
        eng:"Weaning meal planner",
        ar:"مخطط النظام الغذائي لمرحلة إدخال الطعام الصلب",
        image:"https://danone-apta-advice.herokuapp.com/fb/Baby-nutrition.jpg", 
        url:"https://www.apta-advice.com/weaning/weaning-meal-planner#6MONTHS", 
        urlAr:"https://www.apta-advice.com/ar/weaning-ar/weaning-meal-planner#6MONTHS",
        langEn:"WeaningMealplanner_EN",
        langAr:"WeaningMealplanner_AR"
    },
    {
        eng:"Would you like to know about something else?",
        ar:"هل تريدين معرفة شيء آخر؟",
        image:"https://danone-apta-advice.herokuapp.com/fb/Logo.jpg", 
        url:"https://www.apta-advice.com/", 
        urlAr:"https://www.apta-advice.com/ar/",
        langEn:"Knowsomethingelse_EN",
        langAr:"Knowsomethingelse_AR"
    },
    {
        eng:"Subscribe to our frequent tips and advice",
        ar:"هل تريدين الاشتراك لمتابعة آخر الأخبار؟",
        image:"https://danone-apta-advice.herokuapp.com/fb/Montly-and-weekly-updates.jpg", 
        type: "subs"
    }
],
    "mth7_9": [
        
    {
        eng:"Breast feeding",
        ar:"الرضاعة الطبيعية",
        image:"https://danone-apta-advice.herokuapp.com/fb/Breast-feeding.jpg", 
        url:"https://www.apta-advice.com/breastfeeding/", 
        urlAr:"https://www.apta-advice.com/ar/breastfeeding-ar",
        langEn:"Breastfeeding_EN",
        langAr:"Breastfeeding_AR"
    },
    {
        eng:"Bottle Feeding",
        ar:"إرضاع طفلك باستخدام زجاجة الرضاعة",
        image:"https://danone-apta-advice.herokuapp.com/fb/Bottle-feeding.jpg", 
        url:"https://www.apta-advice.com/bottle-feeding/", 
        urlAr:"https://www.apta-advice.com/ar/bottle-feeding-ar",
        langEn:"Bottlefeeding_EN",
        langAr:"Bottlefeeding_AR"
    },
    {
        eng:"Baby Development",
        ar:"تطور الطفل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Baby-development.jpg", 
        url:"https://www.apta-advice.com/baby-development-stages/", 
        urlAr:"https://www.apta-advice.com/ar/baby-development-stages-ar",
        langEn:"Babydevelopment_EN",
        langAr:"Babydevelopment_AR"
    },
    {
        eng:"Baby Nutrition",
        ar:"تغذية الطفل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Baby-nutrition.jpg", 
        url:"https://www.apta-advice.com/weaning/weaning-your-baby-7-months/", 
        urlAr:"https://www.apta-advice.com/ar/weaning-ar/weaning-your-baby-7-months",
        langEn:"BabyNutrition_EN",
        langAr:"BabyNutrition_AR"
    },
    {
        eng:"Baby Health",
        ar:"صحة الطفل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Baby-health.jpg", 
        url:"https://www.apta-advice.com/baby-health/", 
        urlAr:"https://www.apta-advice.com/ar/baby-health-ar",
        langEn:"Babyhealth_EN",
        langAr:"Babyhealth_AR"
    },
    {
        eng:"Baby Growth",
        ar:"نمو الطفل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Baby-growth.jpg", 
        url:"https://www.apta-advice.com/baby-growth/", 
        urlAr:"https://www.apta-advice.com/ar/baby-growth-ar",
        langEn:"Babygrowth_EN",
        langAr:"Babygrowth_AR"
    },
    {
        eng:"Baby Allergies",
        ar:"حساسية الطفل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Baby-allergies.jpg", 
        url:"https://www.apta-advice.com/baby-allergies/", 
        urlAr:"https://www.apta-advice.com/ar/baby-allergies-ar",
        langEn:"Babyallergies_EN",
        langAr:"Babyallergies_AR"
    },
    {
        eng:"Weaning meal planner",
        ar:"مخطط النظام الغذائي لمرحلة إدخال الطعام الصلب",
        image:"https://danone-apta-advice.herokuapp.com/fb/Baby-nutrition.jpg", 
        url:"https://www.apta-advice.com/weaning/weaning-meal-planner/", 
        urlAr:"https://www.apta-advice.com/ar/weaning-ar/weaning-meal-planner",
        langEn:"WeaningMealplanner_EN",
        langAr:"WeaningMealplanner_AR"
    },
    {
        eng:"Would you like to know about something else?",
        ar:"هل تريدين معرفة شيء آخر؟",
        image:"https://danone-apta-advice.herokuapp.com/fb/Logo.jpg", 
        url:"https://www.apta-advice.com/", 
        urlAr:"https://www.apta-advice.com/ar/",
        langEn:"Knowsomethingelse_EN",
        langAr:"Knowsomethingelse_AR"
    },
    {
        eng:"Subscribe to our frequent tips and advice",
        ar:"هل تريدين الاشتراك لمتابعة آخر الأخبار؟",
        image:"https://danone-apta-advice.herokuapp.com/fb/Montly-and-weekly-updates.jpg", 
        type: "subs"
    }
],
    "mth10_12": [
    {
        eng:"Baby Development",
        ar:"تطور الطفل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Baby-development.jpg", 
        url:"https://www.apta-advice.com/baby-development-stages/", 
        urlAr:"https://www.apta-advice.com/ar/baby-development-stages-ar",
        langEn:"Babydevelopment_EN",
        langAr:"Babydevelopment_AR"
    },
    {
        eng:"Toddler Nutrition",
        ar:"تغذية الطفل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Toddler-nutrition.jpg", 
        url:"https://www.apta-advice.com/toddler-nutrition", 
        urlAr:"https://www.apta-advice.com/ar/toddler-nutrition-ar",
        langEn:"ToddlerNutrition_EN",
        langAr:"ToddlerNutrition_AR"
    },
    {
        eng:"Toddler Health",
        ar:"صحة الطفل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Shutterstock.jpg", 
        url:"https://www.apta-advice.com/toddler-health/", 
        urlAr:"https://www.apta-advice.com/ar/toddler-health-ar",
        langEn:"ToddlerHealth_EN",
        langAr:"ToddlerHealth_AR"
    },
    {
        eng:"Baby Growth",
        ar:"نمو الطفل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Baby-growth.jpg", 
        url:"https://www.apta-advice.com/baby-growth/", 
        urlAr:"https://www.apta-advice.com/ar/baby-growth-ar",
        langEn:"Babygrowth_EN",
        langAr:"Babygrowth_AR"
    },
    {
        eng:"Know more about products",
        ar:"تعرف أكثر على المنتجات",
        image:"https://danone-apta-advice.herokuapp.com/fb/Know-more-about-products.jpg", 
        url:"https://www.apta-advice.com/apta-products", 
        urlAr:"https://www.apta-advice.com/ar/apta-products-ar",
        langEn:"EN",
        langAr:"AR"
    },
    {
        eng:"Would you like to know about something else?",
        ar:"هل تريدين معرفة شيء آخر؟",
        image:"https://danone-apta-advice.herokuapp.com/fb/carousel.jpg",
        url:"https://www.apta-advice.com/", 
        urlAr:"https://www.apta-advice.com/ar/",
        langEn:"Knowmoreproducts_EN_10_12",
        langAr:"Knowmoreproducts_AR_10_12"
    },
    {
        eng:"Subscribe to our frequent tips and advice",
        ar:"هل تريدين الاشتراك لمتابعة آخر الأخبار؟",
        image:"https://danone-apta-advice.herokuapp.com/fb/Montly-and-weekly-updates.jpg", 
        type: "subs"
    }
],
    "yr1": [
    {
        eng:"Development Milestones",
        ar:"أهم مراحل تطور الطفل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Development-milestone.jpg", 
        url:"https://www.apta-advice.com/toddler-development/milestones/", 
        urlAr:"https://www.apta-advice.com/ar/toddler-development-ar/milestones-ar",
        langEn:"Developingmilestone_EN",
        langAr:"Developingmilestone_AR"
    },
    {
        eng:"Building Immunity",
        ar:"بناء المناعة",
        image:"https://danone-apta-advice.herokuapp.com/fb/Building-immunity.jpg", 
        url:"https://www.apta-advice.com/toddler-development/building-immunity", 
        urlAr:"https://www.apta-advice.com/ar/toddler-development-ar/building-immunity-ar",
        langEn:"Buildingimmunity_EN",
        langAr:"Buildingimmunity_AR"
    },
    {
        eng:"Brain Development",
        ar:"تطور العقل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Brain-development-2.jpg", 
        url:"https://www.apta-advice.com/toddler-development/brain-development/food-for-toddler-brain-development", 
        urlAr:"https://www.apta-advice.com/ar/toddler-development-ar/brain-development-ar/food-toddler-brain-development",
        langEn:"Braindevelopment_EN",
        langAr:"Braindevelopment_AR"
    },
    {
        eng:"Weekly meal plans",
        ar:"خطط الطعام الأسبوعية",
        image:"https://danone-apta-advice.herokuapp.com/fb/Toddler-nutrition.jpg", 
        url:"https://www.apta-advice.com/recipes/years/1", 
        urlAr:"https://www.apta-advice.com/ar/recipes/years/1",
        langEn:"Weeklymealpans_EN",
        langAr:"Weeklymealpans_AR"
    },
    {
        eng:"Take an assessment test",
        ar:"القيام باختبار التقييم",
        image:"https://danone-apta-advice.herokuapp.com/fb/assessment.jpg", 
        url:"https://www.apta-advice.com/toddler-development/milestones/take-an-assessment-test", 
        urlAr:"https://www.apta-advice.com/ar/toddler-development-ar/milestones-ar/take-an-assessment-test",
        langEn:"Takeanassessmenttest_EN",
        langAr:"Takeanassessmenttest_AR"
    },
    {
        eng:"Know more about our products",
        ar:"تعرف أكثر على المنتجات",
        image:"https://danone-apta-advice.herokuapp.com/fb/Know-more-about-products.jpg", 
        url:"http://bit.ly/2DUYFYn", 
        urlAr:"http://bit.ly/2Pvh1nm",
        langEn:"Knowmoreproducts_EN",
        langAr:"Knowmoreproducts_AR"
    },
    {
        eng:"Buy now",
        ar:"اشتري الآن",
        image:"https://danone-apta-advice.herokuapp.com/fb/Aptamil-junior.jpg", 
        url:"http://bit.ly/2O4eWil", 
        urlAr:"http://bit.ly/2OXZncu",
        langEn:"BuyNow_EN",
        langAr:"BuyNow_AR"
    },
    {
        eng:"Would you like to know about something else?",
        ar:"هل تريدين معرفة شيء آخر؟",
        image:"https://danone-apta-advice.herokuapp.com/fb/carousel.jpg",
        url:"https://www.apta-advice.com/", 
        urlAr:"https://www.apta-advice.com/ar/",
        langEn:"Knowsomethingelse_EN",
        langAr:"Knowsomethingelse_AR"
    },
    {
        eng:"Subscribe to our frequent tips and advice",
        ar:"هل تريدين الاشتراك لمتابعة آخر الأخبار؟",
        image:"https://danone-apta-advice.herokuapp.com/fb/Montly-and-weekly-updates.jpg", 
        type: "subs"
    }
],
    "yr2": [
    {
        eng:"Development Milestones",
        ar:"أهم مراحل تطور الطفل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Development-milestone.jpg", 
        url:"https://www.apta-advice.com/toddler-development/milestones/", 
        urlAr:"https://www.apta-advice.com/ar/toddler-development-ar/milestones-ar",
        langEn:"Developingmilestone_EN",
        langAr:"Developingmilestone_AR"
    },
    {
        eng:"Building Immunity",
        ar:"بناء المناعة",
        image:"https://danone-apta-advice.herokuapp.com/fb/Building-immunity.jpg", 
        url:"https://www.apta-advice.com/toddler-development/building-immunity", 
        urlAr:"https://www.apta-advice.com/ar/toddler-development-ar/building-immunity-ar",
        langEn:"Buildingimmunity_EN",
        langAr:"Buildingimmunity_AR"
    },
    {
        eng:"Brain Development",
        ar:"تطور العقل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Brain-development-2.jpg", 
        url:"https://www.apta-advice.com/toddler-development/brain-development/food-for-toddler-brain-development", 
        urlAr:"https://www.apta-advice.com/ar/toddler-development-ar/brain-development-ar/food-toddler-brain-development",
        langEn:"Braindevelopment_EN",
        langAr:"Braindevelopment_AR"
    },
    {
        eng:"Weekly meal plans",
        ar:"خطط الطعام الأسبوعية",
        image:"https://danone-apta-advice.herokuapp.com/fb/Toddler-nutrition.jpg", 
        url:"https://www.apta-advice.com/recipes/years/2", 
        urlAr:"https://www.apta-advice.com/ar/recipes/years/2",
        langEn:"Weeklymealpans_EN",
        langAr:"Weeklymealpans_AR"
    },
    {
        eng:"Take an assessment test",
        ar:"القيام باختبار التقييم",
        image:"https://danone-apta-advice.herokuapp.com/fb/assessment.jpg", 
        url:"https://www.apta-advice.com/toddler-development/milestones/take-an-assessment-test", 
        urlAr:"https://www.apta-advice.com/ar/toddler-development-ar/milestones-ar/take-an-assessment-test",
        langEn:"Takeanassessmenttest_EN",
        langAr:"Takeanassessmenttest_AR"
    },
    {
        eng:"Know more about our products",
        ar:"تعرف أكثر على المنتجات",
        image:"https://danone-apta-advice.herokuapp.com/fb/Know-more-about-products.jpg", 
        url:"http://bit.ly/2DUYFYn", 
        urlAr:"http://bit.ly/2Pvh1nm",
        langEn:"Knowmoreproducts_EN",
        langAr:"Knowmoreproducts_AR"
    },
    {
        eng:"Buy now",
        ar:"اشتري الآن",
        image:"https://danone-apta-advice.herokuapp.com/fb/Aptamil-junior.jpg", 
        url:"http://bit.ly/2O4eWil", 
        urlAr:"http://bit.ly/2OXZncu",
        langEn:"BuyNow_EN",
        langAr:"BuyNow_AR"
    },
    {
        eng:"Would you like to know about something else?",
        ar:"هل تريدين معرفة شيء آخر؟",
        image:"https://danone-apta-advice.herokuapp.com/fb/carousel.jpg",
        url:"https://www.apta-advice.com/", 
        urlAr:"https://www.apta-advice.com/ar/",
        langEn:"Knowsomethingelse_EN",
        langAr:"Knowsomethingelse_AR"
    },
    {
        eng:"Subscribe to our frequent tips and advice",
        ar:"هل تريدين الاشتراك لمتابعة آخر الأخبار؟",
        image:"https://danone-apta-advice.herokuapp.com/fb/Montly-and-weekly-updates.jpg", 
        type: "subs"
    }
],
    "yr3": [
    {
        eng:"Development Milestones",
        ar:"أهم مراحل تطور الطفل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Development-milestone.jpg", 
        url:"https://www.apta-advice.com/toddler-development/milestones/", 
        urlAr:"https://www.apta-advice.com/ar/toddler-development-ar/milestones-ar",
        langEn:"Developingmilestone_EN",
        langAr:"Developingmilestone_AR"
    },
    {
        eng:"Building Immunity",
        ar:"بناء المناعة",
        image:"https://danone-apta-advice.herokuapp.com/fb/Building-immunity.jpg", 
        url:"https://www.apta-advice.com/toddler-development/building-immunity", 
        urlAr:"https://www.apta-advice.com/ar/toddler-development-ar/building-immunity-ar",
        langEn:"Buildingimmunity_EN",
        langAr:"Buildingimmunity_AR"
    },
    {
        eng:"Brain Development",
        ar:"تطور العقل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Brain-development-2.jpg", 
        url:"https://www.apta-advice.com/toddler-development/brain-development/food-for-toddler-brain-development", 
        urlAr:"https://www.apta-advice.com/ar/toddler-development-ar/brain-development-ar/food-toddler-brain-development",
        langEn:"Braindevelopment_EN",
        langAr:"Braindevelopment_AR"
    },
    {
        eng:"Weekly meal plans",
        ar:"خطط الطعام الأسبوعية",
        image:"https://danone-apta-advice.herokuapp.com/fb/Toddler-nutrition.jpg", 
        url:"https://www.apta-advice.com/recipes/years/3", 
        urlAr:"https://www.apta-advice.com/ar/recipes/years/3",
        langEn:"Weeklymealpans_EN",
        langAr:"Weeklymealpans_AR"
    },
    {
        eng:"Take an assessment test",
        ar:"القيام باختبار التقييم",
        image:"https://danone-apta-advice.herokuapp.com/fb/assessment.jpg", 
        url:"https://www.apta-advice.com/toddler-development/milestones/take-an-assessment-test", 
        urlAr:"https://www.apta-advice.com/ar/toddler-development-ar/milestones-ar/take-an-assessment-test",
        langEn:"Takeanassessmenttest_EN",
        langAr:"Takeanassessmenttest_AR"
    },
    {
        eng:"Know more about our products",
        ar:"تعرف أكثر على المنتجات",
        image:"https://danone-apta-advice.herokuapp.com/fb/Know-more-about-products.jpg", 
        url:"http://bit.ly/2DUYFYn", 
        urlAr:"http://bit.ly/2Pvh1nm",
        langEn:"Knowmoreproducts_EN",
        langAr:"Knowmoreproducts_AR"
    },
    {
        eng:"Buy now",
        ar:"اشتري الآن",
        image:"https://danone-apta-advice.herokuapp.com/fb/Aptamil-junior.jpg", 
        url:"https://www.apta-advice.com/apta-products/aptamil-junior-3/", 
        urlAr:"http://bit.ly/2OXZncu",
        langEn:"BuyNow_EN",
        langAr:"BuyNow_AR"
    },
    {
        eng:"Would you like to know about something else?",
        ar:"هل تريدين معرفة شيء آخر؟",
        image:"https://danone-apta-advice.herokuapp.com/fb/carousel.jpg",
        url:"https://www.apta-advice.com/", 
        urlAr:"https://www.apta-advice.com/ar/",
        langEn:"Knowsomethingelse_EN",
        langAr:"Knowsomethingelse_AR"
    },
    {
        eng:"Subscribe to our frequent tips and advice",
        ar:"هل تريدين الاشتراك لمتابعة آخر الأخبار؟",
        image:"https://danone-apta-advice.herokuapp.com/fb/Montly-and-weekly-updates.jpg", 
        type: "subs"
    }
],
    "pre_school": [
    {
        eng:"Development Milestones",
        ar:"أهم مراحل تطور الطفل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Development-milestone.jpg", 
        url:"https://www.apta-advice.com/toddler-development/milestones/", 
        urlAr:"https://www.apta-advice.com/ar/toddler-development-ar/milestones-ar",
        langEn:"Developingmilestone_EN",
        langAr:"Developingmilestone_AR"
    },
    {
        eng:"Building Immunity",
        ar:"بناء المناعة",
        image:"https://danone-apta-advice.herokuapp.com/fb/Building-immunity.jpg", 
        url:"https://www.apta-advice.com/toddler-development/building-immunity", 
        urlAr:"https://www.apta-advice.com/ar/toddler-development-ar/building-immunity-ar",
        langEn:"Buildingimmunity_EN",
        langAr:"Buildingimmunity_AR"
    },
    {
        eng:"Brain Development",
        ar:"تطور العقل",
        image:"https://danone-apta-advice.herokuapp.com/fb/Brain-development-2.jpg", 
        url:"https://www.apta-advice.com/toddler-development/brain-development/food-for-toddler-brain-development", 
        urlAr:"https://www.apta-advice.com/ar/toddler-development-ar/brain-development-ar/food-toddler-brain-development",
        langEn:"Braindevelopment_EN",
        langAr:"Braindevelopment_AR"
    },
    {
        eng:"Weekly meal plans",
        ar:"خطط الطعام الأسبوعية",
        image:"https://danone-apta-advice.herokuapp.com/fb/Toddler-nutrition.jpg", 
        url:"https://www.apta-advice.com/recipes/years/4", 
        urlAr:"https://www.apta-advice.com/ar/recipes/years/4",
        langEn:"Weeklymealpans_EN",
        langAr:"Weeklymealpans_AR"
    },
    {
        eng:"Take an assessment test",
        ar:"القيام باختبار التقييم",
        image:"https://danone-apta-advice.herokuapp.com/fb/assessment.jpg", 
        url:"https://www.apta-advice.com/toddler-development/milestones/take-an-assessment-test", 
        urlAr:"https://www.apta-advice.com/ar/toddler-development-ar/milestones-ar/take-an-assessment-test",
        langEn:"Takeanassessmenttest_EN",
        langAr:"Takeanassessmenttest_AR"
    },
    {
        eng:"Games",
        ar:"ألعاب",
        image:"https://danone-apta-advice.herokuapp.com/fb/Games.jpg", 
        url:"https://www.apta-advice.com/toddler-development/games", 
        urlAr:"https://www.apta-advice.com/ar/toddler-development-ar/games-ar",
        langEn:"Games_EN",
        langAr:"Games_AR"
    },
    {
        eng:"Know more about our products",
        ar:"تعرف أكثر على المنتجات",
        image:"https://danone-apta-advice.herokuapp.com/fb/Know-more-about-products.jpg", 
        url:"http://bit.ly/2DUYFYn", 
        urlAr:"http://bit.ly/2Pvh1nm",
        langEn:"Knowmoreproducts_EN",
        langAr:"Knowmoreproducts_AR"
    },
    {
        eng:"Buy now",
        ar:"اشتري الآن",
        image:"https://danone-apta-advice.herokuapp.com/fb/Aptamil-kid.jpg", 
        url:"https://www.apta-advice.com/apta-products/aptamil-kid-4/", 
        urlAr:"http://bit.ly/2z6FaGE",
        langEn:"BuyNow_EN",
        langAr:"BuyNow_AR"
    },
    {
        eng:"Would you like to know about something else?",
        ar:"هل تريدين معرفة شيء آخر؟",
        image:"https://danone-apta-advice.herokuapp.com/fb/carousel.jpg",
        url:"https://www.apta-advice.com/", 
        urlAr:"https://www.apta-advice.com/ar/",
        langEn:"Knowsomethingelse_EN",
        langAr:"Knowsomethingelse_AR"
    },
    {
        eng:"Subscribe to our frequent tips and advice",
        ar:"هل تريدين الاشتراك لمتابعة آخر الأخبار؟",
        image:"https://danone-apta-advice.herokuapp.com/fb/Montly-and-weekly-updates.jpg", 
        type: "subs"
    }
],
    
};
//carousel_data