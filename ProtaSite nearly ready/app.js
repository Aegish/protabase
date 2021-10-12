// Imports module
const express = require('express')
const app = express()
const port = 3000;
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const urlencodedParser = bodyParser.urlencoded({ extended: false})
const { check, validationResult } = require('express-validator')
const session = require('express-session')
var nodemailer = require('nodemailer');
var fs = require('fs')
const server = require('http').Server(app)
const io = require('socket.io')(server)
// will automatically load the node version
const { jsPDF } = require("jspdf"); 

const path = require('path')
const expressLayouts = require('express-ejs-layouts');
const { throws } = require('assert');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');

/*app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));*/

// Connexion MYSQL

variablelocal = 12 ;

const DateRef = new Date(Date.now() - 86400000);

// Connexion à l'Email du site

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'paperbird.formation@gmail.com',
        pass: 'Bird123paper',
    }
});

var mysqlConnexion = mysql.createConnection({
    host: 'localhost',
    user: 'docteur',
    password: 'peste',
    database: 'protabase'
});

mysqlConnexion.connect(function(err) {
    if (err) throw err;
    console.log('Connexion à la base établie !');
});

mysqlConnexion.query('SELECT * FROM compte', (err, rows)=> {
    if(err) throw err;
    console.log('Data reçu 5/5');
    console.log(rows);
});

// Static dossiers

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use('/fullcalendar', express.static(__dirname + 'public/fullcalendar'))

// -
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set views
app.set('views', './views')
app.set('view engine', 'ejs')


// --- Naviguer entre page EJS --

//-> page d'acceuille
app.get('/', (req, res) => {
    res.render('home',)
})

//-> page d'acceuille 2
app.get('/home', (req, res) => {
    res.render('home2',)
})

//-> page de connexion
app.get('/log_in', (req, res) => {
    res.render('log_in')
})

//-> requete pour pouvoir se connecter
app.post('/log_in', urlencodedParser, (req, res) => {
    var Identifiant = req.body.Identifiant;
    var password = req.body.Psw;

    if (Identifiant && password) {

            //   SELECT idCompte FROM compte WHERE (pseudo = ? OR pseudo = ?) AND mdp=? AND compteType='?';

       mysqlConnexion.query("SELECT idCompte FROM compte WHERE (pseudo = ? OR email = ?) AND mdp=? AND compteType='Client';", [Identifiant,Identifiant,password], function (error, results, fields) {
           if(error) throw error;
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.email = Identifiant;
                res.redirect('/connecter');
                variablelocal = results[0].idCompte;
                console.log(' info perso : ', variablelocal);
                return variablelocal;
                

            }

            else {
                mysqlConnexion.query("SELECT idCompte FROM compte WHERE (pseudo = ? OR email = ?) AND mdp=? AND compteType='Docteur';", [Identifiant,Identifiant,password], function (error, results, fields) {
                    if(error) throw error;
                     if (results.length > 0) {
                        req.session.loggedin = true;
                        req.session.email = Identifiant;
                        res.redirect('/connecter-docteur');
                        variablelocal = results[0].idCompte;
                        console.log(' info perso : ', variablelocal);
                        return variablelocal;
                    }
                    else {
                        mysqlConnexion.query("SELECT idCompte FROM compte WHERE (pseudo = ? OR email = ?) AND mdp=? AND compteType='Admin';", [Identifiant,Identifiant,password], function (error, results, fields) {
                            if(error) throw error;
                             if (results.length > 0) {
                                req.session.loggedin = true;
                                req.session.email = Identifiant;
                                res.redirect('/connecter-admin');
                                variablelocal = results[0].idCompte;
                                console.log(' info perso : ', variablelocal);
                                return variablelocal;
                            }
                            else {
                                res.send("Le mot de passe ou l'identifiant est incorrect!");
                                console.log(Identifiant,password);

                            }
                        });
 
                    }
                });

            }
 
   
               
        }); 

    } else {
        res.send('Entrer un mot de passe et une adresse mail !');
        res.end();
           }
});

//-> page d'inscription
app.get('/register', (req, res) => {
    res.render('register')
})

//-> page de redirection après inscription
app.get('/inscription_succes', (req, res) => {
    res.render('inscription_succes')
})

//-> page de redirection après connexion quand c'est un client
app.get('/connecter', function (request, response) {
    if (request.session.loggedin) {
        response.render('connecter');

    } else {
        response.send('Connectez-vous pour voir cette page !');
    }
    response.end();
});

//-> page de redirection après connexion quand c'est un Docteur.
app.get('/connecter-docteur', function (request, response) {
    if (request.session.loggedin) {
        if (mysqlConnexion.query("SELECT * FROM compte WHERE compte.compteType = 'Docteur'")){
            response.render('connecter-docteur');
        }
    } else {
        response.send('Connectez-vous pour voir cette page !');
    }
    response.end();
});

