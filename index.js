const inquirer = require("inquirer");

const express = require("express");
const mysql = require("mysql2");
const { info, table } = require("console");
const { start } = require("repl");
const { response } = require("express");
const fs = require('fs');
const PORT = process.env.PORT || 3001;

const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

 
 const db = mysql.createConnection(
   {
     host: "localhost",
     user: "root",
     password: "rootroot",
     database: "employee_tracker_db",
   },
   console.log(`Connected to the employee_tracker_db database.`)
 );

 db.connect(function (err) {
  if (err) throw err;
  startQ();
});
 const starterQuestions = [
  {
    type: "list",
    name: "startQuest",
    message: "What would you like to do? ",
    choices: [
      "view all departments",
      "view all roles",
      "view all employees",
      "add a department",
      "add a role",
      "add an employee",
      "update an employee role",
      "exit"
    ],
  }
  
]

const deptQuest = [{
  type: "input",
  message: "Enter department name: ",
  name: "name"
}]


const roleQuest = [{
  type: "input",
  message: "Enter role title: ",
  name: "title"
},
  {type: "input",
    message: "Enter role salary here: ",
    name: "salary"
  },
  {type: "input",
    message: "Enter your role department id here: ",
    name: "department_id"
  }
  ]


  const empQuest = [{
    type: "input",
    message: "Enter employee first name: ",
    name: "first_name"
  },
    {type: "input",
      message: "Enter employee last name: ",
      name: "last_name"
    },
    {type: "input",
    message: "Enter employee role id here: ",
    name: "role_id"
  },
{
  type: "input",
  message: "What is their manager's id?: ",
  name: "manager_id"
}]

  const updateEmpQuest = [{
    type: "input",
    message: "Enter the id of employee who's role you want to change: ",
    name: "id"
  },
    {type: "input",
      message: "Enter the employee's new role id: ",
      name: "role"
    },
    ]

async function startQ() {
  const response = await inquirer.prompt(starterQuestions);
  
  if(response.startQuest === "view all departments"){
  console.log("Test")
  }
  if(response.startQuest === "exit"){
    console.log("exiting...");
  }
   



switch(response.startQuest) {

  case "view all departments":
  look("view all departments")
  break; 

  case "view all roles":
  look("view all roles")
  break; 

  case "view all employees":
  look("view all employees")
  break;

  case "add a department":
  newDepartment()
  break;

  case "add a role" :
  newRole()
  break;

  case "add an employee":
  newEmployee()
  break;

  case "update an employee role":
  updateEmployeeRole()
  break;

 }
}

function look(name, response){
  if(name == "view all departments"){
    
    db.query('SELECT * FROM departments', function (err,res){
      if (err) throw err;
      console.log(res);
      console.table(res);
    })
    startQ();
  }
  if(name === "view all employees"){
    db.query('SELECT * FROM employees', function (err,res){
      if(err) throw err;
      console.log(res);
      console.table(res);
    })
    startQ();
  }
  if(name === "view all roles") {
    db.query('SELECT * FROM roles', function (err, res){
      if (err) throw err;
      console.log(res);
      console.table(res);
    })
    startQ();
  }
  if(name === "add a role") {
    db.query('INSERT INTO roles SET (?)', response, function (err, res) {
      if (err) throw err;
    })
    startQ();
  }
  if(name === "add a department") {
    db.query('INSERT INTO department (name) VALUES (?)', response, function (err, res) {
      if (err) throw err;
    })
    startQ();
  }
  if(name === "add an employee") {
    db.query('INSERT INTO employee SET ?', response, function(err, res){
      if (err) throw err; 
      
    })
    startQ();
  }
  if(name === "update an employee role") {
    db.query('UPDATE employee SET role_id=? WHERE id= ?', response.role, response.id, function(err, res){
     if(err) throw err;
     console.table(res);
});
    startQ()
  }
}
//  newRole()
// newDepartment()
//  newEmployee()
// updateEmployeeRole()


async function newRole(){
  const response = await inquirer.prompt(roleQuest) 
  look("add a role",response)
} 
async function newDepartment(){
  const response = await inquirer.prompt(deptQuest) 
  look("add a department",response.name)
} 
async function newEmployee(){
  const response = await inquirer.prompt(empQuest) 
  look("add an employee",response)
} 
async function updateEmployeeRole(){
  const response = await inquirer.prompt(updateEmpQuest) 
  look("update an employee",response)
} 
