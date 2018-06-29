
const express = require('express')
const promise = require('bluebird')

// defined the options for the pg-promise library
var options = {
    promiseLib : promise
}

//configuring the pg-promise database connection
var pgp = require('pg-promise')(options)
var connectionString = 'postgres://vfmswhnp:SAxbUAYpDLuNjJXrKrOc6GJ6EMrzBS_y@stampy.db.elephantsql.com:5432/vfmswhnp'

var db = pgp(connectionString)

let categoriesArray = []

function userRegister(req,res,next){

    let userName = req.body.userName  
    let password = req.body.password


    db.none('INSERT INTO users(username,password)' +
            'VALUES($1,$2)',[userName,password])
            .then(function(){
                res.redirect('/userregister')
            }).catch(function (err) {  
                return next(err)
              })
}

// function userValidate(completion){

//         let loginName = req.body.loginName.toLowerCase()
//         let loginPassword = req.body.loginPassword.toLowerCase()
//         console.log(req.session.userId)
        
//         // console.log(password)
//         db.one('SELECT id,username,password FROM users where username = $1 and password = $2',[loginName,loginPassword])
//             .then(function(user){
            
//         completion(user)    
//             })
//         }        
function userValidate(req,res,next){

    let loginName = req.body.loginName.toLowerCase()
    let loginPassword = req.body.loginPassword.toLowerCase()

    console.log(req.session.userId)
    
    db.one('SELECT id,username,password FROM users where username = $1 and password = $2',[loginName,loginPassword])
        .then(function(user){
        
        
        let route = '' 

        if(user){
            req.session.username = user.username
            if(req.session.username == 'admin'){
                route = '/admin/viewbooks'
                res.redirect(route) 
                return 
                
            }
            else {
                req.session.userId = user.id

                if(req.session.currentBookId) {

                    db.none("INSERT into userbooks(userid,bookid) VALUES($1,$2)",[req.session.userId,req.session.currentBookId])
                    .then(function(){

                        db.none("UPDATE books SET availability ='False' WHERE id =$1",[req.session.currentBookId]) 
                        .then(function(){

                            route = '/mybooks'   
                            res.redirect(route)                      
                            req.session.currentBookId = null 
                            return 

                        }).catch(function(err){      
                            return next(err)
                        }) 
                
                     }).catch(function(err){      
                        return next(err)
                     })   
              
                } else {
                    route = '/availablebooks'   
                    res.redirect(route) 
                    return    
                }
            }    

        //res.redirect(route) 
        }        
    }).catch(function(err){
        res.redirect('/')
     })
}

function getAllBooks(completion) {

    let booksArray = [] 

    db.any('select id,title,author,isbn,availability,imageurl,description from books')
    .then(function (data) {
        data.forEach(function(book){
            booksArray.push(book)           
        })
       
        completion(booksArray)

    })

}

// function getAllBooks(req,res,next){
   
//     let booksArray = [] 

//     db.any('select id,title,author,isbn,availability,imageurl,description from books')
//     .then(function (data) {
//         data.forEach(function(book){
//             booksArray.push(book)           
//         })
//         res.render('admin/adminViewBooks',{books : booksArray})

//     }).catch(function(err) {
//       return next(err)
//     })
// }


function getCategories(req,res,next){

    let categoriesArray = []

    db.any('select id,categoryname from categories')
    .then(function (data) {
        data.forEach(function(category){
            categoriesArray.push(category)           
        })
        res.render('admin/addBooks',{categories :categoriesArray})

    }).catch(function(err) {
      return next(err)
    })

}

function addBook(req, res, next) {
    let categoryId = req.body.categoryName
    
    let title = req.body.title
    let author = req.body.author
    let isbn = req.body.isbn
    let availability = req.body.availability
    let imageurl = req.body.imageurl
    let description = req.body.description

    
    
    db.none('INSERT into books(title, author, isbn, availability,imageurl,description,categoryid)' +
    'VALUES($1,$2,$3,$4,$5,$6,$7)',[title,author,isbn,availability,imageurl,description,categoryId])
    .then(function(){
        res.redirect('/admin/viewBooks')
    }).catch(function (err) {  
        return next(err)
      })
}

