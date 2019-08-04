const express = require("express");
const bodyParser = require('body-parser');
//const request = require('request');
const globalData = require('./GlobalData');
const moment = require('moment');

const router = express.Router();
const path = require('path');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

var User = require('../models/UserFb.model');
var email_data = require('../models/email_data.model');
var fs = require('fs');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var pregnancy_report = createCsvWriter({
    path: 'public/Pregnancy_report.csv',
    header: [
        {id: 'p_name', title: 'Profile name'},
        {id: 'lang', title: 'Language'},
        {id: 'j_type', title: 'Journey type'},
        {id: 'data_entry', title: 'Data entry date'},
        {id: 'subs', title: 'Subscription'}
    ]
});

var motherhood_report = createCsvWriter({
    path: 'public/Motherhood_report.csv',
    header: [
        {id: 'p_name', title: 'Profile name'},
        {id: 'lang', title: 'Language'},
        {id: 'dob', title: 'DOB'},
        {id: 'age', title: 'Age'},
        {id: 'data_entry', title: 'Data entry date'},
        {id: 'subs', title: 'Subscription'}
    ],
    encoding:'utf8'
});

var other_report = createCsvWriter({
    path: 'public/Other_report.csv',
    header: [
        {id: 'p_name', title: 'Profile name'},
        {id: 'lang', title: 'Language'},
        {id: 'chat_entry', title: 'Chat started on'},
        {id: 'j_type', title: 'Journey'}
    ]
});
 
//var csvWriter = require('csv-write-stream');

const excel = require('node-excel-export');
const styles = {
  headerDark: {
      font: {
          sz: 14,
          bold: true
      }
    }
};

const motherhood = {
    p_name: { // <- the key should match the actual data key
    displayName: 'Profile name', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    width: 120 // <- width in pixels
  },
    lang: { // <- the key should match the actual data key
    displayName: 'Language', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    width: 120 // <- width in pixels
  },
    dob: { // <- the key should match the actual data key
    displayName: 'DOB', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    width: 120 // <- width in pixels
  },
    age: { // <- the key should match the actual data key
    displayName: 'Age', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    width: 120 // <- width in pixels
  },
    data_entry: { // <- the key should match the actual data key
    displayName: 'Data entry date', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    width: 120 // <- width in pixels
  },
    subs: { // <- the key should match the actual data key
    displayName: 'Subscription', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    width: 120 // <- width in pixels
  }
};

const pregnancy = {
    p_name: { // <- the key should match the actual data key
    displayName: 'Profile name', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    width: 120 // <- width in pixels
  },
    lang: { // <- the key should match the actual data key
    displayName: 'Language', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    width: 120 // <- width in pixels
  },
    j_type: { // <- the key should match the actual data key
    displayName: 'Journey type', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    width: 120 // <- width in pixels
  },
    data_entry: { // <- the key should match the actual data key
    displayName: 'Data entry date', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    width: 120 // <- width in pixels
  },
    subs: { // <- the key should match the actual data key
    displayName: 'Subscription', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    width: 120 // <- width in pixels
  }
};

const other = {
    p_name: { // <- the key should match the actual data key
    displayName: 'Profile name', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    width: 120 // <- width in pixels
  },
    lang: { // <- the key should match the actual data key
    displayName: 'Language', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    width: 120 // <- width in pixels
  },
    chat_entry: { // <- the key should match the actual data key
    displayName: 'Chat started on', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    width: 120 // <- width in pixels
  },
    j_type: { // <- the key should match the actual data key
    displayName: 'Journey', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    width: 120 // <- width in pixels
  }
};



const Unique_data = {
    p_name: { // <- the key should match the actual data key
    displayName: 'Profile name', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    width: 120 // <- width in pixels
  },
    lang: { // <- the key should match the actual data key
    displayName: 'Language', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    width: 120 // <- width in pixels
  },
    chat_entry: { // <- the key should match the actual data key
    displayName: 'Chat started on', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    width: 120 // <- width in pixels
  }
};

const count = {
    c_name: { // <- the key should match the actual data key
    displayName: 'Tracking Details', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    width: 250 // <- width in pixels
  },
    count: { // <- the key should match the actual data key
    displayName: 'Counts', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    width: 60 // <- width in pixels
  }
};

var report ;

router.get('/count', globalData.ensureAuthenticated, function (req, res) {
    //res.setHeader('Content-Type', 'application/json');
    let en_click = 0;
    let ar_click = 0;
    let m_preg_click = 0;
    let preg_click = 0;
    let preg_article_click = 0;
    let pre_preg_click = 0;
    let pre_preg_article_click = 0;
    let motherhood_click = 0;
    let motherhood_article_click = 0;
    let trim_1st_click = 0;
    let trim_1st_more_click = 0;
    let trim_2nd_click = 0;
    let trim_2nd_more_click = 0;
    let trim_3rd_click = 0;
    let trim_3rd_more_click = 0;
    let menu_click = 0;
    let subscription_click = 0;
    let email_us_click = 0;
    let website_click = 0;
    let buy_now_click = 0;
    let email_us_menu_click = 0;
    let p_policy_click = 0;
    let get_started_click = 0;
    let unique_get_started_click=0;
    let careline_click=0;
    
    let main_menu_click=0;
    let next_click=0;
    let careline_m_click=0;

    let subscriberCount = 0;
    
    let drop_off=0;
    User.find().exec(function(err,users){
        if(!err){
            //console.log(users);
            unique_get_started_click=users.length;
            for (var i=0;i<users.length;i++){
                en_click+=users[i].en_click;
                ar_click+=users[i].ar_click;
                m_preg_click+=users[i].m_preg_click;
                preg_click+=users[i].preg_click;
                preg_article_click+=users[i].preg_article_click;
                pre_preg_click+=users[i].pre_preg_click;
                pre_preg_article_click+=users[i].pre_preg_article_click;
                motherhood_click+=users[i].motherhood_click;
                motherhood_article_click+=users[i].motherhood_article_click;
                trim_1st_click+=users[i].trim_1st_click;
                trim_1st_more_click+=users[i].trim_1st_more_click;
                trim_2nd_click+=users[i].trim_2nd_click;
                trim_2nd_more_click+=users[i].trim_2nd_more_click;
                trim_3rd_click+=users[i].trim_3rd_click;
                trim_3rd_more_click+=users[i].trim_3rd_more_click;
                menu_click+=users[i].menu_click;
                subscription_click+=users[i].subscription_click;
                email_us_click+=users[i].email_us_click;
                website_click+=users[i].website_click;
                buy_now_click+=users[i].buy_now_click;
                email_us_menu_click+=users[i].email_us_menu_click;
                p_policy_click+=users[i].p_policy_click;
                get_started_click+=users[i].get_started_click;
                careline_click+=users[i].careline_click;
                
                main_menu_click+=users[i].main_menu_click;
                next_click+=users[i].next_click;
                careline_m_click+=users[i].careline_m_click;
                if(users[i].en_click==0 && users[i].ar_click==0){
                    drop_off+=1;
                }
                if(((users[i].final_pregnancy_type == "Motherhood" && users[i].dob != undefined)  || users[i].final_pregnancy_type == "Pregnancy") && users[i].subonoff == 1){
                    //console.log(users[i].first_name,users[i].subonoff);
                    subscriberCount++;
                }
            }
                get_started_click+=unique_get_started_click;
            //res.status(200).send(JSON.stringify(users));
            let data = {
                en_click,
                ar_click,
                m_preg_click,
                preg_click,
                preg_article_click,
                pre_preg_click,
                pre_preg_article_click,
                motherhood_click,
                motherhood_article_click,
                trim_1st_click,
                trim_1st_more_click,
                trim_2nd_click,
                trim_2nd_more_click,
                trim_3rd_click,
                trim_3rd_more_click,
                menu_click,
                subscription_click,
                email_us_click,
                website_click,
                buy_now_click,
                email_us_menu_click,
                p_policy_click,
                get_started_click,
                unique_get_started_click,
                careline_click,
                main_menu_click,
                next_click,
                careline_m_click,
                drop_off,
                subscriberCount
            };
            res.render('dashboard_count', data);
            
            /*email_data.find().exec(function(err,users){
                if(!err){
                    //console.log(users);
                    for (var i=0;i<users.length;i++){
                        
                    }
                    //console.log(en_click);
                    //res.status(200).send(JSON.stringify(users));
                }
                else{
                    res.sendStatus(403);
                }
            });*/
        }
        else{
            res.sendStatus(403);
        }
    });
});