//-> page de redirection après connexion quand c'est un Administrateur
app.get('/connecter-admin', function (request, response) {
    if (request.session.loggedin) {
        if (mysqlConnexion.query("SELECT * FROM compte WHERE compte.compteType = 'Admin'")) {

            response.render('connecter-admin');
        }
    } else {
        response.send('Connectez-vous pour voir cette page !');
    }
    response.end();
});


//-> page formulaire administration pour le resp formation
app.get('/formulaire-admin', (req, res) => {
    res.render('formulaire-admin')
})

//-> page redirection après connexion poru le admin formation
app.get('/connecter-admin', (req, res) => {
    res.render('connecter-admin')
})

// -> page profil, ici se trouve les infos perso'
app.get('/profil', (req, res) => {
    res.render('profil')
})
// --> Naviguer entre page EJS <-- //

    
app.get('/profil-docteur', (req, res) => {
    res.render('profil-docteur')
})

app.get('/profil-admin', (req, res) => {
    res.render('profil-admin')
})

//-> page de redirection vers le planning
app.get('/planning', (req, res) => {
    res.render('planning')
})

//-> page de redirection vers la page du scanneur
app.get('/scanner', (req, res) => {
    res.render('scanner')
})

// user connceted or disconnected when he joins / leaves the room
io.on('connexion', socket => {
    socket.on('join-room', (roomId, userId) => 
{
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
    socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
})
})


//inscription test (ici c'était des tests pour vérifier qu'un champs a été saisie de manière correct)
 
app.post('/register', urlencodedParser, [
    //res.json(req.body) = pour voir le resultat sous format json
    check('nom', ' /!\ Le nom doit contenir plus de 3 charactères !/!\ ')
        .exists()
        .isLength({ min: 3 }),
    check('Email', "Ladresse mail est invalide")
        .isEmail()
        .normalizeEmail()

], (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {

        // return res.status(422).jsonp(errors.array())
        const alert = errors.array()

        res.render('register', {
            alert
        })
    }

    // -- ci-dessous = la requête mysql envoyer pour inscrire les données dans la bdd, une fois que l'utilisateur aura terminer de remplir le formulaire d'inscription --
    // L'inscription de l'utilisateur en bref ...

    // table
    var sql = "INSERT INTO compte (pseudo,compteType,email,mdp) VALUES ('" + req.body.pseudo + "','" + req.body.accountType + "', '" + req.body.Email + "', '" + req.body.Psw + "')";

    mysqlConnexion.query(sql, function (err, rows, fields) {
        if (err) throw err;
        alert = 'Inscription terminé, vous pouvez désormais vous connecter !';
        res.redirect('/log_in');
        console.log('Les données ont été envoyé à la base de donnée !')
        console.log(rows)
        //table users
        mysqlConnexion.query("SELECT idCompte FROM compte WHERE email = '"+req.body.Email+"';",(err,renvoi)=>{/*req.body.Email a été remplacé par : req.body.Adresse & req.body.Psw a été remplacé par : req.body.IdImg */
            if (err) throw err;
            var sql1 = "INSERT INTO utilisateur (idCompte,prenom,nom,idImg) VALUES ('"+renvoi[0].idCompte+"','" + req.body.prenom + "', '" + req.body.nom + "', '" + req.body.IdImg + "')";
            mysqlConnexion.query(sql1, function (err, rows, fields) {
                if (err) throw err
                res.render('inscription_succes', { title: 'Donnée sauvegarder', message: 'Sauvegardé avec succès.' })
                console.log('Les données ont été envoyé à la base de donnée !')
                console.log(rows)
            })})
    })



})



app.post('/profil', urlencodedParser, [
    check('nom', ' /!\ Le nom doit contenir plus de 3 charactères !/!\ ')
        .exists()
        .isLength({ min: 3 }),
], (req, res) => {

    // la requête mysql pour modifier les données dans la bdd

    var Email = req.body.Email;
    var password = req.body.Psw;
    var prenom = req.body.prenom;
    var nom = req.body.nom;

    // table account 
    var sql2 = 'UPDATE utilisateur set nom = ?, accountPhone = ? where idCompte = ?';

    mysqlConnexion.query(sql2, [prenom, phone,variablelocal], function (err, rows, fields) {
        if (err) throw err
       // res.send('UPDATE terminé, vous pouvez désormais vous connecter !')
        console.log('Les données ont été envoyé à la base de donnée !')
        console.log(rows)
    })

    //table users
    var sql3 = 'UPDATE users set usersName = ?, usersFirstName = ?, where idusers = ?';
    mysqlConnexion.query(sql3, [prenom, nom], function (err, rows, fields) {
        if (err) throw err
        //  res.render('UPDATE_succes', { title: 'Donnée sauvegarder', message: 'Sauvegardé avec succès.' })
        console.log('Les données ont été envoyé à la base de donnée !')
        console.log(rows)
    })
 
 });


