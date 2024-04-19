const express=require("express");

const app=require("express")();
const httpServer = require("http").createServer(app);

const mysql=require('mysql')
const cors=require('cors');
const bcrypt=require('bcryptjs')
const dotenv = require('dotenv').config();

const cookieParser=require("cookie-parser")

const path = require("path");
const multer = require('multer');



app.use(cors());
app.use(cookieParser())

//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '0925090339';
 /*const db=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"0925090339",
  database:"teleDb",
  charset : 'utf8mb4',
}) */

const db=mysql.createConnection({
  host:"sql11.freemysqlhosting.net",
  user:"sql11700306",
  password:"x2KyiiHXFh",
  database:"sql11700306",
  charset : 'utf8mb4',
})




var del = db._protocol._delegateError;
db._protocol._delegateError = function(err, sequence){
  if (err.fatal) {
    ////console.trace('fatal error: ' + err.message);
  }
  return del.call(this, err, sequence);
};






app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.get('/',(req,res)=>{
  res.send('hello')
})










app.post('/addbranch',async(req,res)=>{

  //const salt = await bcrypt.genSalt(10)
  //const hashedPassword = await bcrypt.hash(req.body.password, salt)
  const id= req.body.branchName.slice(0,2) + Math.floor(Math.random() * (9999 - 1000 + 1)+ 1000);

  const q="INSERT INTO BranchData (`id`,`branchName`,`userName`,`desc`,`password`) VALUES (?)"
  const values= [id,req.body.branchName,req.body.userName,req.body.desc,req.body.password];
  
  try {
    
    db.query(`SELECT * FROM BranchData WHERE branchName='${req.body.branchName}'`,(err,result)=>{
     

   if (result?.length==0) {
   db.query(`SELECT * FROM BranchData WHERE userName='${req.body.userName}'`,(err,resu)=>{
     if (resu?.length==0) {
       db.query(q,[values],(err,data)=>{


         if(data!=undefined) {
          res.json(
            {
              message:'registerd',
              success:'yes'
            }
          )
          console.log('ok registerd')
          console.log(data!=undefined)
        } 
       })
     }else{
       res.json(
       {
        message:'matched user name',
        success:'no'
      })
       console.log('matched user name')
     }
   })
  }else{
   res.json( {
    message:'matched branch name',
    success:'no'
  })
   console.log('matched branch name')
  }
  
 }) 
  } catch (error) {
    res.json('reg err',error)
    console.log(error)
  }



})

app.get('/getthenewbranchinfo/:branchName',async(req,res)=>{
  try {
    db.query(`SELECT * FROM BranchData WHERE branchName='${req.params.branchName}'`,(err,result)=>{
      const newBranch=result?.map((r)=>{
        return r
      })
      //const match=await bcrypt.compare(password,info.password)

      res.json(newBranch[0])
    })
  } catch (error) {
    
  }
})


app.get('/getallbranchsinfo',async(req,res)=>{
  try {
    db.query(`SELECT * FROM BranchData`,(err,result)=>{
     
     if (result) {
      console.log(result)
      res.json(result)
     }else{
      console.log(err)
     }
      
    })
  } catch (error) {
    console.log(error)
  }
})

app.get('/getbranchinfo/:id',async(req,res)=>{
  try {
    db.query(`SELECT * FROM BranchData WHERE id='${req.params.id}'`,(err,result)=>{
     
     if (result) {
      console.log(result,'single branch info')
      res.json(result[0])
     }else{
      console.log(err)
     }
      
    })
  } catch (error) {
    console.log(error)
  }
})

app.get(`/searchbranchs/:searchText`,async(req,res)=>{
  try {
    db.query(`SELECT * FROM BranchData WHERE branchName LIKE '${req.params.searchText}%' OR userName LIKE '${req.params.searchText}%'`,(err,result)=>{
      if (result) {
        console.log(result)
        res.json(result)
       }else{
        console.log(err)
       }
    })
  } catch (error) {
    console.log(error)
  }
})

app.get('/gettasks',async(req,res)=>{
  try {
    db.query(`SELECT * FROM Tasks`,(err,result)=>{
     
     if (result) {
      console.log(result)
      res.json(result)
     }else{
      console.log(err)
     }
      
    })
  } catch (error) {
    console.log(error)
  }
})