router.get('/count_report', globalData.ensureAuthenticated, function (req, res) {
    //res.setHeader('Content-Type', 'application/json');
    let en_click = 0;
    let ar_click = 0;
    let m_preg_click = 0;
    let preg_click = 0;
    let preg_article_click = 0;
    let pre_preg_click = 0;
    let pre_preg_article_click = 0;
    let motherhood_click = 0;
    let motherhood_article_click = 0;
    let trim_1st_click = 0;
    let trim_1st_more_click = 0;
    let trim_2nd_click = 0;
    let trim_2nd_more_click = 0;
    let trim_3rd_click = 0;
    let trim_3rd_more_click = 0;
    let menu_click = 0;
    let subscription_click = 0;
    let email_us_click = 0;
    let website_click = 0;
    let buy_now_click = 0;
    let email_us_menu_click = 0;
    let p_policy_click = 0;
    let get_started_click = 0;
    let unique_get_started_click=0;
    let careline_click=0;
    
    let main_menu_click=0;
    let next_click=0;
    let careline_m_click=0;
    let drop_off=0;

    let subscriberCount = 0;

    var udata=[];
    User.find().exec(function(err,users){
        if(!err){
            //console.log(users);
            unique_get_started_click=users.length;
            for (var i=0;i<users.length;i++){
                en_click+=users[i].en_click;
                ar_click+=users[i].ar_click;
                m_preg_click+=users[i].m_preg_click;
                preg_click+=users[i].preg_click;
                preg_article_click+=users[i].preg_article_click;
                pre_preg_click+=users[i].pre_preg_click;
                pre_preg_article_click+=users[i].pre_preg_article_click;
                motherhood_click+=users[i].motherhood_click;
                motherhood_article_click+=users[i].motherhood_article_click;
                trim_1st_click+=users[i].trim_1st_click;
                trim_1st_more_click+=users[i].trim_1st_more_click;
                trim_2nd_click+=users[i].trim_2nd_click;
                trim_2nd_more_click+=users[i].trim_2nd_more_click;
                trim_3rd_click+=users[i].trim_3rd_click;
                trim_3rd_more_click+=users[i].trim_3rd_more_click;
                menu_click+=users[i].menu_click;
                subscription_click+=users[i].subscription_click;
                email_us_click+=users[i].email_us_click;
                website_click+=users[i].website_click;
                buy_now_click+=users[i].buy_now_click;
                email_us_menu_click+=users[i].email_us_menu_click;
                p_policy_click+=users[i].p_policy_click;
                get_started_click+=users[i].get_started_click;
                careline_click+=users[i].careline_click;
                
                main_menu_click+=users[i].main_menu_click;
                next_click+=users[i].next_click;
                careline_m_click+=users[i].careline_m_click;
                if(users[i].en_click==0 && users[i].ar_click==0){
                   drop_off+=1;
                }
                if(((users[i].final_pregnancy_type == "Motherhood" && users[i].dob != undefined)  || users[i].final_pregnancy_type == "Pregnancy") && users[i].subonoff == 1){
                    subscriberCount++;
                }
            }
                get_started_click+=unique_get_started_click;
            //res.status(200).send(JSON.stringify(users));
            
            //console.log(data);
            //res.render('dashboard_count', data);
            let temp={c_name:"Unique Get Started",count:unique_get_started_click};
            udata.push(temp);
            temp={c_name:"Drop off",count:drop_off};
            udata.push(temp);
            temp={c_name:"Clicks on Get Started",count:get_started_click};
            udata.push(temp);
            temp={c_name:"Clicks on English",count:en_click};
            udata.push(temp);
            temp={c_name:"Clicks on Arabic",count:ar_click};
            udata.push(temp);
            temp={c_name:"Pregnancy(from menu)",count:m_preg_click};
            udata.push(temp);
            temp={c_name:"Pregnancy",count:preg_click};
            udata.push(temp);
            temp={c_name:"Pregnancy Article",count:preg_article_click};
            udata.push(temp);
            temp={c_name:"Pre-pregnancy",count:pre_preg_click};
            udata.push(temp);
            temp={c_name:"Pre-pregnancy Article",count:pre_preg_article_click};
            udata.push(temp);
            temp={c_name:"Motherhood",count:motherhood_click};
            udata.push(temp);
            temp={c_name:"Motherhood Article",count:motherhood_article_click};
            udata.push(temp);
            temp={c_name:"Trimester 1st",count:trim_1st_click};
            udata.push(temp);
            temp={c_name:"Trimester 1st more options",count:trim_1st_more_click};
            udata.push(temp);
            temp={c_name:"Trimester 2nd",count:trim_2nd_click};
            udata.push(temp);
            temp={c_name:"Trimester 2nd more options",count:trim_2nd_more_click};
            udata.push(temp);
            temp={c_name:"Trimester 3rd",count:trim_3rd_click};
            udata.push(temp);
            temp={c_name:"Trimester 3rd more options",count:trim_3rd_more_click};
            udata.push(temp);
            temp={c_name:"Next(DOB form)",count:next_click};
            udata.push(temp);
            temp={c_name:"Menu",count:menu_click};
            udata.push(temp);
            temp={c_name:"Menu(footer)",count:main_menu_click};
            udata.push(temp);
            temp={c_name:"Manage subscription",count:subscription_click};
            udata.push(temp);
            temp={c_name:"Email us",count:email_us_click};
            udata.push(temp);
            temp={c_name:"Go to website",count:website_click};
            udata.push(temp);
            temp={c_name:"Buy now(footer)",count:buy_now_click};
            udata.push(temp);
            temp={c_name:"Email us(footer)",count:email_us_menu_click};
            udata.push(temp);
            temp={c_name:"Privacy policy",count:p_policy_click};
            udata.push(temp);
            temp={c_name:"contact careline",count:careline_click};
            udata.push(temp);
            temp={c_name:"contact careline(footer)",count:careline_m_click};
            udata.push(temp);

            temp={c_name:"Total Subscribers",count:subscriberCount};
            udata.push(temp);
            
            report = excel.buildExport(
              [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                {
                  name: "Count", // <- Specify sheet name (optional)
                  specification: count, // <- Report specification
                  data: udata // <-- Report data
                }
              ]
            );
            res.attachment('Count.xlsx'); // This is sails.js specific (in general you need to set headers)
            return res.send(report);
        }
        else{
            res.sendStatus(403);
        }
    });
});

