const express = require('express')
const router = express.Router()

var db = require('./queries')

router.get('/',function(req,res,next){


    res.render('home')
    // db.getAllBooks(function(books){
    //     res.render('admin/userBooks',{books : books})
       // })
})

router.get('/login',function(req,res,next){
    res.render('login')
})

router.get('/register',function(req,res,next){
    res.render('register')
})

router.post('/userregister',db.userRegister)

router.get('/userregister',function(req,res,next){
    res.render('home')
})

router.post('/login',db.userValidate)
    


router.get('/admin/viewbooks',function(req,res,next){

    db.getAllBooks(function(books){
        console.log(books) 
       
        res.render('admin/adminViewBooks',{books : books})
    })

})

router.get('/admin/addbooks',db.getCategories)
        
router.post('/admin/addbooks',db.addBook)

router.get('/admin/addbooks/:id',db.getBookById)

router.post('/admin/updatebook',db.updateBook)

router.post('/admin/deletebook',db.deleteBook)

router.post('/admin/searchbook',db.searchBook)


router.get('/availablebooks',db.getAvailableBooks)
        
router.post('/checkout',db.checkout)


router.post('/mybooks',db.checkin)

//router.get('/mybooks/:id',db.checkin)

// router.get('/admin/searchbook',db.getCategories)    
// router.get('/admin/searchbook/:id',db.getBookById)








////router.get('/admin/viewbooks',db.getAllBooks)

// router.get('/admin/addbooks',db.getCategories)
        
// router.post('/admin/addbooks',db.addBook)

// router.get('/admin/addbooks/:id',db.getBookById)

// router.post('/admin/updatebook',db.updateBook)

// router.post('/admin/deletebook',db.deleteBook)

// router.post('/admin/searchbook',db.searchBook)

// //router.get('/checkoutbook/:id',function(req,res,next){
    
// router.get('/availablebooks',db.getAvailableBooks)
        
// router.post('/checkout',db.checkout)
        


// router.get('/mybooks/:id',function(req,res,next){
//     let bookId = parseInt(req.params.id)

//     req.session.currentBookId = bookId 

//     // if the user is logged in then go to mybooks page 
//     if(req.session.userId) {
//         // go to mybooks page
//         db.userValidate()
//     } 
//     //else 

//     // if(req.session) {
//     //     req.session.currentBookId = bookId 
//     // }

//     // console.log(bookId)

//     // res.render('login')
// })

router.get('/mybooks',db.myBooks)

router.get('/logout',db.logout)

module.exports = router