app.post('/addtelebirrreggoal',async(req,res)=>{
  console.log(req.body.agentRegistration)
 try {
  const q="INSERT INTO GoalForTeleBirrRegistration (`agentRegistration`,`merchantRegistration`,`agentActivation`,`merchantActivation`) VALUES (?)"
  const values= [req.body.agentRegistration,req.body.merchantRegistration,req.body.agentActivation,req.body.merchantActivation];
  db.query(q,[values],(err,result)=>{
    if (result) {
      res.json(
        {
          message:'registerd',
          success:'yes'
        }
      )
      console.log('ok registerd')
    }else if (err) {
      console.log(err)
      res.json(
        {
         message:'try again',
         success:'no'
       })
    }
  })
 } catch (error) {
  console.log(error)
 }
})

//GoalForTeleBirrRegistration
app.get('/thismonthtelebirrreggoal',async(req,res)=>{
  try {
    db.query(`SELECT * FROM GoalForTeleBirrRegistration WHERE YEAR(goalDate) = YEAR(CURRENT_DATE()) AND MONTH(goalDate) = MONTH(CURRENT_DATE())`,(err,result)=>{
        console.log(result=='','sdfghjkkjhgfdsasdrtyuioiuytresdfghjkjhgfdty')
     if (result?.length!=0 && result!='' && result!=undefined && result!=null) {
      res.json({
        id:result[0]?.id,
        agentRegistration:result[0]?.agentRegistration,
        merchantRegistration:result[0]?.merchantRegistration,
        agentActivation:result[0]?.agentActivation,
        merchantActivation:result[0]?.merchantActivation,
        goalDate:result[0]?.goalDate,
        message:'found',
        success:'yes'
      })
     }else if(!result || result?.length==0 || err){
      console.log(err)
      res.json({
        id:0,
        agentRegistration:0,
        merchantRegistration:0,
        agentActivation:0,
        merchantActivation:0,
        goalDate:'',
        message:'not found',
        success:'no'
      })
     }
      
    })
  } catch (error) {
    console.log(error)
  }
})


app.put('/updatetelebirrreggoal',async(req,res)=>{
  try {
    db.query(`UPDATE GoalForTeleBirrRegistration SET agentRegistration=?,merchantRegistration=?,agentActivation=?,merchantActivation=?
              WHERE id='${req.body.id}' `,[req.body.agentRegistration,req.body.merchantRegistration,req.body.agentActivation,req.body.merchantActivation],(err,result)=>{
             try {
              if (result) {
                res.json(
                  {
                    message:'updated',
                    success:'yes'
                  }
                )
                console.log('ok updated')
              }else if (err) {
                console.log(err)
                res.json(
                  {
                   message:'try again',
                   success:'no'
                 })
              }
             } catch (error) {
              console.log(error)
             }

              })
  } catch (error) {
    console.log(error)
  }
})



app.post('/addsingletelebirrreggoal',async(req,res)=>{
  console.log(req.body.id)
 try {
  const q="INSERT INTO SingleBranchTeleBirrGoal (`agentRegistration`,`merchantRegistration`,`agentActivation`,`merchantActivation`,`branchId`) VALUES (?)"
  const values= [req.body.agentRegistration,req.body.merchantRegistration,req.body.agentActivation,req.body.merchantActivation,req.body.id];
  db.query(q,[values],(err,result)=>{
    if (result) {
      res.json(
        {
          message:'Added',
          success:'yes'
        }
      )
      console.log('ok registerd')
    }else if (err) {
      console.log(err)
      res.json(
        {
         message:'try again',
         success:'no'
       })
    }
  })
 } catch (error) {
  console.log(error)
 }
})


app.put('/updatesingletelebirrreggoal',async(req,res)=>{
  try {
    db.query(`UPDATE SingleBranchTeleBirrGoal SET agentRegistration=?,merchantRegistration=?,agentActivation=?,merchantActivation=?
              WHERE id='${req.body.id}' `,[req.body.agentRegistration,req.body.merchantRegistration,req.body.agentActivation,req.body.merchantActivation],(err,result)=>{
             try {
              if (result) {
                res.json(
                  {
                    message:'updated',
                    success:'yes'
                  }
                )
                console.log('ok updated')
              }else if (err) {
                console.log(err)
                res.json(
                  {
                   message:'try again',
                   success:'no'
                 })
              }
             } catch (error) {
              console.log(error)
             }

              })
  } catch (error) {
    console.log(error)
  }
})