router.get('/articlesCount', globalData.ensureAuthenticated, function (req, res) {
    //res.setHeader('Content-Type', 'application/json');
    let month0_3_click=0;
    let month4_6_click=0;
    let month7_9_click=0;
    let month10_12_click=0;
    let oneYr_click=0;
    let twoYr_click=0;
    let threeYr_click=0;
    let pre_school_click=0;
    
    let week6_EN_click = 0;
    let week7_EN_click = 0;
    let week8_EN_click = 0;
    let week9_EN_click = 0;
    let week10_EN_click = 0;
    let week11_EN_click = 0;
    let week12_EN_click = 0;
    let week13_EN_click = 0;
    let week14_EN_click = 0;
    let week15_EN_click = 0;
    let week16_EN_click = 0;
    let week17_EN_click = 0;
    let week18_EN_click = 0;
    let week19_EN_click = 0;
    let week20_EN_click = 0;
    let week21_EN_click = 0;
    let week22_EN_click = 0;
    let week23_EN_click = 0;
    let week24_EN_click = 0;
    let week25_EN_click = 0;
    let week26_EN_click = 0;
    let week27_EN_click = 0;
    let week28_EN_click = 0;
    let week29_EN_click = 0;
    let week30_EN_click = 0;
    let week31_EN_click = 0;
    let week32_EN_click = 0;
    let week33_EN_click = 0;
    let week34_EN_click = 0;
    let week35_EN_click = 0;
    let week36_EN_click = 0;
    let week37_EN_click = 0;
    let week38_EN_click = 0;
    let week39_EN_click = 0;
    let week40_EN_click = 0;
    let week6_AR_click = 0;
    let week7_AR_click = 0;
    let week8_AR_click = 0;
    let week9_AR_click = 0;
    let week10_AR_click = 0;
    let week11_AR_click = 0;
    let week12_AR_click = 0;
    let week13_AR_click = 0;
    let week14_AR_click = 0;
    let week15_AR_click = 0;
    let week16_AR_click = 0;
    let week17_AR_click = 0;
    let week18_AR_click = 0;
    let week19_AR_click = 0;
    let week20_AR_click = 0;
    let week21_AR_click = 0;
    let week22_AR_click = 0;
    let week23_AR_click = 0;
    let week24_AR_click = 0;
    let week25_AR_click = 0;
    let week26_AR_click = 0;
    let week27_AR_click = 0;
    let week28_AR_click = 0;
    let week29_AR_click = 0;
    let week30_AR_click = 0;
    let week31_AR_click = 0;
    let week32_AR_click = 0;
    let week33_AR_click = 0;
    let week34_AR_click = 0;
    let week35_AR_click = 0;
    let week36_AR_click = 0;
    let week37_AR_click = 0;
    let week38_AR_click = 0;
    let week39_AR_click = 0;
    let week40_AR_click = 0;
    
    let Ovulationcalculator_EN = 0;
    let Ovulationcalculator_AR = 0;
    let Improvefertility_EN = 0;
    let Improvefertility_AR = 0;
    let Homepregnancytests_EN = 0;
    let Homepregnancytests_AR = 0;
    let Healthydietpregnancy_EN = 0;
    let Healthydietpregnancy_AR = 0;
    let Supplementsduringpregnancy_EN = 0;
    let Supplementsduringpregnancy_AR = 0;
    let Bodyduringpregnancy_EN = 0;
    let Bodyduringpregnancy_AR = 0;
    let Virtualdelivery_EN = 0;
    let Virtualdelivery_AR = 0;
    let WritebirthPLan_EN = 0;
    let WritebirthPLan_AR = 0;
    let Breastfeeding_EN = 0;
    let Breastfeeding_AR = 0;
    let Babydevelopment_EN = 0;
    let Babydevelopment_AR = 0;
    let Babyhealth_EN = 0;
    let Babyhealth_AR = 0;
    let Babygrowth_EN = 0;
    let Babygrowth_AR = 0;
    let Babyallergies_EN = 0;
    let Babyallergies_AR = 0;
    let Knowsomethingelse_EN = 0;
    let Knowsomethingelse_AR = 0;
    let BabyNutrition_EN = 0;
    let BabyNutrition_AR = 0;
    let WeaningMealplanner_EN = 0;
    let WeaningMealplanner_AR = 0;
    let ToddlerNutrition_EN = 0;
    let ToddlerNutrition_AR = 0;
    let ToddlerHealth_EN = 0;
    let ToddlerHealth_AR = 0;
    let Bottlefeeding_EN = 0;
    let Bottlefeeding_AR = 0;
    let Developingmilestone_EN = 0;
    let Developingmilestone_AR = 0;
    let Buildingimmunity_EN = 0;
    let Buildingimmunity_AR = 0;
    let Braindevelopment_EN = 0;
    let Braindevelopment_AR = 0;
    let Weeklymealpans_EN = 0;
    let Weeklymealpans_AR = 0;
    let Takeanassessmenttest_EN = 0;
    let Takeanassessmenttest_AR = 0;
    let Knowmoreproducts_EN = 0;
    let Knowmoreproducts_AR = 0;
    let Knowmoreproducts_EN_10_12 = 0;
    let Knowmoreproducts_AR_10_12 = 0;
    let BuyNow_EN = 0;
    let BuyNow_AR = 0;
    let Games_EN = 0;
    let Games_AR = 0;
    
    
    let main_menu_click=0;
    let next_click=0;
    let careline_m_click=0;
    User.find().exec(function(err,users){
        if(!err){
            //console.log(users);
            unique_get_started_click=users.length;
            for (var i=0;i<users.length;i++){
                month0_3_click+=users[i].month0_3_click;
                month4_6_click+=users[i].month4_6_click;
                month7_9_click+=users[i].month7_9_click;
                month10_12_click+=users[i].month10_12_click;
                oneYr_click+=users[i].oneYr_click;
                twoYr_click+=users[i].twoYr_click;
                threeYr_click+=users[i].threeYr_click;
                pre_school_click+=users[i].pre_school_click;
                
                week6_EN_click+=users[i].week6_EN_click;
                week7_EN_click+=users[i].week7_EN_click;
                week8_EN_click+=users[i].week8_EN_click;
                week9_EN_click+=users[i].week9_EN_click;
                week10_EN_click+=users[i].week10_EN_click;
                week11_EN_click+=users[i].week11_EN_click;
                week12_EN_click+=users[i].week12_EN_click;
                week13_EN_click+=users[i].week13_EN_click;
                week14_EN_click+=users[i].week14_EN_click;
                week15_EN_click+=users[i].week15_EN_click;
                week16_EN_click+=users[i].week16_EN_click;
                week17_EN_click+=users[i].week17_EN_click;
                week18_EN_click+=users[i].week18_EN_click;
                week19_EN_click+=users[i].week19_EN_click;
                week20_EN_click+=users[i].week20_EN_click;
                week21_EN_click+=users[i].week21_EN_click;
                week22_EN_click+=users[i].week22_EN_click;
                week23_EN_click+=users[i].week23_EN_click;
                week24_EN_click+=users[i].week24_EN_click;
                week25_EN_click+=users[i].week25_EN_click;
                week26_EN_click+=users[i].week26_EN_click;
                week27_EN_click+=users[i].week27_EN_click;
                week28_EN_click+=users[i].week28_EN_click;
                week29_EN_click+=users[i].week29_EN_click;
                week30_EN_click+=users[i].week30_EN_click;
                week31_EN_click+=users[i].week31_EN_click;
                week32_EN_click+=users[i].week32_EN_click;
                week33_EN_click+=users[i].week33_EN_click;
                week34_EN_click+=users[i].week34_EN_click;
                week35_EN_click+=users[i].week35_EN_click;
                week36_EN_click+=users[i].week36_EN_click;
                week37_EN_click+=users[i].week37_EN_click;
                week38_EN_click+=users[i].week38_EN_click;
                week39_EN_click+=users[i].week39_EN_click;
                week40_EN_click+=users[i].week40_EN_click;
                
                week6_AR_click+=users[i].week6_AR_click;
                week7_AR_click+=users[i].week7_AR_click;
                week8_AR_click+=users[i].week8_AR_click;
                week9_AR_click+=users[i].week9_AR_click;
                week10_AR_click+=users[i].week10_AR_click;
                week11_AR_click+=users[i].week11_AR_click;
                week12_AR_click+=users[i].week12_AR_click;
                week13_AR_click+=users[i].week13_AR_click;
                week14_AR_click+=users[i].week14_AR_click;
                week15_AR_click+=users[i].week15_AR_click;
                week16_AR_click+=users[i].week16_AR_click;
                week17_AR_click+=users[i].week17_AR_click;
                week18_AR_click+=users[i].week18_AR_click;
                week19_AR_click+=users[i].week19_AR_click;
                week20_AR_click+=users[i].week20_AR_click;
                week21_AR_click+=users[i].week21_AR_click;
                week22_AR_click+=users[i].week22_AR_click;
                week23_AR_click+=users[i].week23_AR_click;
                week24_AR_click+=users[i].week24_AR_click;
                week25_AR_click+=users[i].week25_AR_click;
                week26_AR_click+=users[i].week26_AR_click;
                week27_AR_click+=users[i].week27_AR_click;
                week28_AR_click+=users[i].week28_AR_click;
                week29_AR_click+=users[i].week29_AR_click;
                week30_AR_click+=users[i].week30_AR_click;
                week31_AR_click+=users[i].week31_AR_click;
                week32_AR_click+=users[i].week32_AR_click;
                week33_AR_click+=users[i].week33_AR_click;
                week34_AR_click+=users[i].week34_AR_click;
                week35_AR_click+=users[i].week35_AR_click;
                week36_AR_click+=users[i].week36_AR_click;
                week37_AR_click+=users[i].week37_AR_click;
                week38_AR_click+=users[i].week38_AR_click;
                week39_AR_click+=users[i].week39_AR_click;
                week40_AR_click+=users[i].week40_AR_click;
                
                Ovulationcalculator_EN += users[i].Ovulationcalculator_EN;
                Ovulationcalculator_AR += users[i].Ovulationcalculator_AR;
                Improvefertility_EN += users[i].Improvefertility_EN;
                Improvefertility_AR += users[i].Improvefertility_AR;
                Homepregnancytests_EN += users[i].Homepregnancytests_EN;
                Homepregnancytests_AR += users[i].Homepregnancytests_AR;
                Healthydietpregnancy_EN += users[i].Healthydietpregnancy_EN;
                Healthydietpregnancy_AR += users[i].Healthydietpregnancy_AR;
                Supplementsduringpregnancy_EN += users[i].Supplementsduringpregnancy_EN;
                Supplementsduringpregnancy_AR += users[i].Supplementsduringpregnancy_AR;
                Bodyduringpregnancy_EN += users[i].Bodyduringpregnancy_EN;
                Bodyduringpregnancy_AR += users[i].Bodyduringpregnancy_AR;
                Virtualdelivery_EN += users[i].Virtualdelivery_EN;
                Virtualdelivery_AR += users[i].Virtualdelivery_AR;
                WritebirthPLan_EN += users[i].WritebirthPLan_EN;
                WritebirthPLan_AR += users[i].WritebirthPLan_AR;
                Breastfeeding_EN += users[i].Breastfeeding_EN;
                Breastfeeding_AR += users[i].Breastfeeding_AR;
                Babydevelopment_EN += users[i].Babydevelopment_EN;
                Babydevelopment_AR += users[i].Babydevelopment_AR;
                Babyhealth_EN += users[i].Babyhealth_EN;
                Babyhealth_AR += users[i].Babyhealth_AR;
                Babygrowth_EN += users[i].Babygrowth_EN;
                Babygrowth_AR += users[i].Babygrowth_AR;
                Babyallergies_EN += users[i].Babyallergies_EN;
                Babyallergies_AR += users[i].Babyallergies_AR;
                Knowsomethingelse_EN += users[i].Knowsomethingelse_EN;
                Knowsomethingelse_AR += users[i].Knowsomethingelse_AR;
                BabyNutrition_EN += users[i].BabyNutrition_EN;
                BabyNutrition_AR += users[i].BabyNutrition_AR;
                WeaningMealplanner_EN += users[i].WeaningMealplanner_EN;
                WeaningMealplanner_AR += users[i].WeaningMealplanner_AR;
                ToddlerNutrition_EN += users[i].ToddlerNutrition_EN;
                ToddlerNutrition_AR += users[i].ToddlerNutrition_AR;
                ToddlerHealth_EN += users[i].ToddlerHealth_EN;
                ToddlerHealth_AR += users[i].ToddlerHealth_AR;
                Bottlefeeding_EN += users[i].Bottlefeeding_EN;
                Bottlefeeding_AR += users[i].Bottlefeeding_AR;
                Developingmilestone_EN += users[i].Developingmilestone_EN;
                Developingmilestone_AR += users[i].Developingmilestone_AR;
                Buildingimmunity_EN += users[i].Buildingimmunity_EN;
                Buildingimmunity_AR += users[i].Buildingimmunity_AR;
                Braindevelopment_EN += users[i].Braindevelopment_EN;
                Braindevelopment_AR += users[i].Braindevelopment_AR;
                Weeklymealpans_EN += users[i].Weeklymealpans_EN;
                Weeklymealpans_AR += users[i].Weeklymealpans_AR;
                Takeanassessmenttest_EN += users[i].Takeanassessmenttest_EN;
                Takeanassessmenttest_AR += users[i].Takeanassessmenttest_AR;
                Knowmoreproducts_EN += users[i].Knowmoreproducts_EN;
                Knowmoreproducts_AR += users[i].Knowmoreproducts_AR;
                Knowmoreproducts_EN_10_12 += users[i].Knowmoreproducts_EN_10_12;
                Knowmoreproducts_AR_10_12 += users[i].Knowmoreproducts_AR_10_12;
                BuyNow_EN += users[i].BuyNow_EN;
                BuyNow_AR += users[i].BuyNow_AR;
                Games_EN += users[i].Games_EN;
                Games_AR += users[i].Games_AR;
            
            }
            //res.status(200).send(JSON.stringify(users));
            let data = {
                month0_3_click,
                month4_6_click,
                month7_9_click,
                month10_12_click,
                oneYr_click,
                twoYr_click,
                threeYr_click,
                pre_school_click,

                week6_EN_click,
                week7_EN_click,
                week8_EN_click,
                week9_EN_click,
                week10_EN_click,
                week11_EN_click,
                week12_EN_click,
                week13_EN_click,
                week14_EN_click,
                week15_EN_click,
                week16_EN_click,
                week17_EN_click,
                week18_EN_click,
                week19_EN_click,
                week20_EN_click,
                week21_EN_click,
                week22_EN_click,
                week23_EN_click,
                week24_EN_click,
                week25_EN_click,
                week26_EN_click,
                week27_EN_click,
                week28_EN_click,
                week29_EN_click,
                week30_EN_click,
                week31_EN_click,
                week32_EN_click,
                week33_EN_click,
                week34_EN_click,
                week35_EN_click,
                week36_EN_click,
                week37_EN_click,
                week38_EN_click,
                week39_EN_click,
                week40_EN_click,
                week6_AR_click,
                week7_AR_click,
                week8_AR_click,
                week9_AR_click,
                week10_AR_click,
                week11_AR_click,
                week12_AR_click,
                week13_AR_click,
                week14_AR_click,
                week15_AR_click,
                week16_AR_click,
                week17_AR_click,
                week18_AR_click,
                week19_AR_click,
                week20_AR_click,
                week21_AR_click,
                week22_AR_click,
                week23_AR_click,
                week24_AR_click,
                week25_AR_click,
                week26_AR_click,
                week27_AR_click,
                week28_AR_click,
                week29_AR_click,
                week30_AR_click,
                week31_AR_click,
                week32_AR_click,
                week33_AR_click,
                week34_AR_click,
                week35_AR_click,
                week36_AR_click,
                week37_AR_click,
                week38_AR_click,
                week39_AR_click,
                week40_AR_click,
                Ovulationcalculator_EN ,
                Ovulationcalculator_AR ,
                Improvefertility_EN ,
                Improvefertility_AR ,
                Homepregnancytests_EN ,
                Homepregnancytests_AR ,
                Healthydietpregnancy_EN ,
                Healthydietpregnancy_AR ,
                Supplementsduringpregnancy_EN ,
                Supplementsduringpregnancy_AR ,
                Bodyduringpregnancy_EN ,
                Bodyduringpregnancy_AR ,
                Virtualdelivery_EN ,
                Virtualdelivery_AR ,
                WritebirthPLan_EN ,
                WritebirthPLan_AR ,
                Breastfeeding_EN ,
                Breastfeeding_AR ,
                Babydevelopment_EN ,
                Babydevelopment_AR ,
                Babyhealth_EN ,
                Babyhealth_AR ,
                Babygrowth_EN ,
                Babygrowth_AR ,
                Babyallergies_EN ,
                Babyallergies_AR ,
                Knowsomethingelse_EN ,
                Knowsomethingelse_AR ,
                BabyNutrition_EN ,
                BabyNutrition_AR ,
                WeaningMealplanner_EN ,
                WeaningMealplanner_AR ,
                ToddlerNutrition_EN ,
                ToddlerNutrition_AR ,
                ToddlerHealth_EN ,
                ToddlerHealth_AR ,
                Bottlefeeding_EN ,
                Bottlefeeding_AR ,
                Developingmilestone_EN ,
                Developingmilestone_AR ,
                Buildingimmunity_EN ,
                Buildingimmunity_AR ,
                Braindevelopment_EN ,
                Braindevelopment_AR ,
                Weeklymealpans_EN ,
                Weeklymealpans_AR ,
                Takeanassessmenttest_EN ,
                Takeanassessmenttest_AR ,
                Knowmoreproducts_EN ,
                Knowmoreproducts_AR ,
                Knowmoreproducts_EN_10_12 ,
                Knowmoreproducts_AR_10_12 ,
                BuyNow_EN ,
                BuyNow_AR ,
                Games_EN ,
                Games_AR 
            };
            res.render('articles_count', data);
            
            /*email_data.find().exec(function(err,users){
                if(!err){
                    //console.log(users);
                    for (var i=0;i<users.length;i++){
                        
                    }
                    //console.log(en_click);
                    //res.status(200).send(JSON.stringify(users));
                }
                else{
                    res.sendStatus(403);
                }
            });*/
        }
        else{
            res.sendStatus(403);
        }
    });
});

