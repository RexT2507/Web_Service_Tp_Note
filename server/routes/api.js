// MODULES DE MISE EN PLACE DU SERVEUR
const express = require('express');
const router = express.Router();

// MODULES DE LA MISE EN PLACE MONGODB ET SECURITE
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// CREATION DE LA BASE DE DONNEE MONGODB
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'TpNoteWebService';
const User = require('../models/user');

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}

mongoose.connect(`${url}/${dbName}`, options);

const database = mongoose.connection;

database.once('open', _ => {
    console.log(`Connexion MongoDB : ${url}`);
    console.log(`Database : ${dbName}`);
});

database.on('error', err => {
    console.log('Erreur de connexion : ', err);
});

// FONCTION DE VERIFICATION DU TOKEN
function verifyToken(req, res, next) 
{
    if (!req.headers.authorization)
    {
        return res.status(401).send('Demande non autorisée');
    }
    let token = req.headers.authorization.split(' ')[1];
    if (token === 'null')
    {
        return res.status(401).send('Demande non autorisée');
    }
    let payload = jwt.verify(token, 'secretKey');
    if (!payload)
    {
        return res.status(401).send('Demande non autorisée');
    }
    req.userId = payload.subject
    next()
}

// RACINE DES ROUTES API
router.get('/', (req, res) => {
    res.send(`
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand" href="#">Racine de l'API</a>
    </nav>
    <div class="alert alert-dark" role="alert">
        <a>Connexion MongoDB : ${url}</a>
        <br>
        <a>Database : ${dbName}</a>
    </div>
    `);
});

// METHODE POUR CREER UN NOUVEL UTILISATEUR
router.post('/register', (req, res) => {

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) 
        {
            return res.status(500).json({
                error: err
            });
        }
        else
        {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                password: hash,
                account: req.body.account,
                bank: req.body.bank,
            });    
            
            user.save()
                .then(result => {
                    console.log(result);
                    let payload = { subject: user._id };
                    let token = jwt.sign(payload, 'secretKey');
                    res.status(200).send({token});
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        }
    })

});// Fin de la méthode register

// METHODE POUR CONNECTER UN UTILISATEUR
router.post('/login', (req, res) => 
{
    User.findOne({ email: req.body.email }, function (err, user) {

        if (err)
        {
            return res.status(500).send('Error on the server.');
        }

        if (!user)
        {
            return res.status(404).send('Email invalide');
        }
        
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid)
        {
            return res.status(401).send('Mot de passe invalide');
        }
        console.log(user);
        const token = jwt.sign({ id: user._id }, 'secretKey', {
          expiresIn: 86400, // expires in 24 hours
          subject: JSON.stringify(user)
          
        });
        
        res.status(200).send({ auth: true, token: token});
    });

}); // Fin de la méthode login

// METHODE POUR AVOIR LE CONTENU DU COMPTE EN BANQUE
router.get('/account/:id', verifyToken, (req, res) => {

    User.findById(req.params.id, {password: 0}, (err, user) => {
        if(err)
        {
            return res.status(500).send(`Nous rencontrons un problème dans la recherche du compte`);
        }

        if(!user)
        {
            return res.status(404).send(`Nous ne trouvons pas le compte`);
        }

        res.status(200).send(user);
        
    });

});

router.get('/edit/:id', (req, res) => {

    let id = req.params.id;

    User.findById(id, function (err, user)
    {
        res.json(user);
    })
});

// METHODE DE RETRAIT SUR LA SOLDE DU COMPTE
router.put('/account/add/:id', verifyToken, (req, res) => {
    
    User.findById(req.params.id, function(err, user) 
    {
        if(err)
        {
            return res.status(500).send(`Nous rencontrons un problème dans la recherche du compte`);
        }

        if(!user)
        {
            res.status(404).send("Compte non trouvé");
        }
        else 
        {
          const modifiedAccount = user.account + req.body.account;

          if (modifiedAccount <= 0)
          {
            return res.status(401).send(`Vous n'avez pas assez d'argent`);
          }
          else
          {
            modifiedAccount.save().then(result => 
            {
                console.log(result);
                res.status(200).send('Ajout effectué');
            })
            .catch(err => 
            {
                console.log(err);
                res.status(400).send("Ajout impossible");
            });
          }
    
        }
    });
});

// METHODE DE RETRAIT SUR LA SOLDE DU COMPTE
router.put('/account/remove/:id', verifyToken, (req, res) => {
    
    User.findById(req.params.id, function(err, user) 
    {
        if(err)
        {
            return res.status(500).send(`Nous rencontrons un problème dans la recherche du compte`);
        }

        if(!user)
        {
            res.status(404).send("Compte non trouvé");
        }
        else 
        {
          const modifiedAccount = user.account - req.body.account;

          if (modifiedAccount <= 0)
          {
            return res.status(401).send(`Vous n'avez pas assez d'argent`);
          }
          else
          {
            modifiedAccount.save().then(result => 
            {
                console.log(result);
                res.status(200).send('Retrait effectué');
            })
            .catch(err => 
            {
                console.log(err);
                res.status(400).send("Retrait impossible");
            });
          }
    
        }
    });
});

module.exports = router;