app.get('/thismonthsingletelebirrreggoal/:id',async(req,res)=>{
  console.log(req.params.id)
  try {
    db.query(`SELECT * FROM SingleBranchTeleBirrGoal WHERE YEAR(goalDate) = YEAR(CURRENT_DATE()) AND MONTH(goalDate) = MONTH(CURRENT_DATE()) AND branchId='${req.params.id}'`,(err,result)=>{
     console.log(result)
     if (result?.length!=0 && result!='' && result!=undefined && result!=null) {
      res.json({
        id:result[0].id,
        agentRegistration:result[0]?.agentRegistration,
        merchantRegistration:result[0]?.merchantRegistration,
        agentActivation:result[0]?.agentActivation,
        merchantActivation:result[0]?.merchantActivation,
        goalDate:result[0]?.goalDate,
        message:'found',
        success:'yes'
      })
     }else if(!result || result?.length==0 || err){
      console.log(err)
      res.json({
        id:0,
        agentRegistration:0,
        merchantRegistration:0,
        agentActivation:0,
        merchantActivation:0,
        goalDate:'',
        message:'not found',
        success:'no'
      })
     }
      
    })
  } catch (error) {
    console.log(error)
  }
})


app.get('/allthismonthsingletelebirrreggoal',async(req,res)=>{
  console.log(req.params.id)
  try {
    db.query(`SELECT * FROM SingleBranchTeleBirrGoal WHERE YEAR(goalDate) = YEAR(CURRENT_DATE()) AND MONTH(goalDate) = MONTH(CURRENT_DATE())`,(err,result)=>{
     console.log(result)
     if (result?.length!=0 && result!='' && result!=undefined && result!=null) {
      console.log({
        agentRegistration:result?.reduce((sum, obj) => sum + obj.agentRegistration, 0),
        merchantRegistration:result?.reduce((sum, obj) => sum + obj.merchantRegistration, 0),
        agentActivation:result?.reduce((sum, obj) => sum + obj.agentActivation, 0),
        merchantActivation:result?.reduce((sum, obj) => sum + obj.merchantActivation, 0),
        message:'found them all',
        success:'yes'
      })
      res.json({
        agentRegistration:result?.reduce((sum, obj) => sum + obj.agentRegistration, 0),
        merchantRegistration:result?.reduce((sum, obj) => sum + obj.merchantRegistration, 0),
        agentActivation:result?.reduce((sum, obj) => sum + obj.agentActivation, 0),
        merchantActivation:result?.reduce((sum, obj) => sum + obj.merchantActivation, 0),
        message:'found',
        success:'yes'
      })
     }else if(!result || result?.length==0 || err){
      console.log(err)
      res.json({
        id:0,
        agentRegistration:0,
        merchantRegistration:0,
        agentActivation:0,
        merchantActivation:0,
        goalDate:'',
        message:'not found',
        success:'no'
      })
     }
      
    })
  } catch (error) {
    console.log(error)
  }
})

app.post('/branchlogin',async(req,res)=>{
  try {
    db.query(`SELECT * FROM BranchData WHERE userName='${req.body.userName}' AND password='${req.body.password}'`,(err,result)=>{
      if (result?.length!=0 && result!='' && result!=undefined && result!=null) {
        console.log(result,'loged in')
        res.json({
          branchName:result[0]?.branchName,
          userName:result[0]?.userName,
          id:result[0]?.id,
          message:'loged in',
          success:'yes',
          auth:'yes'
        })
      }else if(!result || result?.length==0 || err){
        console.log(err,'not loged in')
        res.json({
          branchName:'',
          userName:'',
          id:0,
          message:'not correct',
          success:'no'
        })
      }
     
    })
  } catch (error) {
    
  }
})


app.post('/adddailyletelebirrreggoal',async(req,res)=>{
  console.log(req.body.id)
 try {
  const q="INSERT INTO DailyTeleBirrRegistration (`agentRegistration`,`merchantRegistration`,`agentActivation`,`merchantActivation`,`branchId`) VALUES (?)"
  const values= [req.body.agentRegistration,req.body.merchantRegistration,req.body.agentActivation,req.body.merchantActivation,req.body.id];
  db.query(q,[values],(err,result)=>{
    if (result) {
      res.json(
        {
          message:'Added',
          success:'yes'
        }
      )
      console.log('ok registerd')
    }else if (err) {
      console.log(err)
      res.json(
        {
         message:'try again',
         success:'no'
       })
    }
  })
 } catch (error) {
  console.log(error)
 }
})