router.get('/articlesCount_report', globalData.ensureAuthenticated, function (req, res) {
    //res.setHeader('Content-Type', 'application/json');
    let month0_3_click=0;
    let month4_6_click=0;
    let month7_9_click=0;
    let month10_12_click=0;
    let oneYr_click=0;
    let twoYr_click=0;
    let threeYr_click=0;
    let pre_school_click=0;
    
    let week6_EN_click = 0;
    let week7_EN_click = 0;
    let week8_EN_click = 0;
    let week9_EN_click = 0;
    let week10_EN_click = 0;
    let week11_EN_click = 0;
    let week12_EN_click = 0;
    let week13_EN_click = 0;
    let week14_EN_click = 0;
    let week15_EN_click = 0;
    let week16_EN_click = 0;
    let week17_EN_click = 0;
    let week18_EN_click = 0;
    let week19_EN_click = 0;
    let week20_EN_click = 0;
    let week21_EN_click = 0;
    let week22_EN_click = 0;
    let week23_EN_click = 0;
    let week24_EN_click = 0;
    let week25_EN_click = 0;
    let week26_EN_click = 0;
    let week27_EN_click = 0;
    let week28_EN_click = 0;
    let week29_EN_click = 0;
    let week30_EN_click = 0;
    let week31_EN_click = 0;
    let week32_EN_click = 0;
    let week33_EN_click = 0;
    let week34_EN_click = 0;
    let week35_EN_click = 0;
    let week36_EN_click = 0;
    let week37_EN_click = 0;
    let week38_EN_click = 0;
    let week39_EN_click = 0;
    let week40_EN_click = 0;
    let week6_AR_click = 0;
    let week7_AR_click = 0;
    let week8_AR_click = 0;
    let week9_AR_click = 0;
    let week10_AR_click = 0;
    let week11_AR_click = 0;
    let week12_AR_click = 0;
    let week13_AR_click = 0;
    let week14_AR_click = 0;
    let week15_AR_click = 0;
    let week16_AR_click = 0;
    let week17_AR_click = 0;
    let week18_AR_click = 0;
    let week19_AR_click = 0;
    let week20_AR_click = 0;
    let week21_AR_click = 0;
    let week22_AR_click = 0;
    let week23_AR_click = 0;
    let week24_AR_click = 0;
    let week25_AR_click = 0;
    let week26_AR_click = 0;
    let week27_AR_click = 0;
    let week28_AR_click = 0;
    let week29_AR_click = 0;
    let week30_AR_click = 0;
    let week31_AR_click = 0;
    let week32_AR_click = 0;
    let week33_AR_click = 0;
    let week34_AR_click = 0;
    let week35_AR_click = 0;
    let week36_AR_click = 0;
    let week37_AR_click = 0;
    let week38_AR_click = 0;
    let week39_AR_click = 0;
    let week40_AR_click = 0;
    
    let Ovulationcalculator_EN = 0;
    let Ovulationcalculator_AR = 0;
    let Improvefertility_EN = 0;
    let Improvefertility_AR = 0;
    let Homepregnancytests_EN = 0;
    let Homepregnancytests_AR = 0;
    let Healthydietpregnancy_EN = 0;
    let Healthydietpregnancy_AR = 0;
    let Supplementsduringpregnancy_EN = 0;
    let Supplementsduringpregnancy_AR = 0;
    let Bodyduringpregnancy_EN = 0;
    let Bodyduringpregnancy_AR = 0;
    let Virtualdelivery_EN = 0;
    let Virtualdelivery_AR = 0;
    let WritebirthPLan_EN = 0;
    let WritebirthPLan_AR = 0;
    let Breastfeeding_EN = 0;
    let Breastfeeding_AR = 0;
    let Babydevelopment_EN = 0;
    let Babydevelopment_AR = 0;
    let Babyhealth_EN = 0;
    let Babyhealth_AR = 0;
    let Babygrowth_EN = 0;
    let Babygrowth_AR = 0;
    let Babyallergies_EN = 0;
    let Babyallergies_AR = 0;
    let Knowsomethingelse_EN = 0;
    let Knowsomethingelse_AR = 0;
    let BabyNutrition_EN = 0;
    let BabyNutrition_AR = 0;
    let WeaningMealplanner_EN = 0;
    let WeaningMealplanner_AR = 0;
    let ToddlerNutrition_EN = 0;
    let ToddlerNutrition_AR = 0;
    let ToddlerHealth_EN = 0;
    let ToddlerHealth_AR = 0;
    let Bottlefeeding_EN = 0;
    let Bottlefeeding_AR = 0;
    let Developingmilestone_EN = 0;
    let Developingmilestone_AR = 0;
    let Buildingimmunity_EN = 0;
    let Buildingimmunity_AR = 0;
    let Braindevelopment_EN = 0;
    let Braindevelopment_AR = 0;
    let Weeklymealpans_EN = 0;
    let Weeklymealpans_AR = 0;
    let Takeanassessmenttest_EN = 0;
    let Takeanassessmenttest_AR = 0;
    let Knowmoreproducts_EN = 0;
    let Knowmoreproducts_AR = 0;
    let Knowmoreproducts_EN_10_12 = 0;
    let Knowmoreproducts_AR_10_12 = 0;
    let BuyNow_EN = 0;
    let BuyNow_AR = 0;
    let Games_EN = 0;
    let Games_AR = 0;
    
    
    let main_menu_click=0;
    let next_click=0;
    let careline_m_click=0;
    var udata=[];
    User.find().exec(function(err,users){
        if(!err){
            //console.log(users);
            unique_get_started_click=users.length;
            for (var i=0;i<users.length;i++){
                month0_3_click+=users[i].month0_3_click;
                month4_6_click+=users[i].month4_6_click;
                month7_9_click+=users[i].month7_9_click;
                month10_12_click+=users[i].month10_12_click;
                oneYr_click+=users[i].oneYr_click;
                twoYr_click+=users[i].twoYr_click;
                threeYr_click+=users[i].threeYr_click;
                pre_school_click+=users[i].pre_school_click;
                
                week6_EN_click+=users[i].week6_EN_click;
                week7_EN_click+=users[i].week7_EN_click;
                week8_EN_click+=users[i].week8_EN_click;
                week9_EN_click+=users[i].week9_EN_click;
                week10_EN_click+=users[i].week10_EN_click;
                week11_EN_click+=users[i].week11_EN_click;
                week12_EN_click+=users[i].week12_EN_click;
                week13_EN_click+=users[i].week13_EN_click;
                week14_EN_click+=users[i].week14_EN_click;
                week15_EN_click+=users[i].week15_EN_click;
                week16_EN_click+=users[i].week16_EN_click;
                week17_EN_click+=users[i].week17_EN_click;
                week18_EN_click+=users[i].week18_EN_click;
                week19_EN_click+=users[i].week19_EN_click;
                week20_EN_click+=users[i].week20_EN_click;
                week21_EN_click+=users[i].week21_EN_click;
                week22_EN_click+=users[i].week22_EN_click;
                week23_EN_click+=users[i].week23_EN_click;
                week24_EN_click+=users[i].week24_EN_click;
                week25_EN_click+=users[i].week25_EN_click;
                week26_EN_click+=users[i].week26_EN_click;
                week27_EN_click+=users[i].week27_EN_click;
                week28_EN_click+=users[i].week28_EN_click;
                week29_EN_click+=users[i].week29_EN_click;
                week30_EN_click+=users[i].week30_EN_click;
                week31_EN_click+=users[i].week31_EN_click;
                week32_EN_click+=users[i].week32_EN_click;
                week33_EN_click+=users[i].week33_EN_click;
                week34_EN_click+=users[i].week34_EN_click;
                week35_EN_click+=users[i].week35_EN_click;
                week36_EN_click+=users[i].week36_EN_click;
                week37_EN_click+=users[i].week37_EN_click;
                week38_EN_click+=users[i].week38_EN_click;
                week39_EN_click+=users[i].week39_EN_click;
                week40_EN_click+=users[i].week40_EN_click;
                
                week6_AR_click+=users[i].week6_AR_click;
                week7_AR_click+=users[i].week7_AR_click;
                week8_AR_click+=users[i].week8_AR_click;
                week9_AR_click+=users[i].week9_AR_click;
                week10_AR_click+=users[i].week10_AR_click;
                week11_AR_click+=users[i].week11_AR_click;
                week12_AR_click+=users[i].week12_AR_click;
                week13_AR_click+=users[i].week13_AR_click;
                week14_AR_click+=users[i].week14_AR_click;
                week15_AR_click+=users[i].week15_AR_click;
                week16_AR_click+=users[i].week16_AR_click;
                week17_AR_click+=users[i].week17_AR_click;
                week18_AR_click+=users[i].week18_AR_click;
                week19_AR_click+=users[i].week19_AR_click;
                week20_AR_click+=users[i].week20_AR_click;
                week21_AR_click+=users[i].week21_AR_click;
                week22_AR_click+=users[i].week22_AR_click;
                week23_AR_click+=users[i].week23_AR_click;
                week24_AR_click+=users[i].week24_AR_click;
                week25_AR_click+=users[i].week25_AR_click;
                week26_AR_click+=users[i].week26_AR_click;
                week27_AR_click+=users[i].week27_AR_click;
                week28_AR_click+=users[i].week28_AR_click;
                week29_AR_click+=users[i].week29_AR_click;
                week30_AR_click+=users[i].week30_AR_click;
                week31_AR_click+=users[i].week31_AR_click;
                week32_AR_click+=users[i].week32_AR_click;
                week33_AR_click+=users[i].week33_AR_click;
                week34_AR_click+=users[i].week34_AR_click;
                week35_AR_click+=users[i].week35_AR_click;
                week36_AR_click+=users[i].week36_AR_click;
                week37_AR_click+=users[i].week37_AR_click;
                week38_AR_click+=users[i].week38_AR_click;
                week39_AR_click+=users[i].week39_AR_click;
                week40_AR_click+=users[i].week40_AR_click;
                
                Ovulationcalculator_EN += users[i].Ovulationcalculator_EN;
                Ovulationcalculator_AR += users[i].Ovulationcalculator_AR;
                Improvefertility_EN += users[i].Improvefertility_EN;
                Improvefertility_AR += users[i].Improvefertility_AR;
                Homepregnancytests_EN += users[i].Homepregnancytests_EN;
                Homepregnancytests_AR += users[i].Homepregnancytests_AR;
                Healthydietpregnancy_EN += users[i].Healthydietpregnancy_EN;
                Healthydietpregnancy_AR += users[i].Healthydietpregnancy_AR;
                Supplementsduringpregnancy_EN += users[i].Supplementsduringpregnancy_EN;
                Supplementsduringpregnancy_AR += users[i].Supplementsduringpregnancy_AR;
                Bodyduringpregnancy_EN += users[i].Bodyduringpregnancy_EN;
                Bodyduringpregnancy_AR += users[i].Bodyduringpregnancy_AR;
                Virtualdelivery_EN += users[i].Virtualdelivery_EN;
                Virtualdelivery_AR += users[i].Virtualdelivery_AR;
                WritebirthPLan_EN += users[i].WritebirthPLan_EN;
                WritebirthPLan_AR += users[i].WritebirthPLan_AR;
                Breastfeeding_EN += users[i].Breastfeeding_EN;
                Breastfeeding_AR += users[i].Breastfeeding_AR;
                Babydevelopment_EN += users[i].Babydevelopment_EN;
                Babydevelopment_AR += users[i].Babydevelopment_AR;
                Babyhealth_EN += users[i].Babyhealth_EN;
                Babyhealth_AR += users[i].Babyhealth_AR;
                Babygrowth_EN += users[i].Babygrowth_EN;
                Babygrowth_AR += users[i].Babygrowth_AR;
                Babyallergies_EN += users[i].Babyallergies_EN;
                Babyallergies_AR += users[i].Babyallergies_AR;
                Knowsomethingelse_EN += users[i].Knowsomethingelse_EN;
                Knowsomethingelse_AR += users[i].Knowsomethingelse_AR;
                BabyNutrition_EN += users[i].BabyNutrition_EN;
                BabyNutrition_AR += users[i].BabyNutrition_AR;
                WeaningMealplanner_EN += users[i].WeaningMealplanner_EN;
                WeaningMealplanner_AR += users[i].WeaningMealplanner_AR;
                ToddlerNutrition_EN += users[i].ToddlerNutrition_EN;
                ToddlerNutrition_AR += users[i].ToddlerNutrition_AR;
                ToddlerHealth_EN += users[i].ToddlerHealth_EN;
                ToddlerHealth_AR += users[i].ToddlerHealth_AR;
                Bottlefeeding_EN += users[i].Bottlefeeding_EN;
                Bottlefeeding_AR += users[i].Bottlefeeding_AR;
                Developingmilestone_EN += users[i].Developingmilestone_EN;
                Developingmilestone_AR += users[i].Developingmilestone_AR;
                Buildingimmunity_EN += users[i].Buildingimmunity_EN;
                Buildingimmunity_AR += users[i].Buildingimmunity_AR;
                Braindevelopment_EN += users[i].Braindevelopment_EN;
                Braindevelopment_AR += users[i].Braindevelopment_AR;
                Weeklymealpans_EN += users[i].Weeklymealpans_EN;
                Weeklymealpans_AR += users[i].Weeklymealpans_AR;
                Takeanassessmenttest_EN += users[i].Takeanassessmenttest_EN;
                Takeanassessmenttest_AR += users[i].Takeanassessmenttest_AR;
                Knowmoreproducts_EN += users[i].Knowmoreproducts_EN;
                Knowmoreproducts_AR += users[i].Knowmoreproducts_AR;
                Knowmoreproducts_EN_10_12 += users[i].Knowmoreproducts_EN_10_12;
                Knowmoreproducts_AR_10_12 += users[i].Knowmoreproducts_AR_10_12;
                BuyNow_EN += users[i].BuyNow_EN;
                BuyNow_AR += users[i].BuyNow_AR;
                Games_EN += users[i].Games_EN;
                Games_AR += users[i].Games_AR;
            
            }
            //res.status(200).send(JSON.stringify(users));
            
            
            
            let temp={c_name:"Ovulation calculator-EN",count:Ovulationcalculator_EN};
            udata.push(temp);
            temp={c_name:"Ovulation calculator-AR",count:Ovulationcalculator_AR};
            udata.push(temp);
            temp={c_name:"Improve fertility-EN",count:Improvefertility_EN};
            udata.push(temp);
            temp={c_name:"Improve fertility-AR",count:Improvefertility_AR};
            udata.push(temp);
            temp={c_name:"Home pregnancy tests-EN",count:Homepregnancytests_EN};
            udata.push(temp);
            temp={c_name:"Home pregnancy tests-AR",count:Homepregnancytests_AR};
            udata.push(temp);
            temp={c_name:"Week 6-EN",count:week6_EN_click};
            udata.push(temp);
            temp={c_name:"Week 6-AR",count:week6_AR_click};
            udata.push(temp);
            temp={c_name:"Week 7-EN",count:week7_EN_click};
            udata.push(temp);
            temp={c_name:"Week 7-AR",count:week7_AR_click};
            udata.push(temp);
            temp={c_name:"Week 8-EN",count:week8_EN_click};
            udata.push(temp);
            temp={c_name:"Week 8-AR",count:week8_AR_click};
            udata.push(temp);
            temp={c_name:"Week 9-EN",count:week9_EN_click};
            udata.push(temp);
            temp={c_name:"Week 9-AR",count:week9_AR_click};
            udata.push(temp);
            temp={c_name:"Week 10-EN",count:week10_EN_click};
            udata.push(temp);
            temp={c_name:"Week 10-AR",count:week10_AR_click};
            udata.push(temp);
            temp={c_name:"Week 11-EN",count:week11_EN_click};
            udata.push(temp);
            temp={c_name:"Week 11-AR",count:week11_AR_click};
            udata.push(temp);
            temp={c_name:"Week 12-EN",count:week12_EN_click};
            udata.push(temp);
            temp={c_name:"Week 12-AR",count:week12_AR_click};
            udata.push(temp);
            temp={c_name:"Week 13-EN",count:week13_EN_click};
            udata.push(temp);
            temp={c_name:"Week 13-AR",count:week13_AR_click};
            udata.push(temp);
            temp={c_name:"Week 14-EN",count:week14_EN_click};
            udata.push(temp);
            temp={c_name:"Week 14-AR",count:week14_AR_click};
            udata.push(temp);
            temp={c_name:"Week 15-EN",count:week15_EN_click};
            udata.push(temp);
            temp={c_name:"Week 15-AR",count:week15_AR_click};
            udata.push(temp);
            temp={c_name:"Week 16-EN",count:week16_EN_click};
            udata.push(temp);
            temp={c_name:"Week 16-AR",count:week16_AR_click};
            udata.push(temp);
            temp={c_name:"Week 17-EN",count:week17_EN_click};
            udata.push(temp);
            temp={c_name:"Week 17-AR",count:week17_AR_click};
            udata.push(temp);
            temp={c_name:"Week 18-EN",count:week18_EN_click};
            udata.push(temp);
            temp={c_name:"Week 18-AR",count:week18_AR_click};
            udata.push(temp);
            temp={c_name:"Week 19-EN",count:week19_EN_click};
            udata.push(temp);
            temp={c_name:"Week 19-AR",count:week19_AR_click};
            udata.push(temp);
            temp={c_name:"Week 20-EN",count:week20_EN_click};
            udata.push(temp);
            temp={c_name:"Week 20-AR",count:week20_AR_click};
            udata.push(temp);
            temp={c_name:"Week 21-EN",count:week21_EN_click};
            udata.push(temp);
            temp={c_name:"Week 21-AR",count:week21_AR_click};
            udata.push(temp);
            temp={c_name:"Week 22-EN",count:week22_EN_click};
            udata.push(temp);
            temp={c_name:"Week 22-AR",count:week22_AR_click};
            udata.push(temp);
            temp={c_name:"Week 23-EN",count:week23_EN_click};
            udata.push(temp);
            temp={c_name:"Week 23-AR",count:week23_AR_click};
            udata.push(temp);
            temp={c_name:"Week 24-EN",count:week24_EN_click};
            udata.push(temp);
            temp={c_name:"Week 24-AR",count:week24_AR_click};
            udata.push(temp);
            temp={c_name:"Week 25-EN",count:week25_EN_click};
            udata.push(temp);
            temp={c_name:"Week 25-AR",count:week25_AR_click};
            udata.push(temp);
            temp={c_name:"Week 26-EN",count:week26_EN_click};
            udata.push(temp);
            temp={c_name:"Week 26-AR",count:week26_AR_click};
            udata.push(temp);
            temp={c_name:"Week 27-EN",count:week27_EN_click};
            udata.push(temp);
            temp={c_name:"Week 27-AR",count:week27_AR_click};
            udata.push(temp);
            temp={c_name:"Week 28-EN",count:week28_EN_click};
            udata.push(temp);
            temp={c_name:"Week 28-AR",count:week28_AR_click};
            udata.push(temp);
            temp={c_name:"Week 29-EN",count:week29_EN_click};
            udata.push(temp);
            temp={c_name:"Week 29-AR",count:week29_AR_click};
            udata.push(temp);
            temp={c_name:"Week 30-EN",count:week30_EN_click};
            udata.push(temp);
            temp={c_name:"Week 30-AR",count:week30_AR_click};
            udata.push(temp);
            temp={c_name:"Week 31-EN",count:week31_EN_click};
            udata.push(temp);
            temp={c_name:"Week 31-AR",count:week31_AR_click};
            udata.push(temp);
            temp={c_name:"Week 32-EN",count:week32_EN_click};
            udata.push(temp);
            temp={c_name:"Week 32-AR",count:week32_AR_click};
            udata.push(temp);
            temp={c_name:"Week 33-EN",count:week33_EN_click};
            udata.push(temp);
            temp={c_name:"Week 33-AR",count:week33_AR_click};
            udata.push(temp);
            temp={c_name:"Week 34-EN",count:week34_EN_click};
            udata.push(temp);
            temp={c_name:"Week 34-AR",count:week34_AR_click};
            udata.push(temp);
            temp={c_name:"Week 35-EN",count:week35_EN_click};
            udata.push(temp);
            temp={c_name:"Week 35-AR",count:week35_AR_click};
            udata.push(temp);
            temp={c_name:"Week 36-EN",count:week36_EN_click};
            udata.push(temp);
            temp={c_name:"Week 36-AR",count:week36_AR_click};
            udata.push(temp);
            temp={c_name:"Week 37-EN",count:week37_EN_click};
            udata.push(temp);
            temp={c_name:"Week 37-AR",count:week37_AR_click};
            udata.push(temp);
            temp={c_name:"Week 38-EN",count:week38_EN_click};
            udata.push(temp);
            temp={c_name:"Week 38-AR",count:week38_AR_click};
            udata.push(temp);
            temp={c_name:"Week 39-EN",count:week39_EN_click};
            udata.push(temp);
            temp={c_name:"Week 39-AR",count:week39_AR_click};
            udata.push(temp);
            temp={c_name:"Week 40-EN",count:week40_EN_click};
            udata.push(temp);
            temp={c_name:"Week 40-Ar",count:week40_AR_click};
            udata.push(temp);
            temp={c_name:"0 to 3 month article",count:month0_3_click};
            udata.push(temp);
            temp={c_name:"4 to 6 month article",count:month4_6_click};
            udata.push(temp);
            temp={c_name:"7 to 9 month article",count:month7_9_click};
            udata.push(temp);
            temp={c_name:"10 to 12 month article",count:month10_12_click};
            udata.push(temp);
            temp={c_name:"One year article",count:oneYr_click};
            udata.push(temp);
            temp={c_name:"Two year article",count:twoYr_click};
            udata.push(temp);
            temp={c_name:"Three year article",count:threeYr_click};
            udata.push(temp);
            temp={c_name:"Pre-school article",count:pre_school_click};
            udata.push(temp);
            temp={c_name:"Healthy diet pregnancy-EN",count:Healthydietpregnancy_EN};
            udata.push(temp);
            temp={c_name:"Healthy diet pregnancy-AR",count:Healthydietpregnancy_AR};
            udata.push(temp);
            temp={c_name:"Supplements during pregnancy-EN",count:Supplementsduringpregnancy_EN};
            udata.push(temp);
            temp={c_name:"Supplements during pregnancy-AR",count:Supplementsduringpregnancy_AR};
            udata.push(temp);
            temp={c_name:"Body during pregnancy-EN",count:Bodyduringpregnancy_EN};
            udata.push(temp);
            temp={c_name:"Body during pregnancy-AR",count:Bodyduringpregnancy_AR};
            udata.push(temp);
            temp={c_name:"Virtual delivery-EN",count:Virtualdelivery_EN};
            udata.push(temp);
            temp={c_name:"Virtual delivery-AR",count:Virtualdelivery_AR};
            udata.push(temp);
            temp={c_name:"Write birthPLan-EN",count:WritebirthPLan_EN};
            udata.push(temp);
            temp={c_name:"Write birthPLan-AR",count:WritebirthPLan_AR};
            udata.push(temp);
            temp={c_name:"Breastfeeding-EN",count:Breastfeeding_EN};
            udata.push(temp);
            temp={c_name:"Breastfeeding-AR",count:Breastfeeding_AR};
            udata.push(temp);
            temp={c_name:"Baby development-EN",count:Babydevelopment_EN};
            udata.push(temp);
            temp={c_name:"Baby development-AR",count:Babydevelopment_AR};
            udata.push(temp);
            temp={c_name:"Baby health-EN",count:Babyhealth_EN};
            udata.push(temp);
            temp={c_name:"Baby health-AR",count:Babyhealth_AR};
            udata.push(temp);
            temp={c_name:"Baby growth-EN",count:Babygrowth_EN};
            udata.push(temp);
            temp={c_name:"Baby growth-AR",count:Babygrowth_AR};
            udata.push(temp);
            temp={c_name:"Baby allergies-EN",count:Babyallergies_EN};
            udata.push(temp);
            temp={c_name:"Baby allergies-AR",count:Babyallergies_AR};
            udata.push(temp);
            temp={c_name:"Know something else-EN",count:Knowsomethingelse_EN};
            udata.push(temp);
            temp={c_name:"Know something else-AR",count:Knowsomethingelse_AR};
            udata.push(temp);
            temp={c_name:"Baby Nutrition-EN",count:BabyNutrition_EN};
            udata.push(temp);
            temp={c_name:"Baby Nutrition-AR",count:BabyNutrition_AR};
            udata.push(temp);
            temp={c_name:"Weaning Meal planner-EN",count:WeaningMealplanner_EN};
            udata.push(temp);
            temp={c_name:"Weaning Meal planner-AR",count:WeaningMealplanner_AR};
            udata.push(temp);
            temp={c_name:"Bottle feeding-EN",count:Bottlefeeding_EN};
            udata.push(temp);
            temp={c_name:"Bottle feeding-AR",count:Bottlefeeding_AR};
            udata.push(temp);
            temp={c_name:"Developing milestone-EN",count:Developingmilestone_EN};
            udata.push(temp);
            temp={c_name:"Developing milestone-AR",count:Developingmilestone_AR};
            udata.push(temp);
            temp={c_name:"Building immunity-EN",count:Buildingimmunity_EN};
            udata.push(temp);
            temp={c_name:"Building immunity-AR",count:Buildingimmunity_AR};
            udata.push(temp);
            temp={c_name:"Brain development-EN",count:Braindevelopment_EN};
            udata.push(temp);
            temp={c_name:"Brain development-AR",count:Braindevelopment_AR};
            udata.push(temp);
            temp={c_name:"Weekly meal pans-EN",count:Weeklymealpans_EN};
            udata.push(temp);
            temp={c_name:"Weekly meal pans-AR",count:Weeklymealpans_AR};
            udata.push(temp);
            temp={c_name:"Take an assessment test-EN",count:Takeanassessmenttest_EN};
            udata.push(temp);
            temp={c_name:"Take an assessment test-AR",count:Takeanassessmenttest_AR};
            udata.push(temp);
            temp={c_name:"Know more products-EN",count:Knowmoreproducts_EN};
            udata.push(temp);
            temp={c_name:"Know more products-AR",count:Knowmoreproducts_AR};
            udata.push(temp);
            temp={c_name:"Know more products-EN(10 to 12 months)",count:Knowmoreproducts_EN_10_12};
            udata.push(temp);
            temp={c_name:"Know more products-AR(10 to 12 months)",count:Knowmoreproducts_AR_10_12};
            udata.push(temp);
            temp={c_name:"Buy Now-EN",count:BuyNow_EN};
            udata.push(temp);
            temp={c_name:"Buy Now-AR",count:BuyNow_AR};
            udata.push(temp);
            temp={c_name:"Games-EN",count:Games_EN};
            udata.push(temp);
            temp={c_name:"Games-AR",count:Games_AR};
            udata.push(temp);
            
            report = excel.buildExport(
              [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                {
                  name: "ArticlesCount", // <- Specify sheet name (optional)
                  specification: count, // <- Report specification
                  data: udata // <-- Report data
                }
              ]
            );
            res.attachment('ArticlesCount.xlsx'); // This is sails.js specific (in general you need to set headers)
            return res.send(report);
        }
        else{
            res.sendStatus(403);
        }
    });
});