app.post('/profil-docteur', urlencodedParser, [
    check('nom', ' /!\ Le nom doit contenir plus de 3 charactères !/!\ ')
        .exists()
        .isLength({ min: 3 }),
], (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {

        // return res.status(422).jsonp(errors.array())
        const alert = errors.array()

        res.render('profil-docteur', {
            alert
        })
    }
    // la requête mysql pour modifier les données dans la bdd

    var Email = req.body.Email;
    var password = req.body.Psw;
    var prenom = req.body.prenom;
    var nom = req.body.nom;
    var phone = req.body.phone;

    // table account 
    var sql4 = 'UPDATE account set accountName = ?, accountPhone = ? where idaccount = 3';

    mysqlConnexion.query(sql4, [prenom, phone], function (err, rows, fields) {
        if (err) throw err
        // res.send('UPDATE terminé, vous pouvez désormais vous connecter !')
        console.log('Les données ont été envoyé à la base de donnée !')
        console.log(rows)
    })

    //table users
    var sql5 = 'UPDATE users set usersName = ?, usersFirstName = ? where idusers = 3';
    mysqlConnexion.query(sql5, [prenom, nom], function (err, rows, fields) {
        if (err) throw err
        //  res.render('UPDATE_succes', { title: 'Donnée sauvegarder', message: 'Sauvegardé avec succès.' })
        console.log('Les données ont été envoyé à la base de donnée !')
        console.log(rows)
    })


  
             
});
   


//inscription formation  

app.post('/formulaire-admin', urlencodedParser, (req, res) => {

    var TrainingsDateDebut = req.body.TrainingsDateDebut;
    var TrainingsDateFin = req.body.TrainingsDateFin;
    var TrainingsName = req.body.TrainingsName;
    var TrainingsModalite = req.body.TrainingsModalite;

    // -- la requête mysql pour inscrire les données dans la bdd, signifiant qu'une formation est crée --

    // table trainings 
  
    var sql6 = "insert into trainings (TrainingsDateDebut, TrainingsDateFin, TrainingsName, TrainingsModalite, TrainingsStatus, CreatedTime) VALUES ('" + req.body.TrainingsDateDebut + "','" + req.body.TrainingsDateFin + "', '" + req.body.TrainingsName + "', '" + req.body.TrainingsModalite + "', 'formation incomplète', CURRENT_TIMESTAMP)";


    mysqlConnexion.query(sql6, function (err, rows, fields) {
        if (err) throw err
        alert = 'Inscription à la formation terminé';
        res.redirect('/admin-gestion');
        console.log('Les données ont été envoyé à la base de donnée !');
        console.log(rows);



        // table account_has_trainings
        // -- requête pour inscrire un apprenant/docteur/admin à une formation --

        //insérer dans la table account_has_trainings l'id du docteur et celui des apprenants

        // mysqlConnexion.query("insert into account_has_trainings (account_idaccount, trainings_idTrainings) SELECT idaccount from account left join trainings on trainings_idTrainings = idTrainings", function (err, rows, fields) {


        var Email1 = req.body.Email1;
        var Email2 = req.body.Email2;

 

            mysqlConnexion.query("INSERT into account_has_trainings (account_id_account, trainings_idTrainings) select idaccount, idTrainings from account, trainings LEFT join account on idaccount = account_id_account ", function (err, rows, fields) {
                if (err) throw err
                res.render('creation_formation_succes', { title: 'Données sauvegardés', message: 'Sauvegardés avec succès.' });
                console.log('Les données ont été envoyé à la base de donnée !');
                console.log(rows);
            });
    

    })

})


//-> 
app.post('/scanner', urlencodedParser, (req, res) => {
    var scanURL = req.body.scanURL;
    if(scanURL)
        {            
            var sqlCommand0 = "SELECT * FROM utilisateur WHERE utilisateur.codeBarre = '"+ scanURL +"';";
            var sqlCommand1 = "SELECT * FROM drug WHERE drug.drugValue = '"+scanURL +"';";
            mysqlConnexion.query(sqlCommand0,(err, results) => {
                if(err) throw err;
                if (results.length > 0) 
                    {
                        console.log(results);
                    }
                else 
                    {
                        mysqlConnexion.query(sqlCommand1,(err, results) => {
                            if(err) throw err;
                            if (results.length > 0) 
                                {
                                    console.log(results);
                                }
                            else
                                {
                                    console.log("erreur");
                                }                   
                        });
                    }
            });
            console.log("Recherche code barre tenté");
        }
})



app.post('/make', urlencodedParser, (req,res) => {

     document.getElementById("icons-block").addEventListener("click", ChangerSection)

    function ChangerSection() {

        if (this.id == "icons-block") {
            document.getElementById("mon_cv").style.display = "block";
            
            res.redirect('/factory');

        }
    }

});




// Ecoute port 3000

app.listen(port, () => console.info(`Ecoute sur port: ${port}`))

setTimeout(function(){ console.log(variablelocal)}, 30000);