app.put('/updatedailytelebirrreggoal',async(req,res)=>{
  try {
    db.query(`UPDATE DailyTeleBirrRegistration SET agentRegistration=?,merchantRegistration=?,agentActivation=?,merchantActivation=?
              WHERE id='${req.body.id}' `,[req.body.agentRegistration,req.body.merchantRegistration,req.body.agentActivation,req.body.merchantActivation],(err,result)=>{
             try {
              if (result) {
                res.json(
                  {
                    message:'updated',
                    success:'yes'
                  }
                )
                console.log('ok updated')
              }else if (err) {
                console.log(err)
                res.json(
                  {
                   message:'try again',
                   success:'no'
                 })
              }
             } catch (error) {
              console.log(error)
             }

              })
  } catch (error) {
    console.log(error)
  }
})

app.get('/thismonthdailytelebirrreggoal/:id',async(req,res)=>{
  console.log(req.params.id)
  try {
    db.query(`SELECT * FROM DailyTeleBirrRegistration WHERE YEAR(goalDate) = YEAR(CURRENT_DATE()) AND MONTH(goalDate) = MONTH(CURRENT_DATE()) AND DAY(goalDate) = DAY(CURRENT_DATE()) AND branchId='${req.params.id}'`,(err,result)=>{
     console.log(result!=undefined,'popppppppppppppppppppppp')
     if (result?.length!=0 && result!='' && result!=undefined && result!=null ) {
      res.json({
        id:result[0]?.id,
        agentRegistration:result[0]?.agentRegistration,
        merchantRegistration:result[0]?.merchantRegistration,
        agentActivation:result[0]?.agentActivation,
        merchantActivation:result[0]?.merchantActivation,
        goalDate:result[0]?.goalDate,
        message:'found',
        success:'yes'
      })
     }else if(!result || result?.length==0 || err){
      console.log(err,'popppppppppppppppppppppp')
      res.json({
        id:0,
        agentRegistration:0,
        merchantRegistration:0,
        agentActivation:0,
        merchantActivation:0,
        goalDate:'',
        message:'not found',
        success:'no'
      })
     }
      
    })
  } catch (error) {
    console.log(error)
  }
})


app.get('/alldailyinamonthforsingletelebirrreggoal/:id',async(req,res)=>{
  console.log(req.params.id)
  try {
    db.query(`SELECT * FROM DailyTeleBirrRegistration WHERE YEAR(goalDate) = YEAR(CURRENT_DATE()) AND MONTH(goalDate) = MONTH(CURRENT_DATE()) AND branchId='${req.params.id}'`,(err,result)=>{
     console.log(result)
     if (result?.length!=0 && result!='' && result!=undefined && result!=null) {
      console.log({
        agentRegistration:result?.reduce((sum, obj) => sum + obj.agentRegistration, 0),
        merchantRegistration:result?.reduce((sum, obj) => sum + obj.merchantRegistration, 0),
        agentActivation:result?.reduce((sum, obj) => sum + obj.agentActivation, 0),
        merchantActivation:result?.reduce((sum, obj) => sum + obj.merchantActivation, 0),
        message:'found them all',
        success:'yes'
      })
    
      res.json({
        agentRegistration:result?.reduce((sum, obj) => sum + obj.agentRegistration, 0),
        merchantRegistration:result?.reduce((sum, obj) => sum + obj.merchantRegistration, 0),
        agentActivation:result?.reduce((sum, obj) => sum + obj.agentActivation, 0),
        merchantActivation:result?.reduce((sum, obj) => sum + obj.merchantActivation, 0),
        message:'found',
        success:'yes'
      })
     }else if(!result || result?.length==0 || err){
      console.log(err)
      res.json({
        id:0,
        agentRegistration:0,
        merchantRegistration:0,
        agentActivation:0,
        merchantActivation:0,
        goalDate:'',
        message:'not found',
        success:'no'
      })
     }
      
    })
  } catch (error) {
    console.log(error)
  }
})

app.get('/oneamonthforsingletelebirrreggoal/:id',async(req,res)=>{
  console.log(req.params.id)
  try {
    db.query(`SELECT * FROM DailyTeleBirrRegistration WHERE YEAR(goalDate) = YEAR(CURRENT_DATE()) AND MONTH(goalDate) = MONTH(CURRENT_DATE()) AND branchId='${req.params.id}' `,(err,result)=>{
     console.log(result)
     if (result?.length!=0 && result!='' && result!=undefined && result!=null) {
      console.log({
        result:result,
        message:'found them all or what',
        success:'yes'
      })
      res.json({
        result:result,
        message:'found them all or what',
        success:'yes'
      })
     }else if(!result || result?.length==0 || err){
      console.log(err)
      res.json({
        result:[],
        message:'not found',
        success:'no'
      })
     }
      
    })
  } catch (error) {
    console.log(error)
  }
})


