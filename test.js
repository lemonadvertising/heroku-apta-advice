/*for(var i=1;i<=44;i++){
        range=i+(i*3);
        if(44<=range){
            console.log(range);
            break;
           }
    }*/

/*var user = "aaa";
 var fbid = 22189875319271;
 if(user == "aaa" && (fbid == 2267403429958099 || fbid == 2372546742773174 || fbid == 2213589875319271 || fbid == 2036531283049793)){
     console.log(fbid);
 }*/
var user = "weekly";
var todaysDate = new Date();
var days = [0,1,4,5,6];
if(user == "weekly" && days.includes(todaysDate.getDay()+1)){
    console.log(todaysDate.getDay());
}
else{
    console.log("NA");
}