router.get('/motherhood/:range', globalData.ensureAuthenticated, function (req, res) {
    
    User.find({$or:[{"final_pregnancy_type":"Motherhood"},{"final_pregnancy_type":"","pregnancy_type":"Motherhood"}],"dob":{$ne:undefined} }).exec(function(err,users){
        if(!err){
            var range=req.params.range;
            //console.log(range);
            var udata=[];
            
            for (var i=0;i<users.length;i++){
                var udob = moment(users[i].dob);
                var month = moment().diff(udob, 'months');
                var ageY = moment().diff(udob, 'years');
                udob.add(ageY, 'years');
                var ageM = moment().diff(udob, 'months');
                udob.add(ageM, 'months');
                //console.log(users[i].first_name+":"+month);
                var dob = moment(moment(users[i].dob),'DD-MM-YYYY');
                dob = moment(dob, "YYYY-MM-DD").subtract(1, 'days');
                dob = moment(dob).format('DD-MM-YYYY');
                var subs='No';
                
                var e_dob = null;
                if(users[i].dob_entry!=undefined){
                    e_dob = moment(users[i].dob_entry,'DD-MM-YYYY');
                    e_dob = moment(users[i].dob_entry).format('DD-MM-YYYY');
                   
                   }
                if(users[i].lang=="En"){
                    users[i].lang="English";
                   }
                else{
                    users[i].lang="Arabic"
                }
                
                if(users[i].subonoff==1){
                    subs=users[i].subscription;
                   }
            
                if(range==3 &&  month<=range){
                    var temp=[users[i].first_name+ " "+users[i].last_name,users[i].lang,dob,ageY+"Yr "+ageM+"M",e_dob,subs];
                    udata.push(temp);
                   }
                else if(range==6 &&  month<=range && month>=4){
                    var temp=[users[i].first_name+ " "+users[i].last_name,users[i].lang,dob,ageY+"Yr "+ageM+"M",e_dob,subs];
                    udata.push(temp);
                   }
                else if(range==9 &&  month<=range && month>=7){
                    var temp=[users[i].first_name+ " "+users[i].last_name,users[i].lang,dob,ageY+"Yr "+ageM+"M",e_dob,subs];
                    udata.push(temp);
                   }
                else if(range==12 &&  month<range && month>=10){
                    var temp=[users[i].first_name+ " "+users[i].last_name,users[i].lang,dob,ageY+"Yr "+ageM+"M",e_dob,subs];
                    udata.push(temp);
                   }
                else if(range==24 &&  month<range && month>=12){
                    var temp=[users[i].first_name+ " "+users[i].last_name,users[i].lang,dob,ageY+"Yr "+ageM+"M",e_dob,subs];
                    udata.push(temp);
                   }
                else if(range==36 &&  month<range && month>=24){
                    var temp=[users[i].first_name+ " "+users[i].last_name,users[i].lang,dob,ageY+"Yr "+ageM+"M",e_dob,subs];
                    udata.push(temp);
                   }
                else if(range==48 &&  month<range && month>=36){
                    var temp=[users[i].first_name+ " "+users[i].last_name,users[i].lang,dob,ageY+"Yr "+ageM+"M",e_dob,subs];
                    udata.push(temp);
                   }
                else if(range==49 && month>48){
                    //console.log("a");
                    var temp=[users[i].first_name+ " "+users[i].last_name,users[i].lang,dob,ageY+"Yr "+ageM+"M",e_dob,subs];
                    udata.push(temp);
                   }
            }
            let data = {udata,range};
            //console.log(udata);
            res.render('motherhood_reports',data);
        }
    });
    
});