//////////////////////////////////////////

app.get('/searchthismonthsingletelebirrreggoal/:id/:year/:month',async(req,res)=>{
  console.log(req.params.id)
  console.log(req.params.year)
  console.log(req.params.month)
  try {
    db.query(`SELECT * FROM SingleBranchTeleBirrGoal WHERE YEAR(goalDate) ='${req.params.year}' AND MONTH(goalDate) ='${req.params.month}' AND branchId='${req.params.id}'`,(err,result)=>{
     console.log(result)
     if (result?.length!=0 && result!='' && result!=undefined && result!=null) {
      console.log('search1')
      res.json({
        id:result[0]?.id,
        agentRegistration:result[0]?.agentRegistration,
        merchantRegistration:result[0]?.merchantRegistration,
        agentActivation:result[0]?.agentActivation,
        merchantActivation:result[0]?.merchantActivation,
        goalDate:result[0]?.goalDate,
        message:'found',
        success:'yes'
      })
     }else if(!result || result?.length==0 || err){
      console.log(err)
      res.json({
        id:0,
        agentRegistration:0,
        merchantRegistration:0,
        agentActivation:0,
        merchantActivation:0,
        goalDate:'',
        message:'not found',
        success:'no'
      })
     }
      
    })
  } catch (error) {
    console.log(error)
  }
})


app.get('/searchalldailyinamonthforsingletelebirrreggoal/:id/:year/:month',async(req,res)=>{
  console.log(req.params.id)
  try {
    db.query(`SELECT * FROM DailyTeleBirrRegistration WHERE YEAR(goalDate) ='${req.params.year}' AND MONTH(goalDate) ='${req.params.month}' AND branchId='${req.params.id}'`,(err,result)=>{
     console.log(result)
     if (result?.length!=0 && result!='' && result!=undefined && result!=null) {
      console.log({
        agentRegistration:result?.reduce((sum, obj) => sum + obj.agentRegistration, 0),
        merchantRegistration:result?.reduce((sum, obj) => sum + obj.merchantRegistration, 0),
        agentActivation:result?.reduce((sum, obj) => sum + obj.agentActivation, 0),
        merchantActivation:result?.reduce((sum, obj) => sum + obj.merchantActivation, 0),
        message:'search2 found them all',
        success:'yes'
      })
    
      res.json({
        agentRegistration:result?.reduce((sum, obj) => sum + obj.agentRegistration, 0),
        merchantRegistration:result?.reduce((sum, obj) => sum + obj.merchantRegistration, 0),
        agentActivation:result?.reduce((sum, obj) => sum + obj.agentActivation, 0),
        merchantActivation:result?.reduce((sum, obj) => sum + obj.merchantActivation, 0),
        message:'found',
        success:'yes'
      })
     }else if(!result || result?.length==0 || err){
      console.log(err)
      res.json({
        id:0,
        agentRegistration:0,
        merchantRegistration:0,
        agentActivation:0,
        merchantActivation:0,
        goalDate:'',
        message:'not found',
        success:'no'
      })
     }
      
    })
  } catch (error) {
    console.log(error)
  }
})

app.get('/searchoneamonthforsingletelebirrreggoal/:id/:year/:month',async(req,res)=>{
  console.log(req.params.id)
  try {
    db.query(`SELECT * FROM DailyTeleBirrRegistration WHERE YEAR(goalDate) ='${req.params.year}' AND MONTH(goalDate) ='${req.params.month}' AND branchId='${req.params.id}' `,(err,result)=>{
     console.log(result)
     if (result?.length!=0 && result!='' && result!=undefined && result!=null) {
      console.log({
        result:result,
        message:'search3 found them all or what',
        success:'yes'
      })
      res.json({
        result:result,
        message:'found them',
        success:'yes'
      })
     }else if(!result || result?.length==0 || err){
      console.log(err)
      res.json({
        result:[],
        message:'not found',
        success:'no'
      })
     }
      
    })
  } catch (error) {
    console.log(error)
  }
})


////////////////////////////////////////////////////////////////////////////////////////////////////


