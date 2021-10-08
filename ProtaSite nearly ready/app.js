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
                        res.redirect('/connecter-formateur');
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
                                res.redirect('/connecter-responsable');
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

//-> page de redirection après connexion
app.get('/connecter', function (request, response) {
    if (request.session.loggedin) {
        response.render('connecter');

    } else {
        response.send('Connectez-vous pour voir cette page !');
    }
    response.end();
});

//-> page de redirection après connexion quand c'est un formateur
app.get('/connecter-formateur', function (request, response) {
    if (request.session.loggedin) {

        response.render('connecter-formateur');
    } else {
        response.send('Connectez-vous pour voir cette page !');
    }
    response.end();
});

//-> page de redirection après connexion quand c'est un responsable
app.get('/connecter-responsable', function (request, response) {
    if (request.session.loggedin) {
        if (mysqlConnexion.query("SELECT * FROM account WHERE accountType = 'Responsable formation'")) {

            response.render('connecter-responsable');
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

//-> page redirection après connexion poru le responsable formation
app.get('/connecter-responsable', (req, res) => {
    res.render('connecter-responsable')
})

//-> page pour que le formateur gère ses formations animation ect..
app.get('/formateur-gestion', (req, res) => {
    res.render('formateur-gestion')
})

//-> page pour que le responsable gère les formations animation ect..
app.get('/responsable-gestion', (req, res) => {
    res.render('responsable-gestion')
})

// -> page profil, ici se trouve les infos perso'
app.get('/profil', (req, res) => {
    res.render('profil')
})
// --> Naviguer entre page EJS <-- //

    
app.get('/profil-formateur', (req, res) => {
    res.render('profil-formateur')
})

app.get('/profil-responsable', (req, res) => {
    res.render('profil-responsable')
})

//-> page de redirection pour animer une formation
app.get('/animation', (req, res) => {
    res.render('animation')
})

//-> page de redirection vers le planning
app.get('/planning', (req, res) => {
    res.render('planning')
})

//-> page de redirection pour concevoir/gérer un contenue pédagogique
app.get('/factory', (req, res) => {
    res.render('factory')
})

//-> page de redirection vers visio
app.get('/visio', (req, res) => {
    res.render('visio')
})

//-> page de redirection pour concevoir ou modifier une formation
app.get('/make', (req, res) => {
    res.render('make')
})

/*-> page de redirection vers le formulaire de créaton d'une formation
app.get('/make-formulaire', (req, res) => {
    res.render('make-formulaire')
})*/


// Gestion de la Visio par Joel
app.get('/:room', (req, res) => 
{
    res.render('room', { roomId: req.params.room })
})

// id of the room in the url
app.get('/room', (req, res) => 
{
    res.redirect(`/${uuidV4()}`)
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
    var sql2 = 'UPDATE account set accountName = ?, accountPhone = ? where idaccount = ?';

    mysqlConnexion.query(sql2, [prenom, phone], function (err, rows, fields) {
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


app.post('/profil-formateur', urlencodedParser, [
    check('nom', ' /!\ Le nom doit contenir plus de 3 charactères !/!\ ')
        .exists()
        .isLength({ min: 3 }),
], (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {

        // return res.status(422).jsonp(errors.array())
        const alert = errors.array()

        res.render('profil-formateur', {
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
        res.redirect('/responsable-gestion');
        console.log('Les données ont été envoyé à la base de donnée !');
        console.log(rows);



        // table account_has_trainings
        // -- requête pour inscrire un apprenant/formateur/responsable à une formation --

        //insérer dans la table account_has_trainings l'id du formateur et celui des apprenants

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


// Les fonctions sont içi
// Action journalière
function boucle()
    {
        mysqlConnexion.query('SELECT * FROM trainings order by idTrainings', (err, rows) => {
            const Maintenant = new Date();
            const Demain = new Date(Date.now() + 86400000);
            const Semainefutur = new Date(Date.now() + 604800000);
            const DeuxSemainesfutur = new Date(Date.now() + 1209600000);
            //rows.length = nombre de formation trouvé
            NbmaxTrainings = rows.length;
            NomFormation = 'bla';
            if (err) throw err;
            console.log('Data reçu 5/5 le : ', Maintenant.toUTCString(), '\n Nombre de formation trouvé : ', NbmaxTrainings);
            //Une boucle permettant de regarder tous les entrainements 1 par 1
            for (let Nbtrainings = 0; Nbtrainings < NbmaxTrainings; Nbtrainings++)
                {
                    TrainingsID = rows[Nbtrainings].idTrainings;                   
                    mysqlConnexion.query('SELECT TrainingsName FROM trainings where idTrainings =' + TrainingsID+' order by idTrainings', (err, TrainingsNom) => {
                        if (err) throw err;
                    NomFormation = TrainingsNom;
                    
                    mysqlConnexion.query('SELECT accountMail1 FROM account where idaccount IN(SELECT account_idaccount FROM account_has_trainings where trainings_idTrainings =' + TrainingsID + ' ) order by idaccount;', (err, result) => {
                        if (err) throw err;
                        // NbmaxMail = nombre max de résultat trouvé
                        NbmaxMail = result.length;
                    // Si l'entrainement regarder se passe dans 2 semaines alors il préviendra les concernés 
                    if (rows[Nbtrainings].TrainingsDateDebut.toISOString().split('T')[0] == DeuxSemainesfutur.toISOString().split('T')[0])
                            {                            
                                console.log("Formation commence dans 2 semaines", TrainingsID);
                                    for (let Nbprecis = 0; Nbprecis < NbmaxMail; Nbprecis++)
                                        {
                                            mysqlConnexion.query('SELECT firstname , lastname FROM contact_details where idaccount IN(SELECT account_idaccount FROM account_has_trainings where trainings_idTrainings =' + TrainingsID + ' ) order by idaccount;', (err, infoperso) => {
                                                if (err) throw err;
                                            VarPrenom = infoperso[Nbprecis].firstname;
                                            VarNom = infoperso[Nbprecis].lastname;
                                            console.log(NomFormation, NbmaxMail);
                                            // Configuration de paramètres d'envoi du mail
                                            var mailOptions = 
                                                {
                                                    from: 'paperbird.formation@gmail.com',
                                                    to: result[Nbprecis].accountMail1,
                                                    subject: 'Sending Email using Node.js',
                                                    // Utilise un message préfait
                                                    text: 'Bonjour '+ VarNom +' '+VarPrenom+' votre formation : ' + NomFormation[0].TrainingsName + ' commencera dans 2 semaines.' 
                                                };
                                            // Envoi du mail
                                            transporter.sendMail(mailOptions, function (error, info) 
                                                {
                                                    if (error) 
                                                        {
                                                            console.log(error);
                                                        }
                                                    else 
                                                        {
                                                            console.log('Email sent to : ' + result[Nbprecis].accountMail1 + '\n response' + info.response);
                                                        }
                                                })});
                                        }                     
                            }

                    // Si la formation commence dans 1 semaine alors il préviendra les concernés
                    else if (rows[Nbtrainings].TrainingsDateDebut.toISOString().split('T')[0] == Semainefutur.toISOString().split('T')[0])
                            {                            
                                console.log("Formation commence dans 1 semaine", TrainingsID);
                                for (let Nbprecis = 0; Nbprecis < NbmaxMail; Nbprecis++)
                                    {
                                        mysqlConnexion.query('SELECT firstname , lastname FROM contact_details where idaccount IN(SELECT account_idaccount FROM account_has_trainings where trainings_idTrainings =' + TrainingsID + ' ) order by idaccount;', (err, infoperso) => {
                                            if (err) throw err;
                                        VarPrenom = infoperso[Nbprecis].firstname;
                                        VarNom = infoperso[Nbprecis].lastname;
                                        console.log(VarPrenom,VarNom,NbmaxMail);
                                        // Configuration de paramètres d'envoi du mail
                                        var mailOptions = 
                                            {
                                                from: 'paperbird.formation@gmail.com',
                                                to: result[Nbprecis].accountMail1,
                                                subject: 'Sending Email using Node.js',
                                                // Utilise un message préfait
                                                text: 'Bonjour '+ VarNom +' '+VarPrenom+' votre formation : ' + NomFormation[0].TrainingsName + ' va commencer dans 1 semaine.' 
                                            };
                                        // Envoi du mail
                                        transporter.sendMail(mailOptions, function (error, info)
                                            {
                                                if (error) 
                                                    {
                                                        console.log(error);
                                                    }
                                                else 
                                                    {
                                                        console.log('Email sent to : ' + result[Nbprecis].accountMail1 + '\n response' + info.response);
                                                    }
                                            })});
                                    }                                                   
                            }

                    // Si la formation commence le lendemain alors il préviendra les concernés
                    else if (rows[Nbtrainings].TrainingsDateDebut.toISOString().split('T')[0] == Demain.toISOString().split('T')[0]) // A modifier mais je ne sais pas quoi -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                            {
                                for (let Nbprecis = 0; Nbprecis < NbmaxMail; Nbprecis++)
                                    {
                                        mysqlConnexion.query('SELECT firstname , lastname FROM contact_details where idaccount IN(SELECT account_idaccount FROM account_has_trainings where trainings_idTrainings =' + TrainingsID + ' ) order by idaccount;', (err, infoperso) => {
                                            if (err) throw err;
                                        VarPrenom = infoperso[Nbprecis].firstname;
                                        VarNom = infoperso[Nbprecis].lastname;
                                        console.log(VarPrenom,VarNom,result[Nbprecis].accountMail1,result,NbmaxMail,Nbprecis);                                        
                                        var mailOptions = 
                                            {
                                                from: 'paperbird.formation@gmail.com',
                                                to: result[Nbprecis].accountMail1,
                                                subject: 'Sending Email using Node.js',
                                                // Utilise un message préfait
                                                text: 'Bonjour '+ VarNom +' '+VarPrenom+' votre formation : ' + NomFormation[0].TrainingsName + ' commencera demain.'
                                            };
                                        transporter.sendMail(mailOptions, function (error, info) // Envoi du mail
                                            {
                                                if (error) 
                                                    {
                                                        console.log(error);
                                                    }
                                                else 
                                                    {
                                                        console.log('Email sent to : ' + result[Nbprecis].accountMail1 + '\n response' + info.response);
                                                    }
                                            })});
                                    }
                            }

                    else {
                        console.log(" Debut Formation brute : ", rows[Nbtrainings].TrainingsDateDebut, "\n Moment actuel brute : ", Maintenant, "\n Debut Formation arrangé : ", rows[Nbtrainings].TrainingsDateDebut.toISOString().split('T')[0], "\n Moment actuel arrangé : ", Maintenant.toISOString().split('T')[0], "\n Dans une semaine arrangé : ", Semainefutur.toISOString().split('T')[0]);
                    }
                    console.log("Fin du tour !" + Nbtrainings);
                });});
                }
            if (true) {
                setTimeout(() => boucle(), 86400000);// 1 jour = 86400000, 30 sec = 30000
            }

        });
    }

// Action toute les 30 sec
function Minuterie() 
    {
        //Check de formation pas fini
        mysqlConnexion.query("Select * from trainings WHERE TrainingsStatus != 'Fini';", (err, rows) =>
            {
                const Maintenant = new Date();
                NbmaxTrainingstrouve = rows.length;
                for (let NumTrainings = 0; NumTrainings < NbmaxTrainingstrouve; NumTrainings++) {
                    IdFormation = rows[NumTrainings].idTrainings;
                    // Si la formation est enfaite fini
                    if (rows[NumTrainings].TrainingsDateFin.getTime() < Maintenant.getTime())
                    {
                        // Lui donner comme statut 'Fini'
                        mysqlConnexion.query("UPDATE `ppbv0`.`trainings` SET `TrainingsStatus` = 'Théoriquement fini' WHERE (`idTrainings` = '" + IdFormation + "');", (err))
                        if (err) throw err;
                        console.log("action");
                    }
                }

            })
        //Check de formation pas encore commencé
        mysqlConnexion.query("Select * from trainings WHERE TrainingsStatus = 'En Attente';", (err, rows) =>
            {
                const Maintenant = new Date();
                NbmaxTrainingstrouve = rows.length;
                for (let NumTrainings = 0; NumTrainings < NbmaxTrainingstrouve; NumTrainings++) {
                    IdFormation = rows[NumTrainings].idTrainings;
                    // Si la formation est censé avoir commencé 
                    if (rows[NumTrainings].TrainingsDateDebut.getTime() > Maintenant.getTime())
                    {
                        // Lui donner comme statut 'En retard'
                        mysqlConnexion.query("UPDATE `ppbv0`.`trainings` SET `TrainingsStatus` = 'En retard' WHERE (`idTrainings` = '" + IdFormation + "');", (err))
                        if (err) throw err;
                        console.log("action");
                    }
                }

            })
        setTimeout(() => Minuterie(), 30000);// 1 jour = 86400000, 30 sec = 30000    
    }

//Change l'état de la formation en 'fini' + Donne une attéstation à toutes les personnes présente à la formation 
function TerminerFormation(IdDeLaFormation) 
    {
        mysqlConnexion.query('Select * from trainings where idTrainings = '+IdDeLaFormation+' ;', (err, rows) =>
            {
                mysqlConnexion.query("UPDATE `ppbv0`.`trainings` SET `TrainingsStatus` = 'Fini' WHERE (`idTrainings` = '" + IdDeLaFormation + "');", (err))
                    if (err) throw err;
                VarFormation = rows[0].TrainingsName;
                VarDBFormation = rows[0].TrainingsDateDebut;
                VarDFFormation = rows[0].TrainingsDateFin;
                VarModaFormation = rows[0].TrainingsModalite;
                mysqlConnexion.query('SELECT * FROM account where idaccount IN(SELECT account_idaccount FROM account_has_trainings where trainings_idTrainings =' + IdDeLaFormation + ' ) order by idaccount;', (err, result) => 
                    {
                        if (err) throw err;
                        // NbmaxMail = nombre max de résultat trouvé
                        NbmaxMail = result.length;
                        mysqlConnexion.query('SELECT firstname , lastname FROM contact_details where idaccount IN(SELECT account_idaccount FROM account_has_trainings where trainings_idTrainings =' + IdDeLaFormation + ' ) order by idaccount;', (err, infoperso) => 
                                    {
                                        // La fonction boucle est une fonction boucle avec latence de 0.5s
                                        Nbprecis = 0;
                                        function Boucle()
                                            {
                                                setTimeout(function()
                                                    {
                                                        if (err) throw err;
                                                        VarNom = infoperso[Nbprecis].lastname;
                                                        VarPrenom = infoperso[Nbprecis].firstname;
                                                        varMail = result[Nbprecis].accountMail1;
                                                        VarAccountNumber = result[Nbprecis].accountNumber;
                                                        console.log(VarPrenom,VarNom,result[Nbprecis].accountMail1)
                                                        const docpdf = new jsPDF({format: 'a4'});
                                                        // Modification du contenu du pdf
                                                        fs.readFile('image.jpg', function(err, data)
                                                            {
                                                                    // Change la taille de la police d'écriture 
                                                                    docpdf.setFontSize(30); docpdf.setFont("helvetica", "bold");
                                                                    // Créer une ligne de texte avec les positions dictés en argument 'x' & 'y' à la fin
                                                                    docpdf.text("  ATTESTATION\nDE  FORMATION", 65, 60);                                                            docpdf.setFontSize(12); docpdf.setFont("helvetica", "normal");
                                                                    docpdf.text("Je soussigné Jean-Claude Figuo, Directeur Général de l'entreprise Paperbird,", 20, 100);
                                                                    docpdf.text("Certifie que :", 20, 110); docpdf.setFont("Courier", "bold");                                  docpdf.text(VarNom +' '+ VarPrenom, 80, 110); docpdf.setFont("helvetica", "normal");         
                                                                    docpdf.text("Numéro de compte :", 20, 120); docpdf.setFont("Courier", "bold");                              docpdf.text(VarAccountNumber, 80, 120); docpdf.setFont("helvetica", "normal");      
                                                                    docpdf.text("A suivi dans notre site internet la formation :", 20, 140);docpdf.setFont("Courier", "bold");  docpdf.text(VarFormation, 110, 140); docpdf.setFont("helvetica", "normal");
                                                                    docpdf.text("Depuis le :", 20, 160); docpdf.setFont("Courier", "bold");                                     docpdf.text(VarDBFormation.toISOString().split('T')[0], 80, 160); docpdf.setFont("helvetica", "normal");
                                                                    docpdf.text("Fin de formation le :", 20, 170); docpdf.setFont("Courier", "bold");                           docpdf.text(VarDFFormation.toISOString().split('T')[0], 80, 170); docpdf.setFont("helvetica", "normal");
                                                                    docpdf.text("Modalité de la formation :", 20, 180); docpdf.setFont("Courier", "bold");                      docpdf.text(VarModaFormation, 80, 180); docpdf.setFont("helvetica", "normal");
                                                                    docpdf.text("Numéro de la formation :", 20, 190); docpdf.setFont("Courier", "bold");                        docpdf.text(""+IdDeLaFormation+"", 80, 190); docpdf.setFont("helvetica", "normal");
                                                                    docpdf.text("Appréciations : ", 20, 210); docpdf.setFont("Courier", "bold");                                docpdf.text("Très bon travail et bon esprit d'équipe.", 80, 210); docpdf.setFont("helvetica", "normal"); docpdf.setFontSize(10);
                                                                    docpdf.text("Fait à Quai-d'Ivry\nLe : "+new Date().toLocaleDateString("fr-GB",{month: "long",day: "numeric",year: "numeric"}), 20, 240);

                                                                    //Ajout et positionnement d'image dans le pdf 
                                                                    docpdf.addImage(data, 'jpeg', 0, 0, 210, 30);
                                                                            // Va sauvegarder le fichier
                                                                            docpdf.save("Attestation.pdf");        
                                                            });
                                                            fs.readFile('image2.jpg', function(err, datda)
                                                            {
                                                                    //Ajout et positionnement d'image dans le pdf 
                                                                    docpdf.addImage(datda, 'jpeg', 0, 270, 210, 30);    
                                                                            // Va sauvegarder le fichier
                                                                            docpdf.save("Attestation.pdf");    
                                                            });;

                                                        // Configuration de paramètres d'envoi du mail
                                                        var mailOptions = 
                                                            {
                                                                from: 'paperbird.formation@gmail.com',
                                                                to: varMail,
                                                                subject: 'Retour de votre formation : '+ VarFormation,
                                                                // Utilise un message préfait
                                                                text: 'Bonjour \n\n'+ VarNom +'\n'+VarPrenom+'\n\nvotre formation : ' + VarFormation + ' a pris fin.\nVous est donc envoyé une attestation en format pdf prouvant votre présense à celle ci sous joint.\n\n\n\nCordialement\nPaperpirdFormation',
                                                                attachments: [{filename: 'Attestation.pdf',path: 'Attestation.pdf'}]
                                                            };
                                                        transporter.sendMail(mailOptions, function (error, info) // Envoi du mail
                                                            {
                                                                if (error) 
                                                                    {
                                                                        console.log(error);
                                                                    }
                                                                else 
                                                                    {
                                                                        console.log('Email sent to : ' + varMail + '\n response' + info.response);                                                        
                                                                    }                       
                                                            })
                                                        console.log("Fin de boucle")
                                                        Nbprecis++;
                                                        if (Nbprecis<NbmaxMail)
                                                            {Boucle();}
                                                    },500)
                                            }
                                        Boucle()
                                    });                                                                                            
                    }); });   
    };


//Fonction servant à modifier son PDF sans l'envoyer par mail à qui que ce soit , le PDF sera créée sur la machine à coté du fichier js éxécutant la fonctions
function TestePDF()
    {
        /* Ancien PDF
        const doc = new jsPDF();
        // Modification du contenu du pdf
        doc.text("Attestation de formation\n\nCette attestation stipule que\n"+VarNom+' '+VarPrenom+"\na suivi avec succès la session de formation : "+VarFormation, 10, 10);
        // Va sauvegarder le fichier
        doc.save("Attestation.pdf");*/
        const docpdf = new jsPDF({format: 'a4'});
        fs.readFile('Loog.png', function(err, data)
            {
                // Modification du contenu du pdf
                    // Change la taille de la police d'écriture 
                    docpdf.setFontSize(12);
                    // Créer une ligne de texte avec les positions dictés en argument 'x' & 'y' à la fin
                    docpdf.text("Je soussigné Jean-Claude figuo, Directeur Général de l'entreprise Paperbird,", 20, 50);
                    docpdf.text("Certifie que :", 20, 60); docpdf.setFont("Courier", "bold"); docpdf.text("Anne Batelle", 80, 60); docpdf.setFont("helvetica", "normal");         
                    docpdf.text("Numéro de compte :", 20, 70); docpdf.setFont("Courier", "bold"); docpdf.text("25", 80, 70); docpdf.setFont("helvetica", "normal");      
                    docpdf.text("A suivi dans notre site internet la formation :", 20, 90); docpdf.setFont("Courier", "bold"); docpdf.text("PaperBird Formation", 110, 90); docpdf.setFont("helvetica", "normal");
                    docpdf.text("Depuis le :", 20, 110); docpdf.setFont("Courier", "bold"); docpdf.text("2021/12/25", 80, 110); docpdf.setFont("helvetica", "normal");
                    docpdf.text("Fin de formation le :", 20, 120); docpdf.setFont("Courier", "bold"); docpdf.text("2022/05/16", 80, 120); docpdf.setFont("helvetica", "normal");
                    docpdf.text("Modalité de la formation :", 20, 130); docpdf.setFont("Courier", "bold"); docpdf.text("Presentiel", 80, 130); docpdf.setFont("helvetica", "normal");
                    docpdf.text("Appréciations : ", 20, 150); docpdf.setFont("Courier", "bold"); docpdf.text("Très bon travail. Et bon esprit d'équipe.", 80, 150); docpdf.setFont("helvetica", "normal"); docpdf.setFontSize(10);
                    docpdf.text("Fait à Quai-d'Ivry\nLe : "+new Date().toLocaleDateString("fr-GB",{month: "long",day: "numeric",year: "numeric"}), 20, 180);

                    //Ajout et positionnement d'image dans le pdf 
                    docpdf.addImage(data, 'jpeg', 10, 5);
                            // Va sauvegarder le fichier
                            docpdf.save("TesteAttustation.pdf");
                            console.log(docpdf.getFontList());
                            console.log('Fini !');                
            });
    }

//Exécute les fonctions ( sauf si mis en commentaire à l'aide du doubleslash "//")
    //boucle();
    //Minuterie();
    //TerminerFormation();
    //TestePDF()


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