router.get('/pregnancy', globalData.ensureAuthenticated, function (req, res) {
    
    User.find({$or:[{"final_pregnancy_type":"Pregnancy"},{"final_pregnancy_type":"","pregnancy_type":"Pregnancy"}] }).exec(function(err,users){
        if(!err){
            var range=req.params.range;
            //console.log(range);
            var udata=[];
            var temp_week="NA";
            for (var i=0;i<users.length;i++){
                var subs='No';
                var e_dob = null;
                if(users[i].dob_entry!=undefined){
                    e_dob = moment(users[i].dob_entry,'DD-MM-YYYY');
                    e_dob = moment(users[i].dob_entry).format('DD-MM-YYYY');
                   
                   }
                if(users[i].lang=="En"){
                    users[i].lang="English";
                   }
                else{
                    users[i].lang="Arabic"
                }
                
                if(users[i].subonoff==1){
                    subs=users[i].subscription;
                   }
                if(users[i].final_pregnancy_type!="Pregnancy"){
                   temp_week="NA";
                   }
                if(users[i].final_article_frequency!=0){
                   temp_week='Week'+users[i].final_article_frequency;
                   }
                else if(users[i].article_frequency!=0){
                   temp_week='Week'+users[i].article_frequency;
                   }
                var temp=[users[i].first_name+ " "+users[i].last_name,users[i].lang,temp_week,e_dob,subs];
                udata.push(temp);
            }
            let data = {udata};
            console.log(udata);
            res.render('pregnancy_reports',data);
        }
    });
    
});