app.get('/onemonthtelebirrreggoal/:year/:month',async(req,res)=>{
  try {
    db.query(`SELECT * FROM GoalForTeleBirrRegistration WHERE YEAR(goalDate) = '${req.params.year}' AND MONTH(goalDate) = '${req.params.month}'`,(err,result)=>{
     
     if (result?.length!=0 && result!='' && result!=undefined && result!=null) {
      res.json({
        id:result[0]?.id,
        agentRegistration:result[0]?.agentRegistration,
        merchantRegistration:result[0]?.merchantRegistration,
        agentActivation:result[0]?.agentActivation,
        merchantActivation:result[0]?.merchantActivation,
        goalDate:result[0]?.goalDate,
        message:'found',
        success:'yes'
      })
     }else if(!result || result?.length==0 || err){
      console.log(err)
      res.json({
        id:0,
        agentRegistration:0,
        merchantRegistration:0,
        agentActivation:0,
        merchantActivation:0,
        goalDate:'',
        message:'not found',
        success:'no'
      })
     }
      
    })
  } catch (error) {
    console.log(error)
  }
})


app.get('/searchalldailyinonemonthforsingletelebirrreggoal/:year/:month',async(req,res)=>{
  console.log(req.params.id)
  try {
    db.query(`SELECT * FROM DailyTeleBirrRegistration WHERE YEAR(goalDate) ='${req.params.year}' AND MONTH(goalDate) ='${req.params.month}'`,(err,result)=>{
     console.log(result)
     if (result?.length!=0 && result!='' && result!=undefined && result!=null) {
      console.log({
        agentRegistration:result?.reduce((sum, obj) => sum + obj.agentRegistration, 0),
        merchantRegistration:result?.reduce((sum, obj) => sum + obj.merchantRegistration, 0),
        agentActivation:result?.reduce((sum, obj) => sum + obj.agentActivation, 0),
        merchantActivation:result?.reduce((sum, obj) => sum + obj.merchantActivation, 0),
        message:'search2 found them all',
        success:'yes'
      })
    
      res.json({
        agentRegistration:result?.reduce((sum, obj) => sum + obj.agentRegistration, 0),
        merchantRegistration:result?.reduce((sum, obj) => sum + obj.merchantRegistration, 0),
        agentActivation:result?.reduce((sum, obj) => sum + obj.agentActivation, 0),
        merchantActivation:result?.reduce((sum, obj) => sum + obj.merchantActivation, 0),
        message:'found',
        success:'yes'
      })
     }else if(!result || result?.length==0 || err){
      console.log(err)
      res.json({
        id:0,
        agentRegistration:0,
        merchantRegistration:0,
        agentActivation:0,
        merchantActivation:0,
        goalDate:'',
        message:'not found',
        success:'no'
      })
     }
      
    })
  } catch (error) {
    console.log(error)
  }
})


app.get('/foralldailyinamonthforsingletelebirrreggoal',async(req,res)=>{
  try {
    db.query(`SELECT * FROM DailyTeleBirrRegistration WHERE YEAR(goalDate) = YEAR(CURRENT_DATE()) AND MONTH(goalDate) = MONTH(CURRENT_DATE())`,(err,result)=>{
     console.log(result)
     if (result?.length!=0 && result!='' && result!=undefined && result!=null) {
      console.log({
        agentRegistration:result?.reduce((sum, obj) => sum + obj.agentRegistration, 0),
        merchantRegistration:result?.reduce((sum, obj) => sum + obj.merchantRegistration, 0),
        agentActivation:result?.reduce((sum, obj) => sum + obj.agentActivation, 0),
        merchantActivation:result?.reduce((sum, obj) => sum + obj.merchantActivation, 0),
        message:'found them all',
        success:'yes'
      })
    
      res.json({
        agentRegistration:result?.reduce((sum, obj) => sum + obj.agentRegistration, 0),
        merchantRegistration:result?.reduce((sum, obj) => sum + obj.merchantRegistration, 0),
        agentActivation:result?.reduce((sum, obj) => sum + obj.agentActivation, 0),
        merchantActivation:result?.reduce((sum, obj) => sum + obj.merchantActivation, 0),
        message:'found',
        success:'yes'
      })
     }else if(!result || result?.length==0 || err){
      console.log(err)
      res.json({
        id:0,
        agentRegistration:0,
        merchantRegistration:0,
        agentActivation:0,
        merchantActivation:0,
        goalDate:'',
        message:'not found',
        success:'no'
      })
     }
      
    })
  } catch (error) {
    console.log(error)
  }
})

/*const generateToken = (id) => {
  return jwt.sign({ id },'aaaaaaa')
} */
const PORT=process.env.PORT || 8000

httpServer.listen(PORT,()=>{
    console.log('server on is runing')
})

