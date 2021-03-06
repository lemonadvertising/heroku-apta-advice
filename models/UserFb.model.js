var mongose = require('mongoose');
var Schema = mongose.Schema;
var UserScheme = new Schema({
    fbid: {type: Number, index: true, unique: true},
    first_name:{ type : String , "default" : "" },
    last_name:{ type : String , "default" : "" },
    lastAction: { type : String , "default" : "" },
    lastPayload: { type : String , "default" : "" },
    createdDate : { type: Date, default: Date.now },
    offBot:{type : Number , "default" : 0},
    lang:{type : String , "default" : "En"},
    pregnancy_type:{type : String , "default" : ""},
    final_pregnancy_type:{type : String , "default" : ""},
    subscription:{type : String , "default" : ""},
    subonoff:{type : Number , "default" : 0},
    careline_count:{type : Number , "default" : 0},
    careline_time : { type: Date},
    article_count:{type : Number , "default" : 0},
    article_frequency:{type : Number , "default" : 0},
    final_article_frequency:{type : Number , "default" : 0},
    dob : { type: Date},
    dob_entry : { type: Date},
    en_click:{type : Number , "default" : 0},
    ar_click:{type : Number , "default" : 0},
    m_preg_click:{type : Number , "default" : 0},
    preg_click:{type : Number , "default" : 0},
    preg_article_click:{type : Number , "default" : 0},
    pre_preg_click:{type : Number , "default" : 0},
    pre_preg_article_click:{type : Number , "default" : 0},
    motherhood_click:{type : Number , "default" : 0},
    motherhood_article_click:{type : Number , "default" : 0},
    trim_1st_click:{type : Number , "default" : 0},
    trim_1st_more_click:{type : Number , "default" : 0},
    trim_2nd_click:{type : Number , "default" : 0},
    trim_2nd_more_click:{type : Number , "default" : 0},
    trim_3rd_click:{type : Number , "default" : 0},
    trim_3rd_more_click:{type : Number , "default" : 0},
    menu_click:{type : Number , "default" : 0},
    main_menu_click:{type : Number , "default" : 0},
    subscription_click:{type : Number , "default" : 0},
    email_us_click:{type : Number , "default" : 0},
    website_click:{type : Number , "default" : 0},
    buy_now_click:{type : Number , "default" : 0},
    email_us_menu_click:{type : Number , "default" : 0},
    p_policy_click:{type : Number , "default" : 0},
    get_started_click:{type : Number , "default" : 0},
    careline_click:{type : Number , "default" : 0},
    careline_m_click:{type : Number , "default" : 0},
    month0_3_click:{type : Number , "default" : 0},
    month4_6_click:{type : Number , "default" : 0},
    month7_9_click:{type : Number , "default" : 0},
    month10_12_click:{type : Number , "default" : 0},
    oneYr_click:{type : Number , "default" : 0},
    twoYr_click:{type : Number , "default" : 0},
    threeYr_click:{type : Number , "default" : 0},
    pre_school_click:{type : Number , "default" : 0},
    next_click:{type : Number , "default" : 0},
    week6_EN_click:{type : Number , "default" : 0},
    week7_EN_click:{type : Number , "default" : 0},
    week8_EN_click:{type : Number , "default" : 0},
    week9_EN_click:{type : Number , "default" : 0},
    week10_EN_click:{type : Number , "default" : 0},
    week11_EN_click:{type : Number , "default" : 0},
    week12_EN_click:{type : Number , "default" : 0},
    week13_EN_click:{type : Number , "default" : 0},
    week14_EN_click:{type : Number , "default" : 0},
    week15_EN_click:{type : Number , "default" : 0},
    week16_EN_click:{type : Number , "default" : 0},
    week17_EN_click:{type : Number , "default" : 0},
    week18_EN_click:{type : Number , "default" : 0},
    week19_EN_click:{type : Number , "default" : 0},
    week20_EN_click:{type : Number , "default" : 0},
    week21_EN_click:{type : Number , "default" : 0},
    week22_EN_click:{type : Number , "default" : 0},
    week23_EN_click:{type : Number , "default" : 0},
    week24_EN_click:{type : Number , "default" : 0},
    week25_EN_click:{type : Number , "default" : 0},
    week26_EN_click:{type : Number , "default" : 0},
    week27_EN_click:{type : Number , "default" : 0},
    week28_EN_click:{type : Number , "default" : 0},
    week29_EN_click:{type : Number , "default" : 0},
    week30_EN_click:{type : Number , "default" : 0},
    week31_EN_click:{type : Number , "default" : 0},
    week32_EN_click:{type : Number , "default" : 0},
    week33_EN_click:{type : Number , "default" : 0},
    week34_EN_click:{type : Number , "default" : 0},
    week35_EN_click:{type : Number , "default" : 0},
    week36_EN_click:{type : Number , "default" : 0},
    week37_EN_click:{type : Number , "default" : 0},
    week38_EN_click:{type : Number , "default" : 0},
    week39_EN_click:{type : Number , "default" : 0},
    week40_EN_click:{type : Number , "default" : 0},
    week6_AR_click:{type : Number , "default" : 0},
    week7_AR_click:{type : Number , "default" : 0},
    week8_AR_click:{type : Number , "default" : 0},
    week9_AR_click:{type : Number , "default" : 0},
    week10_AR_click:{type : Number , "default" : 0},
    week11_AR_click:{type : Number , "default" : 0},
    week12_AR_click:{type : Number , "default" : 0},
    week13_AR_click:{type : Number , "default" : 0},
    week14_AR_click:{type : Number , "default" : 0},
    week15_AR_click:{type : Number , "default" : 0},
    week16_AR_click:{type : Number , "default" : 0},
    week17_AR_click:{type : Number , "default" : 0},
    week18_AR_click:{type : Number , "default" : 0},
    week19_AR_click:{type : Number , "default" : 0},
    week20_AR_click:{type : Number , "default" : 0},
    week21_AR_click:{type : Number , "default" : 0},
    week22_AR_click:{type : Number , "default" : 0},
    week23_AR_click:{type : Number , "default" : 0},
    week24_AR_click:{type : Number , "default" : 0},
    week25_AR_click:{type : Number , "default" : 0},
    week26_AR_click:{type : Number , "default" : 0},
    week27_AR_click:{type : Number , "default" : 0},
    week28_AR_click:{type : Number , "default" : 0},
    week29_AR_click:{type : Number , "default" : 0},
    week30_AR_click:{type : Number , "default" : 0},
    week31_AR_click:{type : Number , "default" : 0},
    week32_AR_click:{type : Number , "default" : 0},
    week33_AR_click:{type : Number , "default" : 0},
    week34_AR_click:{type : Number , "default" : 0},
    week35_AR_click:{type : Number , "default" : 0},
    week36_AR_click:{type : Number , "default" : 0},
    week37_AR_click:{type : Number , "default" : 0},
    week38_AR_click:{type : Number , "default" : 0},
    week39_AR_click:{type : Number , "default" : 0},
    week40_AR_click:{type : Number , "default" : 0},
    
    Ovulationcalculator_EN:{type : Number , "default" : 0},
    Ovulationcalculator_AR:{type : Number , "default" : 0},
    Improvefertility_EN:{type : Number , "default" : 0},
    Improvefertility_AR:{type : Number , "default" : 0},
    Homepregnancytests_AR:{type : Number , "default" : 0},
    Homepregnancytests_EN:{type : Number , "default" : 0},
    Homepregnancytests_AR:{type : Number , "default" : 0},
    Healthydietpregnancy_EN:{type : Number , "default" : 0},
    Healthydietpregnancy_AR:{type : Number , "default" : 0},
    Supplementsduringpregnancy_EN:{type : Number , "default" : 0},
    Supplementsduringpregnancy_AR:{type : Number , "default" : 0},
    Bodyduringpregnancy_EN:{type : Number , "default" : 0},
    Bodyduringpregnancy_AR:{type : Number , "default" : 0},
    Virtualdelivery_EN:{type : Number , "default" : 0},
    Virtualdelivery_AR:{type : Number , "default" : 0},
    WritebirthPLan_EN:{type : Number , "default" : 0},
    WritebirthPLan_AR:{type : Number , "default" : 0},
    Breastfeeding_EN:{type : Number , "default" : 0},
    Breastfeeding_AR:{type : Number , "default" : 0},
    Babydevelopment_EN:{type : Number , "default" : 0},
    Babydevelopment_AR:{type : Number , "default" : 0},
    Babyhealth_EN:{type : Number , "default" : 0},
    Babyhealth_AR:{type : Number , "default" : 0},
    Babygrowth_EN:{type : Number , "default" : 0},
    Babygrowth_AR:{type : Number , "default" : 0},
    Babyallergies_EN:{type : Number , "default" : 0},
    Babyallergies_AR:{type : Number , "default" : 0},
    Knowsomethingelse_EN:{type : Number , "default" : 0},
    Knowsomethingelse_AR:{type : Number , "default" : 0},
    BabyNutrition_EN:{type : Number , "default" : 0},
    BabyNutrition_AR:{type : Number , "default" : 0},
    WeaningMealplanner_EN:{type : Number , "default" : 0},
    WeaningMealplanner_AR:{type : Number , "default" : 0},
    ToddlerNutrition_EN:{type : Number , "default" : 0},
    ToddlerNutrition_AR:{type : Number , "default" : 0},
    ToddlerHealth_EN:{type : Number , "default" : 0},
    ToddlerHealth_AR:{type : Number , "default" : 0},
    Bottlefeeding_EN:{type : Number , "default" : 0},
    Bottlefeeding_AR:{type : Number , "default" : 0},
    Developingmilestone_EN:{type : Number , "default" : 0},
    Developingmilestone_AR:{type : Number , "default" : 0},
    Buildingimmunity_EN:{type : Number , "default" : 0},
    Buildingimmunity_AR:{type : Number , "default" : 0},
    Braindevelopment_EN:{type : Number , "default" : 0},
    Braindevelopment_AR:{type : Number , "default" : 0},
    Weeklymealpans_EN:{type : Number , "default" : 0},
    Weeklymealpans_AR:{type : Number , "default" : 0},
    Takeanassessmenttest_EN:{type : Number , "default" : 0},
    Takeanassessmenttest_AR:{type : Number , "default" : 0},
    Knowmoreproducts_EN:{type : Number , "default" : 0},
    Knowmoreproducts_AR:{type : Number , "default" : 0},
    Knowmoreproducts_EN_10_12:{type : Number , "default" : 0},
    Knowmoreproducts_AR_10_12:{type : Number , "default" : 0},
    BuyNow_EN:{type : Number , "default" : 0},
    BuyNow_AR:{type : Number , "default" : 0},
    Games_EN:{type : Number , "default" : 0},
    Games_AR:{type : Number , "default" : 0},
    
});
module.exports = mongose.model("UserFb",UserScheme);