router.get('/other', globalData.ensureAuthenticated, function (req, res) {
    
    User.find({$or:[{"final_pregnancy_type":"","pregnancy_type":""},{"final_pregnancy_type":"Pre-Pregnancy","pregnancy_type":"Pre-Pregnancy"},{"pregnancy_type":"Pre-Pregnancy","final_pregnancy_type":""},{"pregnancy_type":"Motherhood","dob":{$eq:undefined}}] }).exec(function(err,users){
        if(!err){
            var range=req.params.range;
            //console.log(range);
            var udata=[];
            var udob=null;
            var ageY=null;
            var ageM=null;
            var dob=null;
            var age=null;
            
            for (var i=0;i<users.length;i++){
                /*if(users[i].pregnancy_type=="Motherhood"){
                    udob = moment(users[i].dob);
                    ageY = moment().diff(udob, 'years');
                    udob.add(ageY, 'years');
                    ageM = moment().diff(udob, 'months');
                    udob.add(ageM, 'months');
                    dob = moment(moment(users[i].dob),'DD-MM-YYYY');
                    dob = moment(dob).format('DD-MM-YYYY');
                    age=ageY+"."+ageM+" Yr";
                    if(age=="0.0 Yr"){
                       age=null;
                       }
                   }*/
                var journey=users[i].pregnancy_type;
                
                var e_dob = null;
                e_dob = moment(users[i].createdDate,'DD-MM-YYYY');
                e_dob = moment(users[i].createdDate).format('DD-MM-YYYY');
                if(users[i].lang=="En"){
                    users[i].lang="English";
                   }
                else{
                    users[i].lang="Arabic"
                }
            
                //var temp=[users[i].first_name+ " "+users[i].last_name,users[i].lang,dob,age,e_dob,journey];
                var temp=[users[i].first_name+ " "+users[i].last_name,users[i].lang,e_dob,journey];
                if(users[i].fbid!=1234567890){
                    udata.push(temp);
                   }
            }
            let data = {udata};
            //console.log(udata);
            res.render('other_reports',data);
        }
    });
    
});



router.get('/unique_data', globalData.ensureAuthenticated, function (req, res) {
    var from = req.query.from;
    var to = req.query.to;
    var repoType = req.query.r_type;
    //console.log(repoType);
    if(from==undefined && to==undefined){
        User.find().exec(function(err,users){
            if(!err){
                var udata=[];
                var udata2=[];
                var fname ="Unique_data";
                for (var i=0;i<users.length;i++){
                    var journey=users[i].pregnancy_type;

                    var e_dob = null;
                    e_dob = moment(users[i].createdDate,'DD-MM-YYYY');
                    e_dob = moment(users[i].createdDate).format('DD-MM-YYYY');
                    if(users[i].lang=="En"){
                        users[i].lang="English";
                       }
                    else{
                        users[i].lang="Arabic"
                    }

                    var temp=[users[i].first_name+ " "+users[i].last_name,users[i].lang,e_dob];
                    var temp2={p_name:users[i].first_name+ " "+users[i].last_name,lang:users[i].lang,chat_entry:e_dob};
                    if(users[i].fbid!=1234567890){
                        udata.push(temp);
                        udata2.push(temp2);
                       }
                }
                let data = {udata};
                if(repoType=="report"){
                    
                    report = excel.buildExport(
                      [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                        {
                          name: fname, // <- Specify sheet name (optional)
                          specification: Unique_data, // <- Report specification
                          data: udata2 // <-- Report data
                        }
                      ]
                    );
                    res.attachment(fname+'.xlsx'); // This is sails.js specific (in general you need to set headers)
                    return res.send(report);
                   }
                else{
                    res.render('unique_data_reports',data);
                }
                
            }
        });
       
       }
    else{
        //console.log(from);
        //console.log(to);
        var fromData = from.split("-");
        var toData = to.split("-");
        from = new Date(fromData[2]+"-"+fromData[1]+"-"+fromData[0]);
        to = new Date(toData[2]+"-"+toData[1]+"-"+toData[0]);
        //console.log("a");
        if(repoType=="sameDate"){
            //console.log("c");
           to.setHours(23, 59, 59);
            from.setHours(00, 00, 00);
            User.find({"createdDate":{$gte:from,$lte:to}}).exec(function(err,users){
                if(!err){
                    var udata=[];
                    var udata2=[];
                    //console.log("b");
                    //console.log(users);
                    var fname ="Unique_data";
                    for (var i=0;i<users.length;i++){
                        var journey=users[i].pregnancy_type;

                        var e_dob = null;
                        e_dob = moment(users[i].createdDate,'DD-MM-YYYY');
                        e_dob = moment(users[i].createdDate).format('DD-MM-YYYY');
                        if(users[i].lang=="En"){
                            users[i].lang="English";
                           }
                        else{
                            users[i].lang="Arabic"
                        }

                        var temp=[users[i].first_name+ " "+users[i].last_name,users[i].lang,e_dob];
                        var temp2={p_name:users[i].first_name+ " "+users[i].last_name,lang:users[i].lang,chat_entry:e_dob};
                        if(users[i].fbid!=1234567890){
                            udata.push(temp);
                            udata2.push(temp2);
                           }
                    }
                    let data = {udata};

                    if(repoType=="sameDate"){
                        //console.log(udata);
                        report = excel.buildExport(
                          [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                            {
                              name: fname, // <- Specify sheet name (optional)
                              specification: Unique_data, // <- Report specification
                              data: udata2 // <-- Report data
                            }
                          ]
                        );
                        from = from.getDate()+"-"+(from.getMonth()+1)+"-"+from.getFullYear();
                        to = to.getDate()+"-"+(to.getMonth()+1)+"-"+to.getFullYear();
                        res.attachment(fname+"_"+from+"_"+to+'.xlsx'); // This is sails.js specific (in general you need to set headers)
                        return res.send(report);
                       }
                    else{
                        res.render('unique_data_reports',data);
                    }

                }
            });
            return;
           }
        
        if(repoType!="report"){
            to.setHours(23, 59, 59);
            from.setHours(00, 00, 00);
        }
        
        
        
        User.find({"createdDate":{$gte:from,$lte:to}}).exec(function(err,users){
            if(!err){
                var udata=[];
                var udata2=[];
                //console.log(users);
                var fname ="Unique_data";
                for (var i=0;i<users.length;i++){
                    var journey=users[i].pregnancy_type;

                    var e_dob = null;
                    e_dob = moment(users[i].createdDate,'DD-MM-YYYY');
                    e_dob = moment(users[i].createdDate).format('DD-MM-YYYY');
                    if(users[i].lang=="En"){
                        users[i].lang="English";
                       }
                    else{
                        users[i].lang="Arabic"
                    }

                    var temp=[users[i].first_name+ " "+users[i].last_name,users[i].lang,e_dob];
                    var temp2={p_name:users[i].first_name+ " "+users[i].last_name,lang:users[i].lang,chat_entry:e_dob};
                    if(users[i].fbid!=1234567890){
                        udata.push(temp);
                        udata2.push(temp2);
                       }
                }
                let data = {udata};
                 
                if(repoType=="report"){
                    //console.log(udata);
                    report = excel.buildExport(
                      [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                        {
                          name: fname, // <- Specify sheet name (optional)
                          specification: Unique_data, // <- Report specification
                          data: udata2 // <-- Report data
                        }
                      ]
                    );
                    from = from.getDate()+"-"+(from.getMonth()+1)+"-"+from.getFullYear();
                    to = to.getDate()+"-"+(to.getMonth()+1)+"-"+to.getFullYear();
                    res.attachment(fname+"_"+from+"_"+to+'.xlsx'); // This is sails.js specific (in general you need to set headers)
                    return res.send(report);
                   }
                else{
                    res.render('unique_data_reports',data);
                }
                
            }
        });
    }
    
});