function getBookById(req, res, next) {
    categoriesArray =[]
    let bookId = req.params.id
    console.log(bookId)

    db.any('select id,categoryname from categories')
    .then(function (data) {
        //console.log(data)
        data.forEach(function(category){
            //console.log(book)
            categoriesArray.push(category)           
        })
    })
    db.one('SELECT id,title,author,isbn,availability,imageurl,description from books WHERE id = $1',[bookId])
    .then(function (data) {
       
        //console.log(data)
        //console.log(categoriesArray)
        res.render('admin/updateBooks',{bookdata : data,categories :categoriesArray})

    }).catch(function(err) {
      return next(err)
    })
}

function updateBook(req,res,next){
    let bookId = parseInt(req.body.bookId)
    console.log("book id:"+ bookId)
    
    db.none('UPDATE books SET title=$1, author=$2, isbn=$3, availability=$4,imageurl=$5,description=$6,categoryid=$7 WHERE id=$8',
      [req.body.title, req.body.author, req.body.isbn, req.body.availability,req.body.imageurl,req.body.description,req.body.categoryName,
        bookId])
      .then(function () {
        res.redirect('/admin/viewbooks')
         
      }).catch(function (err) {
        return next(err)
      })
} 

function deleteBook(req, res, next) {
    var bookId =req.body.bookId
    console.log(bookId)

    db.none('DELETE from userbooks WHERE bookid = $1',[bookId])
      .then(function () {
            db.none('DELETE from books WHERE id = $1',[bookId])
            .then(function () {
                res.redirect('/admin/viewbooks')
            }).catch(function (err) {
                return next(err)
            })
    }).catch(function (err) {
        return next(err)
    })
} 
  
function searchBook(req, res, next) {
    let searchText = req.body.searchText

    let booksArray = [] 

    db.any(`SELECT title,author,isbn,availability,imageurl,description from books WHERE LOWER(title) LIKE '%${searchText.toLowerCase()}%'`)
    
    .then(function (data) {
        console.log(data)
        data.forEach(function(book){
            console.log(book)
            booksArray.push(book)           
        })
        res.render('admin/adminViewBooks',{books : booksArray})

    }).catch(function(err) {
      return next(err)
    })
}

function getAvailableBooks(req,res,next){
    let booksArray = [] 

    db.any("select id,title,author,isbn,availability,imageurl,description from books WHERE availability ='True' ")
    .then(function (data) {
        data.forEach(function(book){
            booksArray.push(book)           
        })
        res.render('admin/availableBooks',{books : booksArray})

    }).catch(function(err) {
      return next(err)    
    })    
}

function myBooks(req,res,next) {

    let booksArray = [] 
    console.log(req.session.username)
     if(req.session.userId) {

        db.any('select bookid from userbooks where userid = $1',[req.session.userId]) 
        .then(function (bookId) {
    
            console.log(bookId)
            
            db.any('SELECT title, author, isbn from books JOIN userbooks on books.id = userbooks.bookid WHERE userbooks.userid = $1',[req.session.userId])
            .then(function (books) {

                books.forEach(function(book){
                    booksArray.push(book)
                    console.log(booksArray)
                })
                res.render('admin/userBooks',{books : booksArray, username : req.session.username})

            }).catch(function(err) {
            return next(err) 
            })   
        }).catch(function(err) {
        return next(err)  
        })  
    }       


}


module.exports = {
    userRegister : userRegister,
    userValidate : userValidate,
    getAllBooks  : getAllBooks,
    addBook      : addBook,
    getCategories : getCategories,
    getBookById : getBookById,
    updateBook : updateBook,
    deleteBook : deleteBook,
    searchBook : searchBook,
    getAvailableBooks : getAvailableBooks,
    myBooks : myBooks
 }