router.get('/pregnancy_report', globalData.ensureAuthenticated, function (req, res) {
    
    User.find({$or:[{"final_pregnancy_type":"Pregnancy"},{"final_pregnancy_type":"","pregnancy_type":"Pregnancy"}] }).exec(function(err,users){
        if(!err){
            var range=req.params.range;
            //console.log(range);
            var udata=[];
            var temp_week="NA";
            var fname = "pregnancy";
            for (var i=0;i<users.length;i++){
                var subs='No';
                var e_dob = null;
                if(users[i].dob_entry!=undefined){
                    e_dob = moment(users[i].dob_entry,'DD-MM-YYYY');
                    e_dob = moment(users[i].dob_entry).format('DD-MM-YYYY');
                   
                   }
                if(users[i].lang=="En"){
                    users[i].lang="English";
                   }
                else{
                    users[i].lang="Arabic"
                }
                
                if(users[i].subonoff==1){
                    subs=users[i].subscription;
                   }
                if(users[i].final_pregnancy_type!="Pregnancy"){
                   temp_week="NA";
                   }
                if(users[i].final_article_frequency!=0){
                   temp_week='Week'+users[i].final_article_frequency;
                   }
                
                let temp = {p_name:users[i].first_name+ " "+users[i].last_name,lang:users[i].lang,j_type:'Week'+users[i].final_article_frequency,data_entry:e_dob,subs:subs};
                udata.push(temp);
            }
            
            
            report = excel.buildExport(
              [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                {
                  name: fname, // <- Specify sheet name (optional)
                  specification: pregnancy, // <- Report specification
                  data: udata // <-- Report data
                }
              ]
            );
            res.attachment(fname+'.xlsx'); // This is sails.js specific (in general you need to set headers)
            return res.send(report);
        }
    });
    
});

router.get('/motherhood_report/:range', globalData.ensureAuthenticated, function (req, res) {
    
    User.find({$or:[{"final_pregnancy_type":"Motherhood"},{"final_pregnancy_type":"","pregnancy_type":"Motherhood"}],"dob":{$ne:undefined} }).exec(function(err,users){
        if(!err){
            var range=req.params.range;
            //console.log(range);
            var udata=[];
            var fname="report";
            
            for (var i=0;i<users.length;i++){
                var udob = moment(users[i].dob);
                var month = moment().diff(udob, 'months');
                var ageY = moment().diff(udob, 'years');
                udob.add(ageY, 'years');
                var ageM = moment().diff(udob, 'months');
                udob.add(ageM, 'months');
                //console.log(users[i].first_name+":"+month);
                var dob = moment(moment(users[i].dob),'DD-MM-YYYY');
                dob = moment(dob, "YYYY-MM-DD").subtract(1, 'days');
                dob = moment(dob).format('DD-MM-YYYY');
                var subs='No';
                
                var e_dob = null;
                if(users[i].dob_entry!=undefined){
                    e_dob = moment(users[i].dob_entry,'DD-MM-YYYY');
                    e_dob = moment(users[i].dob_entry).format('DD-MM-YYYY');
                   
                   }
                if(users[i].lang=="En"){
                    users[i].lang="English";
                   }
                else{
                    users[i].lang="Arabic"
                }
                
                if(users[i].subonoff==1){
                    subs=users[i].subscription;
                   }
            
                if(range==3 &&  month<=range){
                    let temp={p_name:users[i].first_name+ " "+users[i].last_name,lang:users[i].lang,dob:dob,age:ageY+"Yr "+ageM+"M",data_entry:e_dob,subs:subs};
                    udata.push(temp);
                    fname= "Motherhood_0_to_3_month";
                   }
                else if(range==6 &&  month<=range && month>=4){
                    let temp={p_name:users[i].first_name+ " "+users[i].last_name,lang:users[i].lang,dob:dob,age:ageY+"Yr "+ageM+"M",data_entry:e_dob,subs:subs};
                    udata.push(temp);
                    fname= "Motherhood_4_to_6_month";
                   }
                else if(range==9 &&  month<=range && month>=7){
                    let temp={p_name:users[i].first_name+ " "+users[i].last_name,lang:users[i].lang,dob:dob,age:ageY+"Yr "+ageM+"M",data_entry:e_dob,subs:subs};
                    udata.push(temp);
                    fname= "Motherhood_7_to_9_month";
                   }
                else if(range==12 &&  month<range && month>=10){
                    let temp={p_name:users[i].first_name+ " "+users[i].last_name,lang:users[i].lang,dob:dob,age:ageY+"Yr "+ageM+"M",data_entry:e_dob,subs:subs};
                    udata.push(temp);
                    fname= "Motherhood_10_to_12_month";
                   }
                else if(range==24 &&  month<range && month>=12){
                    let temp={p_name:users[i].first_name+ " "+users[i].last_name,lang:users[i].lang,dob:dob,age:ageY+"Yr "+ageM+"M",data_entry:e_dob,subs:subs};
                    udata.push(temp);
                    fname= "Motherhood_1Yr";
                   }
                else if(range==36 &&  month<range && month>=24){
                    let temp={p_name:users[i].first_name+ " "+users[i].last_name,lang:users[i].lang,dob:dob,age:ageY+"Yr "+ageM+"M",data_entry:e_dob,subs:subs};
                    udata.push(temp);
                    fname= "Motherhood_2Yr";
                   }
                else if(range==48 &&  month<range && month>=36){
                    let temp={p_name:users[i].first_name+ " "+users[i].last_name,lang:users[i].lang,dob:dob,age:ageY+"Yr "+ageM+"M",data_entry:e_dob,subs:subs};
                    udata.push(temp);
                    fname= "Motherhood_3Yr";
                   }
                else if(range==49 && month>48){
                    let temp={p_name:users[i].first_name+ " "+users[i].last_name,lang:users[i].lang,dob:dob,age:ageY+"Yr "+ageM+"M",data_entry:e_dob,subs:subs};
                    udata.push(temp);
                    fname= "Motherhood_pre_school";
                   }
            }
            report = excel.buildExport(
              [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                {
                  name: fname, // <- Specify sheet name (optional)
                  specification: motherhood, // <- Report specification
                  data: udata // <-- Report data
                }
              ]
            );
            res.attachment(fname+'.xlsx'); // This is sails.js specific (in general you need to set headers)
            return res.send(report);
            
        }
    });
    
});

router.get('/other_report', globalData.ensureAuthenticated, function (req, res) {
    
    User.find({$or:[{"final_pregnancy_type":"","pregnancy_type":""},{"final_pregnancy_type":"Pre-Pregnancy","pregnancy_type":"Pre-Pregnancy"},{"pregnancy_type":"Pre-Pregnancy","final_pregnancy_type":""},{"pregnancy_type":"Motherhood","dob":{$eq:undefined}}] }).exec(function(err,users){
        if(!err){
            var range=req.params.range;
            //console.log(range);
            var udata=[];
            var udob=null;
            var ageY=null;
            var ageM=null;
            var dob=null;
            var age=null;
            var fname ="Other";
            
            for (var i=0;i<users.length;i++){
                /*if(users[i].pregnancy_type=="Motherhood"){
                    udob = moment(users[i].dob);
                    ageY = moment().diff(udob, 'years');
                    udob.add(ageY, 'years');
                    ageM = moment().diff(udob, 'months');
                    udob.add(ageM, 'months');
                    dob = moment(moment(users[i].dob),'DD-MM-YYYY');
                    dob = moment(dob).format('DD-MM-YYYY');
                    age=ageY+"."+ageM+" Yr";
                    if(age=="0.0 Yr"){
                       age=null;
                       }
                   }*/
                var journey=users[i].pregnancy_type;
                
                var e_dob = null;
                e_dob = moment(users[i].createdDate,'DD-MM-YYYY');
                e_dob = moment(users[i].createdDate).format('DD-MM-YYYY');
                if(users[i].lang=="En"){
                    users[i].lang="English";
                   }
                else{
                    users[i].lang="Arabic"
                }
            
                let temp={p_name:users[i].first_name+ " "+users[i].last_name,lang:users[i].lang,chat_entry:e_dob,j_type:journey};
                if(users[i].fbid!=1234567890){
                    udata.push(temp);
                   }
            }
            report = excel.buildExport(
              [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                {
                  name: fname, // <- Specify sheet name (optional)
                  specification: other, // <- Report specification
                  data: udata // <-- Report data
                }
              ]
            );
            res.attachment(fname+'.xlsx'); // This is sails.js specific (in general you need to set headers)
            return res.send(report);
        }
    });
    
});

module.exports = router;