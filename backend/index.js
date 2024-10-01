const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = 3000;
console.log("Db User name", process.env.DB_USER);
const jwt = require("jsonwebtoken")


// Middleware
app.use(cors());
app.use(express.json());

//Verify Token
const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ message: 'Invalid authorization !' })
  }
  const token = authorization?.split(' ')[1];
  jwt.verify(token, process.env.ASSESS_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: 'Forbidden Access !' })
    }
    req.decoded = decoded;
    next();
  })
}

//################# MongoDB Connection ##########################

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cbc-master.xpzs66g.mongodb.net/?retryWrites=true&w=majority&appName=CBC-master`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Create database and collections
    const database = client.db("CBC-BD");

    const cdcCollection = database.collection("cdc");
    const departementCollection = database.collection("departements");
    const categorieCollection = database.collection("categorie");
    const postCollection = database.collection('post');
    const userCollection = database.collection("users");
    const kpisCollection = database.collection("kpis");
    const usercategorieCollection = database.collection("usercategorie")
    const notefCollection = database.collection("notef")
    const formuleCollection = database.collection("formule")
    const formuleGenCollection = database.collection("formule-generale")
    const userKpiCollection = database.collection("userkpi")
    const indicateurGlobCollection = database.collection("indicateur-glob")
    const indicateurStruCollection = database.collection("indicateur-stru")




    // const comCollection = database.collection("competences_coms");
    //const lingCollection = database.collection("competences_lings");
    //const metierCollection = database.collection("competences_metiers");

    // ################# JSON-WEB-TOKEN json ###################
    app.post("/api/set-token", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ASSESS_SECRET, {
        expiresIn: '24h'
      });
      res.send({ token })
    })

    //middleware for admin and supervisor
    //################# Admin ####################
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      if (user.role === 'admin') {
        next();
      } else {
        return res.status(403).send({ message: 'Forbidden Access Need Role Admin or SuperVisor' })
      }
    }

    //################# SUPERVISOR ####################
    const verifySuperVisor = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      if (user.role === 'supervisor') {
        next();
      } else {
        return res.status(403).send({ message: 'Forbidden Access Need Role SuperVisor' })
      }
    }


    //########################################################
    // ########################### CDC #######################
    //########################################################
    //ADD CDC TO DB
    app.post('/new-cdc', async (req, res) => {
      const newCDC = req.body;
      const result = await cdcCollection.insertOne(newCDC);
      res.send(result);
    });
    // GET ALL CDC
    app.get('/agences', async (req, res) => {
      try {
        // Récupérer tous les documents de la collection CDC
        const cdcList = await cdcCollection.find({}).toArray();
        res.status(200).json(cdcList); // Envoyer la liste des CDC en réponse
      } catch (error) {
        console.error('Error fetching CDCs:', error); // Afficher l'erreur complète dans les logs
        res.status(500).json({ error: 'Failed to fetch CDCs', details: error.message }); // Inclure le message d'erreur détaillé dans la réponse
      }
    });

    //########################################################
    // ########################### CRUD DEPARTEMENT #######################
    //########################################################
    //ADD NEW DEPARTEMENT
    app.post('/new-dep', async (req, res) => {
      const { nom, agenceId } = req.body;

      try {
        // Convertir agenceId en ObjectId
        const agenceObjectId = new ObjectId(agenceId);

        // Créer le nouveau département
        const newDepartement = {
          nom,
          agenceId: agenceObjectId,
        };

        // Insérer le nouveau département
        const result = await departementCollection.insertOne(newDepartement);

        // Récupérer le document inséré à l'aide de l'ID retourné
        const insertedDepartement = await departementCollection.findOne({ _id: result.insertedId });

        res.status(201).json(insertedDepartement); // Envoyer une réponse de succès avec le document inséré
      } catch (error) {
        console.error('Error adding new departement:', error); // Afficher l'erreur complète dans les logs
        res.status(500).json({ error: 'Failed to add new departement', details: error.message }); // Inclure le message d'erreur détaillé dans la réponse
      }
    });

    // Route PUT pour mettre à jour un département
    app.put('/update-dep/:id', async (req, res) => {
      const departementId = req.params.id; // ID du département à mettre à jour
      const { nom, agenceId } = req.body; // Nouveaux champs

      try {
        // Convertir agenceId en ObjectId
        const agenceObjectId = new ObjectId(agenceId);

        // Mettre à jour le département
        const result = await departementCollection.updateOne(
          { _id: new ObjectId(departementId) },
          { $set: { nom, agenceId: agenceObjectId } }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Departement not found' });
        }

        // Récupérer le document mis à jour
        const updatedDepartement = await departementCollection.findOne({ _id: new ObjectId(departementId) });

        res.status(200).json(updatedDepartement); // Envoyer une réponse de succès avec le document mis à jour
      } catch (error) {
        console.error('Error updating departement:', error); // Afficher l'erreur complète dans les logs
        res.status(500).json({ error: 'Failed to update departement', details: error.message }); // Inclure le message d'erreur détaillé dans la réponse
      }
    });

    // affichage by ID new department 
    app.get('/dep/:id', async (req, res) => {
      const departementId = req.params.id; // ID du département à récupérer

      try {
        // Récupérer le département
        const departement = await departementCollection.findOne({ _id: new ObjectId(departementId) });

        if (!departement) {
          return res.status(404).json({ error: 'Departement not found' });
        }

        res.status(200).json(departement); // Envoyer une réponse avec les informations du département
      } catch (error) {
        console.error('Error fetching departement:', error); // Afficher l'erreur complète dans les logs
        res.status(500).json({ error: 'Failed to fetch departement', details: error.message }); // Inclure le message d'erreur détaillé dans la réponse
      }
    });

    //  GET ALL 
    app.get('/deps', async (req, res) => {
      try {
        // Récupérer tous les départements
        const departements = await departementCollection.find({}).toArray();

        res.status(200).json(departements); // Envoyer une réponse avec tous les départements
      } catch (error) {
        console.error('Error fetching departements:', error); // Afficher l'erreur complète dans les logs
        res.status(500).json({ error: 'Failed to fetch departements', details: error.message }); // Inclure le message d'erreur détaillé dans la réponse
      }
    });

    //Delete DeP
    // Route DELETE pour supprimer un département
    app.delete('/delete-dep/:id', async (req, res) => {
      const departementId = req.params.id; // ID du département à supprimer

      try {
        // Supprimer le département
        const result = await departementCollection.deleteOne({ _id: new ObjectId(departementId) });

        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Departement not found' });
        }

        res.status(200).json({ message: 'Departement deleted successfully' }); // Envoyer une réponse de succès
      } catch (error) {
        console.error('Error deleting departement:', error); // Afficher l'erreur complète dans les logs
        res.status(500).json({ error: 'Failed to delete departement', details: error.message }); // Inclure le message d'erreur détaillé dans la réponse
      }
    });



    /////////////////
    app.post('/new-departement', async (req, res) => {
      const { nom, description, manager, employes, agenceId } = req.body;

      try {
        // Convertir agenceId et manager en ObjectId
        const agenceObjectId = new ObjectId(agenceId);
        const managerObjectId = new ObjectId(manager);

        // Convertir les employes en ObjectId
        const employesObjectIds = employes.map(emp => new ObjectId(emp));

        const newDepartement = {
          nom,
          description,
          manager: managerObjectId,
          employes: employesObjectIds,
          agenceId: agenceObjectId,
        };

        // Insérer le nouveau département
        const result = await departementCollection.insertOne(newDepartement);

        // Récupérer le document inséré à l'aide de l'ID retourné
        const insertedDepartement = await departementCollection.findOne({ _id: result.insertedId });

        res.status(201).json(insertedDepartement); // Envoyer une réponse de succès avec le document inséré
      } catch (error) {
        console.error('Error adding new departement:', error); // Afficher l'erreur complète dans les logs
        res.status(500).json({ error: 'Failed to add new departement', details: error.message }); // Inclure le message d'erreur détaillé dans la réponse
      }
    });


    //Get ALL DEPARTEMENT Neqsa les detail mtaa il User
    app.get('/departements', async (req, res) => {
      try {
        const departements = await departementCollection.find({}).toArray();
        res.json(departements);
      } catch (error) {
        console.error('Error retrieving departement:', error);
        res.status(500).json({ error: 'Failed to retrieve departement' });
      }
    });

    //Get BY ID DEPARTEMENT
    app.get('/departement/id/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      try {
        const result = await departementCollection.aggregate([
          { $match: query }, // Trouver le département par ID
          {
            $lookup: {
              from: 'cdc',
              localField: 'agenceId',
              foreignField: '_id',
              as: 'agence'
            }
          },
          { $unwind: { path: '$agence', preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: 'users',
              localField: 'manager',
              foreignField: '_id',
              as: 'managerDetails'
            }
          },
          { $unwind: { path: '$managerDetails', preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: 'users',
              localField: 'employes',
              foreignField: '_id',
              as: 'employesDetails'
            }
          },
          {
            $project: {
              _id: 1,
              nom: 1,
              description: 1,
              'agence.nom': 1,
              'managerDetails.name': 1,
              'managerDetails.phone': 1,
              'managerDetails.email': 1,
              'managerDetails.photourl': 1,
              'employesDetails.name': 1,
              'employesDetails.phone': 1,
              'employesDetails.email': 1,
              'employesDetails.photourl': 1
            }
          }
        ]).toArray();

        if (result.length === 0) {
          console.warn('Departement not found for ID:', id);
          return res.status(404).json({ error: 'Departement not found' });
        }

        res.json(result[0]);
      } catch (error) {
        console.error('Error retrieving departement by ID:', error);
        res.status(500).json({ error: 'Failed to retrieve departement', details: error.message });
      }
    });

    //Delete Departement
    app.delete('/delete-departement/id/:id', verifyJWT, async (req, res) => {
      // Récupération de l'ID depuis les paramètres de la requête
      const id = req.params.id;

      // Création d'une requête pour rechercher le département à supprimer par son _id
      const query = { _id: new ObjectId(id) };

      try {
        // Suppression du document correspondant à l'ID
        const result = await departementCollection.deleteOne(query);

        // Vérification si le document a été supprimé
        if (result.deletedCount === 1) {
          res.status(200).json({ message: 'Departement deleted successfully' });
        } else {
          res.status(404).json({ message: 'Departement not found' });
        }
      } catch (error) {
        console.error('Error deleting departement:', error);
        res.status(500).json({ error: 'Failed to delete departement' });
      }
    });

    //GET ALL DEP WITH ALL INFO 
    app.get('/alldepartements', async (req, res) => {
      try {
        const departements = await departementCollection.aggregate([
          {
            $lookup: {
              from: 'cdc', // Nom de la collection d'agences
              localField: 'agenceId',
              foreignField: '_id',
              as: 'agence'
            }
          },
          {
            $unwind: {
              path: '$agence',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'users', // Nom de la collection d'utilisateurs
              localField: 'manager',
              foreignField: '_id',
              as: 'managerDetails'
            }
          },
          {
            $unwind: {
              path: '$managerDetails',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'users', // Nom de la collection d'utilisateurs
              localField: 'employes',
              foreignField: '_id',
              as: 'employesDetails'
            }
          },
          {
            $project: {
              _id: 1,
              nom: 1,
              description: 1,
              'agence.nom': 1, // Nom de l'agence
              'managerDetails.name': 1,
              'managerDetails.phone': 1,
              'managerDetails.email': 1,
              'managerDetails.photourl': 1,
              employesDetails: {
                name: 1,
                phone: 1,
                email: 1,
                photourl: 1
              }
            }
          }
        ]).toArray();

        res.json(departements);
      } catch (error) {
        console.error('Error retrieving departement:', error);
        res.status(500).json({ error: 'Failed to retrieve departement', details: error.message });
      }
    });

    //Update Departement 
    app.patch('/departement/update/:id', async (req, res) => {
      const id = req.params.id;
      const { nom, description, manager, employes, agenceId } = req.body;

      // Créer l'objet de mise à jour
      const updateFields = {};
      if (nom) updateFields.nom = nom;
      if (description) updateFields.description = description;
      if (manager) updateFields.manager = new ObjectId(manager);
      if (employes) updateFields.employes = employes.map(emp => new ObjectId(emp));
      if (agenceId) updateFields.agenceId = new ObjectId(agenceId);

      try {
        // Mettre à jour le département
        const result = await departementCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateFields }
        );

        if (result.matchedCount === 0) {
          console.warn('Departement not found for ID:', id);
          return res.status(404).json({ error: 'Departement not found' });
        }

        res.json({ message: 'Departement updated successfully' });
      } catch (error) {
        console.error('Error updating departement:', error);
        res.status(500).json({ error: 'Failed to update departement', details: error.message });
      }
    });

    //UpdatePUT Departement 
    app.put('/departements/update/:id', async (req, res) => {
      const id = req.params.id;
      const { nom, description, manager, employes, agenceId } = req.body;

      // Créer l'objet de mise à jour
      const updateFields = {};
      if (nom) updateFields.nom = nom;
      if (description) updateFields.description = description;
      if (manager) updateFields.manager = new ObjectId(manager);
      if (employes) updateFields.employes = employes.map(emp => new ObjectId(emp));
      if (agenceId) updateFields.agenceId = new ObjectId(agenceId);

      try {
        // Mettre à jour le département
        const result = await departementCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateFields }
        );

        if (result.matchedCount === 0) {
          console.warn('Departement not found for ID:', id);
          return res.status(404).json({ error: 'Departement not found' });
        }

        res.json({ message: 'Departement updated successfully' });
      } catch (error) {
        console.error('Error updating departement:', error);
        res.status(500).json({ error: 'Failed to update departement', details: error.message });
      }
    });



    //########################################################
    // ########################### CRUD Post #######################
    //########################################################

    //Add POST
    app.post('/new-post', async (req, res) => {
      const { nom, departementId } = req.body;
      try {
        const newPost = {
          nom,
          // Inclure departementId seulement s'il est fourni
          ...(departementId && { departementId: new ObjectId(departementId) }),
        };

        // Insérer le nouveau post
        const result = await postCollection.insertOne(newPost);

        // Récupérer le document inséré
        const insertedPost = await postCollection.findOne({ _id: result.insertedId });
        res.status(201).json(insertedPost); // Envoyer une réponse de succès avec le document inséré
      } catch (error) {
        console.error('Error adding new post:', error); // Afficher l'erreur complète dans les logs
        res.status(500).json({ error: 'Failed to add new post', details: error.message }); // Inclure le message d'erreur détaillé dans la réponse
      }
    });

    //Affichage Posts
    app.get('/posts', async (req, res) => {
      try {
        const posts = await postCollection.aggregate([
          {
            $lookup: {
              from: 'departements',
              localField: 'departementId',
              foreignField: '_id',
              as: 'departement'
            }
          },
          { $unwind: '$departement' },
          {
            $project: {
              _id: 1,
              nom: 1,
              'departement.nom': 1 // Afficher le nom du département
            }
          }
        ]).toArray();

        res.json(posts);
      } catch (error) {
        console.error('Error retrieving posts:', error);
        res.status(500).json({ error: 'Failed to retrieve posts', details: error.message });
      }
    });

    //Affiche Post par ID
    app.get('/post/:id', async (req, res) => {
      const id = req.params.id;

      try {
        const post = await postCollection.aggregate([
          { $match: { _id: new ObjectId(id) } },
          {
            $lookup: {
              from: 'departements',
              localField: 'departementId',
              foreignField: '_id',
              as: 'departement'
            }
          },
          { $unwind: '$departement' },
          {
            $project: {
              _id: 1,
              nom: 1,
              'departement.nom': 1 // Afficher le nom du département
            }
          }
        ]).toArray();

        if (post.length === 0) {
          return res.status(404).json({ error: 'Post not found' });
        }

        res.json(post[0]);
      } catch (error) {
        console.error('Error retrieving post by ID:', error);
        res.status(500).json({ error: 'Failed to retrieve post', details: error.message });
      }
    });

    //Afficher Post par IDdepartement 
    app.get('/posts/departement/:departementId', async (req, res) => {
      const departementId = req.params.departementId;

      try {
        // Convertir departementId en ObjectId
        const departementObjectId = new ObjectId(departementId);

        // Utiliser l'agrégation pour joindre les informations des départements
        const posts = await postCollection.aggregate([
          {
            $match: { departementId: departementObjectId }
          },
          {
            $lookup: {
              from: 'departements', // Nom de la collection des départements
              localField: 'departementId',
              foreignField: '_id',
              as: 'departementDetails'
            }
          },
          {
            $unwind: '$departementDetails' // Décompose le tableau en objets individuels
          },
          {
            $project: {
              nom: 1,
              departementId: 1,
              'departementDetails.nom': 1 // Inclure uniquement le nom du département
            }
          }
        ]).toArray();

        // Vérifier si des postes ont été trouvés
        if (posts.length === 0) {
          return res.status(404).json({ message: 'No posts found for this department' });
        }

        // Envoyer les postes trouvés comme réponse
        res.json(posts);
      } catch (error) {
        console.error('Error retrieving posts by department ID:', error);
        res.status(500).json({ error: 'Failed to retrieve posts', details: error.message });
      }
    });

    //Update post 
    app.put('/posts/:id', async (req, res) => {
      const postId = req.params.id;
      const { nom, departementId } = req.body;

      try {
        // Convertir postId et departementId en ObjectId
        const postObjectId = new ObjectId(postId);
        const departementObjectId = new ObjectId(departementId);

        // Mettre à jour le poste
        const result = await postCollection.updateOne(
          { _id: postObjectId },
          { $set: { nom, departementId: departementObjectId } }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({ message: 'Post not found or no changes made' });
        }

        // Récupérer le poste mis à jour
        const updatedPost = await postCollection.findOne({ _id: postObjectId });

        // Envoyer le poste mis à jour comme réponse
        res.json(updatedPost);
      } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Failed to update post', details: error.message });
      }
    });

    //Delete by id
    app.delete('/del-post/:id', async (req, res) => {
      const id = req.params.id;

      try {
        const result = await postCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
          res.status(200).json({ message: 'Post deleted successfully' });
        } else {
          res.status(404).json({ message: 'Post not found' });
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post', details: error.message });
      }
    });



    //########################################################
    // ########################### CRUD User #######################
    //########################################################

    //ADD User
    app.post('/new-user', async (req, res) => {
      const newUser = req.body;
      newUser.postId = new ObjectId(newUser.postId);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    //Get ALL Users
    app.get('/users', async (req, res) => {
      try {
        const users = await userCollection.aggregate([
          {
            $lookup: {
              from: 'departements', // Nom de la collection des départements
              localField: 'departementId',
              foreignField: '_id',
              as: 'departement'
            }
          },
          {
            $unwind: {
              path: '$departement',
              preserveNullAndEmptyArrays: true // Inclure les utilisateurs même si aucun département n'est trouvé
            }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              photourl: 1,
              role: 1,
              phone: 1,
              'departement.nom': 1, // Inclure seulement le nom du département dans les résultats
              'departement.telephone': 1 // Inclure le téléphone du département
            }
          }
        ]).toArray();

        res.json(users);
      } catch (error) {
        console.error('Error retrieving users with departments:', error);
        res.status(500).json({ error: 'Failed to retrieve users with departments' });
      }
    });

    //Get all user with nom posts : 
    app.get('/usersp', async (req, res) => {
      try {
        const users = await userCollection.aggregate([
          {
            $lookup: {
              from: 'post', // Nom de la collection des postes
              localField: 'postId',
              foreignField: '_id',
              as: 'post'
            }
          },
          {
            $unwind: {
              path: '$post',
              preserveNullAndEmptyArrays: true // Inclure les utilisateurs même si aucun poste n'est trouvé
            }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              photourl: 1,
              role: 1,
              phone: 1,
              'post.nom': 1 // Inclure le nom du poste
            }
          }
        ]).toArray();

        res.json(users);
      } catch (error) {
        console.error('Error retrieving users with posts:', error);
        res.status(500).json({ error: 'Failed to retrieve users with posts' });
      }
    });


    // Get all users with post and department information
    app.get('/usersdp', async (req, res) => {
      try {
        const users = await userCollection.aggregate([
          {
            $lookup: {
              from: 'post', // Collection des postes
              localField: 'postId',
              foreignField: '_id',
              as: 'post'
            }
          },
          {
            $unwind: {
              path: '$post',
              preserveNullAndEmptyArrays: true // Inclure les utilisateurs même si aucun poste n'est trouvé
            }
          },
          {
            $lookup: {
              from: 'departements', // Collection des départements
              localField: 'post.departementId',
              foreignField: '_id',
              as: 'departement'
            }
          },
          {
            $unwind: {
              path: '$departement',
              preserveNullAndEmptyArrays: true // Inclure les postes même si aucun département n'est trouvé
            }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              phone: 1,
              email: 1,
              photourl: 1,
              username: 1,
              role: 1,
              'post._id': 1,
              'post.nom': 1, // Inclure seulement le nom du poste dans les résultats
              'departement.nom': 1 // Inclure seulement le nom du département dans les résultats
            }
          }
        ]).toArray();

        res.json(users);
      } catch (error) {
        console.error('Error retrieving users with post and department:', error);
        res.status(500).json({ error: 'Failed to retrieve users with post and department' });
      }
    });

    //geet all by id post with all detail 
    app.get('/usersdp/post/:postId', async (req, res) => {
      try {
        const { postId } = req.params;

        // Vérifier si l'ID du poste est valide
        if (!ObjectId.isValid(postId)) {
          return res.status(400).json({ error: 'Invalid post ID format' });
        }

        const users = await userCollection.aggregate([
          {
            $match: {
              postId: new ObjectId(postId) // Filtrer par l'ID du poste
            }
          },
          {
            $lookup: {
              from: 'post', // Collection des postes
              localField: 'postId',
              foreignField: '_id',
              as: 'post'
            }
          },
          {
            $unwind: {
              path: '$post',
              preserveNullAndEmptyArrays: true // Inclure les utilisateurs même si aucun poste n'est trouvé
            }
          },
          {
            $lookup: {
              from: 'departements', // Collection des départements
              localField: 'post.departementId',
              foreignField: '_id',
              as: 'departement'
            }
          },
          {
            $unwind: {
              path: '$departement',
              preserveNullAndEmptyArrays: true // Inclure les postes même si aucun département n'est trouvé
            }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              phone: 1,
              email: 1,
              photourl: 1,
              username: 1,
              role: 1,
              'post.nom': 1, // Inclure seulement le nom du poste dans les résultats
              'departement.nom': 1 // Inclure seulement le nom du département dans les résultats
            }
          }
        ]).toArray();

        if (users.length === 0) {
          return res.status(404).json({ error: 'No users found for the specified post' });
        }

        res.json(users);
      } catch (error) {
        console.error('Error retrieving users by post:', error);
        res.status(500).json({ error: 'Failed to retrieve users by post' });
      }
    });







    //Get User By ID
    app.get('/user/id/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    //Get User By Email
    app.get('/users/email/:email', async (req, res) => {
      const email = req.params.email;
      try {
        const user = await userCollection.findOne({ email: email });
        if (user) {
          res.json(user);
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      } catch (error) {
        console.error('Error retrieving user by email:', error);
        res.status(500).json({ error: 'Failed to retrieve user' });
      }
    });

    //Get User By Depar
    app.get('/users/department/:departmentId', async (req, res) => {
      const { departmentId } = req.params;

      if (!ObjectId.isValid(departmentId)) {
        return res.status(400).json({ error: 'Invalid departmentId' });
      }

      try {
        console.log(`Fetching users for departmentId: ${departmentId}...`);

        const users = await userCollection.aggregate([
          {
            $match: { departementId: new ObjectId(departmentId) }
          },
          {
            $lookup: {
              from: 'departements', // Nom de la collection des départements
              localField: 'departementId',
              foreignField: '_id',
              as: 'departement'
            }
          },
          {
            $unwind: {
              path: '$departement',
              preserveNullAndEmptyArrays: true // Inclure les utilisateurs même si aucun département n'est trouvé
            }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              photourl: 1,
              role: 1,
              phone: 1,
              'departement.nom': 1, // Inclure seulement le nom du département dans les résultats
              'departement.telephone': 1 // Inclure le téléphone du département
            }
          }
        ]).toArray();

        console.log("Users fetched:", users);

        if (users.length === 0) {
          console.log('No users found for this department.');
          return res.status(404).json({ message: 'No users found for this department' });
        }

        res.json(users);
      } catch (error) {
        console.error('Error retrieving users by department:', error);
        res.status(500).json({ error: 'Failed to retrieve users by department' });
      }
    });


    //Delete User Only superVisor
    app.delete('/delete-user/:id', verifyJWT, verifySuperVisor, async (req, res) => {
      const id = req.params.id;
      try {
        const result = await userCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 1) {
          res.json({ message: 'User deleted successfully' });
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
      }
    });

    //Update User 
    app.patch('/update-users/:id', async (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;
      try {
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            name: updateUser.name,
            email: updateUser.email,
            role: updateUser.role,
            phone: updateUser.phone,
            photoUrl: updateUser.photoUrl,
            departementId: updateUser.departementId ? new ObjectId(updateUser.departementId) : null,
          },
        };
        const result = await userCollection.updateOne(filter, updateDoc);
        if (result.modifiedCount === 1) {
          res.json({ message: 'User updated successfully' });
        } else {
          res.status(404).json({ message: 'User not found or no changes made' });
        }
      } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
      }
    });
    //UPDATE PUT User
    app.put('/update-user/:id', async (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;

      try {
        // Créer le filtre pour rechercher l'utilisateur par ID
        const filter = { _id: new ObjectId(id) };

        // Créer l'objet de mise à jour avec des champs conditionnels
        const updateDoc = {
          $set: {
            name: updateUser.name,
            email: updateUser.email,
            role: updateUser.role,
            phone: updateUser.phone,
            photourl: updateUser.photourl,
            postId: updateUser.postId ? new ObjectId(updateUser.postId) : null
            // Supprimer departementId de l'objet de mise à jour
          },
        };

        // Mettre à jour l'utilisateur dans la base de données
        const result = await userCollection.updateOne(filter, updateDoc);

        // Vérifier si un document a été modifié
        if (result.modifiedCount === 1) {
          res.json({ message: 'User updated successfully' });
        } else {
          res.status(404).json({ message: 'User not found or no changes made' });
        }
      } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
      }
    });



    //########################################################
    // ########### CRUD Categorie Competence #################
    //########################################################
    //ADD NEW Categorie Competence
    app.post('/new-categorie-com', async (req, res) => {
      const { identif, nom, etat, type, niveau, postId, date } = req.body;

      try {
        // Convertir postId en ObjectId
        const postObjectId = new ObjectId(postId);

        // Vérifiez si la date est définie et validez son format
        if (!date) {
          return res.status(400).json({ error: 'Date is required' });
        }

        // Convertir la date en format Date
        const categoryDate = new Date(date); // Assurez-vous que la date est au format approprié

        if (isNaN(categoryDate.getTime())) { // Vérifie si la date est valide
          return res.status(400).json({ error: 'Invalid date format' });
        }

        const newCategorie = {
          identif,
          nom,
          etat,
          type,
          niveau,
          postId: postObjectId,
          date: categoryDate // Ajouter le champ date
        };

        const result = await categorieCollection.insertOne(newCategorie);
        res.send(result);
      } catch (error) {
        console.error('Error adding new Categorie:', error);
        res.status(500).json({ error: 'Failed to add new Categorie' });
      }
      ;
    })

    // GET Categories WITH Post and Department Info
    app.get('/cat-details', async (req, res) => {
      try {

        const categories = await categorieCollection.aggregate([
          {
            $lookup: {
              from: 'post', // collection to join
              localField: 'postId', // field from categorie collection
              foreignField: '_id', // field from posts collection
              as: 'postDetails' // alias for the result
            }
          },
          {
            $unwind: {
              path: '$postDetails', // unwind the resulting array to de-normalize the data
              preserveNullAndEmptyArrays: true // keep documents without matching postDetails
            }
          },
          {
            $lookup: {
              from: 'departements', // collection to join
              localField: 'postDetails.departementId', // field from postDetails collection
              foreignField: '_id', // field from departements collection
              as: 'departementDetails' // alias for the result
            }
          },
          {
            $unwind: {
              path: '$departementDetails', // unwind the resulting array to de-normalize the data
              preserveNullAndEmptyArrays: true // keep documents without matching departementDetails
            }
          },
          {
            $project: {
              _id: 1,
              identif: 1,
              nom: 1,
              etat: 1,
              type: 1,
              niveau: 1,
              postId: 1,
              date: 1, // Assurez-vous que le champ date est inclus dans la projection
              'postDetails.nom': 1, // include post name in the result
              'departementDetails.nom': 1 // include department name in the result
            }
          }
        ]).toArray();



        if (categories.length === 0) {
          console.log('No results found. Please check the IDs and fields.');
          return res.status(404).json({ message: 'No categories found' });
        }

        res.json(categories);
      } catch (error) {
        console.error('Error retrieving categories:', error);
        res.status(500).json({ error: 'Failed to retrieve categories' });
      }
    });

    //get by id
    app.get('/cat-details/:id', async (req, res) => {
      try {
        const competenceId = new ObjectId(req.params.id); // Utilisation correcte de ObjectId

        const competence = await categorieCollection.aggregate([
          {
            $match: { _id: competenceId } // Filtrer par ID de compétence
          },
          {
            $lookup: {
              from: 'post', // Collection à joindre
              localField: 'postId', // Champ de la collection compétence
              foreignField: '_id', // Champ de la collection post
              as: 'postDetails' // Alias pour le résultat
            }
          },
          {
            $unwind: {
              path: '$postDetails', // Dé-normaliser le tableau résultant
              preserveNullAndEmptyArrays: true // Conserver les documents sans correspondance
            }
          },
          {
            $lookup: {
              from: 'departements', // Collection à joindre
              localField: 'postDetails.departementId', // Champ de la collection postDetails
              foreignField: '_id', // Champ de la collection départements
              as: 'departementDetails' // Alias pour le résultat
            }
          },
          {
            $unwind: {
              path: '$departementDetails', // Dé-normaliser le tableau résultant
              preserveNullAndEmptyArrays: true // Conserver les documents sans correspondance
            }
          },
          {
            $project: {
              _id: 1,
              identif: 1,
              nom: 1,
              etat: 1,
              type: 1,
              niveau: 1,
              postId: 1,
              date: 1, // Assurez-vous que le champ date est inclus dans la projection
              'postDetails.nom': 1, // Inclure le nom du poste dans le résultat
              'departementDetails.nom': 1 // Inclure le nom du département dans le résultat
            }
          }
        ]).toArray();

        if (competence.length === 0) {
          console.log('No results found for the provided ID.');
          return res.status(404).json({ message: 'Competence not found' });
        }

        res.json(competence[0]); // Renvoyer le premier résultat (unique pour un ID)
      } catch (error) {
        console.error('Error retrieving competence:', error);
        res.status(500).json({ error: 'Failed to retrieve competence' });
      }
    });

    //get categorie by post
    app.get('/cat-details/post/:postId', async (req, res) => {
      try {
        const { postId } = req.params;

        // Vérifier si l'ID du poste est valide
        if (!ObjectId.isValid(postId)) {
          return res.status(400).json({ error: 'Invalid post ID format' });
        }

        const categories = await categorieCollection.aggregate([
          {
            $match: {
              postId: new ObjectId(postId) // Filtrer par l'ID du poste
            }
          },
          {
            $lookup: {
              from: 'post', // Collection des postes
              localField: 'postId', // Champ de la collection des catégories
              foreignField: '_id', // Champ de la collection des postes
              as: 'postDetails' // Alias pour le résultat
            }
          },
          {
            $unwind: {
              path: '$postDetails', // Déplier le tableau résultant pour normaliser les données
              preserveNullAndEmptyArrays: true // Conserver les documents sans correspondance
            }
          },
          {
            $lookup: {
              from: 'departements', // Collection des départements
              localField: 'postDetails.departementId', // Champ de la collection des postes
              foreignField: '_id', // Champ de la collection des départements
              as: 'departementDetails' // Alias pour le résultat
            }
          },
          {
            $unwind: {
              path: '$departementDetails', // Déplier le tableau résultant pour normaliser les données
              preserveNullAndEmptyArrays: true // Conserver les documents sans correspondance
            }
          },
          {
            $project: {
              _id: 1,
              identif: 1,
              nom: 1,
              etat: 1,
              type: 1,
              niveau: 1,
              postId: 1,
              date: 1, // Inclure le champ date dans la projection
              'postDetails.nom': 1, // Inclure le nom du poste dans les résultats
              'departementDetails.nom': 1 // Inclure le nom du département dans les résultats
            }
          }
        ]).toArray();

        if (categories.length === 0) {
          return res.status(404).json({ message: 'No categories found for the specified post' });
        }

        res.json(categories);
      } catch (error) {
        console.error('Error retrieving categories:', error);
        res.status(500).json({ error: 'Failed to retrieve categories' });
      }
    });

    //UPDATEEE
    app.put('/update-cat/:id', async (req, res) => {
      const { id } = req.params; // ID de la catégorie à mettre à jour
      const { identif, nom, etat, type, niveau, postId, date } = req.body;

      try {
        // Convertir id et postId en ObjectId
        const categorieObjectId = new ObjectId(id);
        const postObjectId = postId ? new ObjectId(postId) : null;

        // Vérifiez si la date est définie et validez son format
        if (!date) {
          return res.status(400).json({ error: 'Date is required' });
        }

        // Convertir la date en format Date
        const categoryDate = new Date(date); // Assurez-vous que la date est au format approprié

        if (isNaN(categoryDate.getTime())) { // Vérifie si la date est valide
          return res.status(400).json({ error: 'Invalid date format' });
        }

        // Préparer les données à mettre à jour
        const updatedCategorie = {
          identif,
          nom,
          etat,
          type,
          niveau,
          postId: postObjectId,
          date: categoryDate // Ajouter le champ date
        };

        // Mettre à jour la catégorie dans la base de données
        const result = await categorieCollection.updateOne(
          { _id: categorieObjectId },
          { $set: updatedCategorie }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Categorie not found' });
        }

        res.send(result);
      } catch (error) {
        console.error('Error updating Categorie:', error);
        res.status(500).json({ error: 'Failed to update Categorie' });
      }
    });






    ///zeyd
    //GET Categorie WITH Departement Info
    app.get('/categorie-details', async (req, res) => {
      try {
        // Ajout de logs pour vérifier les données dans la collection `categorie`


        const categories = await categorieCollection.aggregate([
          {
            $lookup: {
              from: 'departements', // collection to join
              localField: 'departementId', // field from categories collection
              foreignField: '_id', // field from departements collection
              as: 'departementDetails' // alias for the result
            }
          },
          {
            $unwind: '$departementDetails' // unwind the resulting array to de-normalize the data
          },
          {
            $project: {
              _id: 1,
              identif: 1,
              nom: 1,
              description: 1,
              type: 1,
              niveau: 1,
              departementId: 1,
              'departementDetails.nom': 1 // include departement name in the result
            }
          }
        ]).toArray();


        if (categories.length === 0) {
          console.log('No results found. Please check the IDs and fields.');
        }

        res.json(categories);
      } catch (error) {
        console.error('Error retrieving categories:', error);
        res.status(500).json({ error: 'Failed to retrieve categories' });
      }
    });


    // GET Categorie BY ID_Departement 
    app.get('/categorie-details/:departementId', async (req, res) => {
      const { departementId } = req.params;

      if (!ObjectId.isValid(departementId)) {
        return res.status(400).json({ error: 'Invalid departementId' });
      }

      try {
        console.log(`Fetching categories for departementId: ${departementId}...`);

        const categories = await categorieCollection.aggregate([
          {
            $match: { departementId: new ObjectId(departementId) }
          },
          {
            $lookup: {
              from: 'departements', // collection to join
              localField: 'departementId', // field from categories collection
              foreignField: '_id', // field from departements collection
              as: 'departementDetails' // alias for the result
            }
          },
          {
            $unwind: '$departementDetails' // unwind the resulting array to de-normalize the data
          },
          {
            $project: {
              _id: 1,
              nom: 1,
              description: 1,
              type: 1,
              niveau: 1,
              departementId: 1,
              'departementDetails.nom': 1 // include departement name in the result
            }
          }
        ]).toArray();

        console.log("Categories fetched:", categories);

        if (categories.length === 0) {
          console.log('No results found. Please check the IDs and fields.');
          return res.status(404).json({ message: 'No results found' });
        }

        res.json(categories);
      } catch (error) {
        console.error('Error retrieving categories:', error);
        res.status(500).json({ error: 'Failed to retrieve categories' });
      }
    });

    // GET Categories BY Type WITH Departement Info
    app.get('/categorie-details/type/:type', async (req, res) => {
      const { type } = req.params;

      if (!type) {
        return res.status(400).json({ error: 'Type is required' });
      }

      try {
        console.log(`Fetching categories for type: ${type}...`);

        const categories = await categorieCollection.aggregate([
          {
            $match: { type: type }
          },
          {
            $lookup: {
              from: 'departements', // collection to join
              localField: 'departementId', // field from categories collection
              foreignField: '_id', // field from departements collection
              as: 'departementDetails' // alias for the result
            }
          },
          {
            $unwind: '$departementDetails' // unwind the resulting array to de-normalize the data
          },
          {
            $project: {
              _id: 1,
              identif: 1,
              nom: 1,
              description: 1,
              type: 1,
              niveau: 1,
              departementId: 1,
              'departementDetails.nom': 1 // include departement name in the result
            }
          }
        ]).toArray();

        console.log("Categories fetched:", categories);

        if (categories.length === 0) {
          console.log('No results found. Please check the type.');
          return res.status(404).json({ message: 'No results found' });
        }

        res.json(categories);
      } catch (error) {
        console.error('Error retrieving categories:', error);
        res.status(500).json({ error: 'Failed to retrieve categories' });
      }
    });

    // GET Categories BY nom WITH Departement Info
    app.get('/categorie-details/nom/:nom', async (req, res) => {
      const { nom } = req.params;

      if (!nom) {
        return res.status(400).json({ error: 'nom is required' });
      }

      try {
        console.log(`Fetching categories for nom: ${nom}...`);

        const categories = await categorieCollection.aggregate([
          {
            $match: { nom: nom }
          },
          {
            $lookup: {
              from: 'departements', // collection to join
              localField: 'departementId', // field from categories collection
              foreignField: '_id', // field from departements collection
              as: 'departementDetails' // alias for the result
            }
          },
          {
            $unwind: '$departementDetails' // unwind the resulting array to de-normalize the data
          },
          {
            $project: {
              _id: 1,
              identif: 1,
              nom: 1,
              description: 1,
              type: 1,
              niveau: 1,
              departementId: 1,
              'departementDetails.nom': 1 // include departement name in the result
            }
          }
        ]).toArray();

        console.log("Categories fetched:", categories);

        if (categories.length === 0) {
          console.log('No results found. Please check the name.');
          return res.status(404).json({ message: 'No results found' });
        }

        res.json(categories);
      } catch (error) {
        console.error('Error retrieving categories:', error);
        res.status(500).json({ error: 'Failed to retrieve categories' });
      }
    });

    // DELETE Categorie Competence
    app.delete('/categorie-com/del/:id', async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      try {
        const result = await categorieCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
          res.json({ message: 'Categorie deleted successfully' });
        } else {
          res.status(404).json({ error: 'Categorie not found' });
        }
      } catch (error) {
        console.error('Error deleting Categorie:', error);
        res.status(500).json({ error: 'Failed to delete Categorie' });
      }
    });

    //Update
    app.patch('/categorie-com/update/:id', async (req, res) => {
      const id = req.params.id; // Récupérer l'ID de la catégorie à mettre à jour

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const updates = req.body;

      try {
        // Convertir departementId en ObjectId 
        if (updates.departementId) {
          updates.departementId = new ObjectId(updates.departementId);
        }

        const filter = { _id: new ObjectId(id) };
        const updateDoc = { $set: updates };

        const result = await categorieCollection.updateOne(filter, updateDoc);

        if (result.matchedCount === 1) {
          res.json({ message: 'Categorie updated successfully' });
        } else {
          res.status(404).json({ error: 'Categorie not found' });
        }
      } catch (error) {
        console.error('Error updating Categorie:', error);
        res.status(500).json({ error: 'Failed to update Categorie' });
      }
    });




    //########################################################
    // ############## CRUD usercategorie ####################
    //########################################################
   
    // Ajouter une nouvelle entrée dans `usercategorie`
    app.post('/new-usercategorie', async (req, res) => {
      try {
        const { userCategories } = req.body;

        // Vérifiez que `userCategories` est un tableau
        if (!Array.isArray(userCategories)) {
          return res.status(400).json({ message: 'Invalid input: userCategories must be an array' });
        }

        // Convertir les identifiants en ObjectId
        const formattedUserCategories = userCategories.map(({ id_user, id_categorie, niveau_user }) => ({
          id_user: new ObjectId(id_user),
          id_categorie: new ObjectId(id_categorie),
          niveau_user
        }));

        const result = await usercategorieCollection.insertMany(formattedUserCategories);

        res.status(201).json({ message: 'UserCategories added successfully', result });
      } catch (error) {
        console.error('Error adding UserCategories:', error);
        res.status(500).json({ message: 'Error adding UserCategories', error });
      }
    });

    // Récupérer toutes les entrées de `usercategorie` avec les détails des utilisateurs et des catégories
    app.get('/usercategorie-details', async (req, res) => {
      try {
        const userCategories = await usercategorieCollection.aggregate([
          {
            $lookup: {
              from: 'users', // Nom de la collection des utilisateurs
              localField: 'id_user',
              foreignField: '_id',
              as: 'userDetails'
            }
          },
          {
            $lookup: {
              from: 'categorie', // Nom de la collection des catégories
              localField: 'id_categorie',
              foreignField: '_id',
              as: 'categorieDetails'
            }
          },
          {
            $lookup: {
              from: 'post', // Nom de la collection des postes
              localField: 'userDetails.postId', // Assurez-vous que ce champ correspond au champ dans votre collection 'users'
              foreignField: '_id',
              as: 'postDetails'
            }
          },
          {
            $lookup: {
              from: 'departements', // Nom de la collection des départements
              localField: 'postDetails.departementId', // Assurez-vous que ce champ correspond au champ dans votre collection 'posts'
              foreignField: '_id',
              as: 'departementDetails'
            }
          },
          {
            $unwind: '$userDetails' // Décomposer les tableaux en objets individuels
          },
          {
            $unwind: '$categorieDetails'
          },
          {
            $unwind: '$postDetails'
          },
          {
            $unwind: '$departementDetails'
          },
          {
            $project: {
              _id: 1,
              'userDetails.name': 1,
              niveau_user: 1,
              'categorieDetails.type': 1,
              'categorieDetails.nom': 1,
              'categorieDetails.niveau': 1,
              'postDetails.nom': 1, // Nom du poste
              'departementDetails.nom': 1 // Nom du département
            }
          }
        ]).toArray();

        res.status(200).json(userCategories);
      } catch (error) {
        console.error('Error fetching usercategorie details:', error);
        res.status(500).json({ message: 'Error fetching usercategorie details', error });
      }
    });

    // Récupérer toutes les entrées de `usercategorie` avec les détails des utilisateurs BY idUSER
    app.get('/usercategorie-details/:id', async (req, res) => {
      try {
        const userId = req.params.id;

        // Convertir l'ID en ObjectId
        const objectId = new ObjectId(userId);

        const userCategoryDetails = await usercategorieCollection.aggregate([
          {
            $match: { id_user: objectId } // Filtrer par l'ID utilisateur
          },
          {
            $lookup: {
              from: 'users', // Nom de la collection des utilisateurs
              localField: 'id_user',
              foreignField: '_id',
              as: 'userDetails'
            }
          },
          {
            $lookup: {
              from: 'categorie', // Nom de la collection des catégories
              localField: 'id_categorie',
              foreignField: '_id',
              as: 'categorieDetails'
            }
          },
          {
            $lookup: {
              from: 'post', // Nom de la collection des postes
              localField: 'userDetails.postId', // Assurez-vous que ce champ correspond au champ dans votre collection 'users'
              foreignField: '_id',
              as: 'postDetails'
            }
          },
          {
            $lookup: {
              from: 'departements', // Nom de la collection des départements
              localField: 'postDetails.departementId', // Assurez-vous que ce champ correspond au champ dans votre collection 'posts'
              foreignField: '_id',
              as: 'departementDetails'
            }
          },
          {
            $unwind: '$userDetails' // Décomposer les tableaux en objets individuels
          },
          {
            $unwind: '$categorieDetails'
          },
          {
            $unwind: '$postDetails'
          },
          {
            $unwind: '$departementDetails'
          },
          {
            $project: {
              _id: 1,
              'userDetails.name': 1,
              niveau_user: 1,
              'categorieDetails.type': 1,
              'categorieDetails.nom': 1,
              'categorieDetails.niveau': 1,
              'postDetails.nom': 1, // Nom du poste
              'departementDetails.nom': 1 // Nom du département
            }
          }
        ]).toArray();

        if (userCategoryDetails.length === 0) {
          return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(userCategoryDetails);
      } catch (error) {
        console.error('Error fetching user category details:', error.message);
        res.status(500).json({ message: 'Error fetching user category details', error: error.message });
      }
    });

    //delete Usercategorie
    app.delete('/usercategorie/:id', async (req, res) => {
      try {
        const { id } = req.params;

        // Convertir l'identifiant en ObjectId
        const result = await usercategorieCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
          res.status(200).json({ message: 'UserCategorie deleted successfully' });
        } else {
          res.status(404).json({ message: 'UserCategorie not found' });
        }
      } catch (error) {
        console.error('Error deleting UserCategorie:', error);
        res.status(500).json({ message: 'Error deleting UserCategorie', error });
      }
    });

    // Mettre à jour les niveaux d'utilisateur dans `usercategorie`
    app.put('/update-usercategorie', async (req, res) => {
      try {
        const { userCategories } = req.body; // Expects an array of user categories to update

        const updatePromises = userCategories.map(async (category) => {
          const { id_user, id_categorie, niveau_user } = category;

          return usercategorieCollection.updateOne(
            { id_user: new ObjectId(id_user), id_categorie: new ObjectId(id_categorie) },
            { $set: { niveau_user } },
            { upsert: true } // Insert if the document does not exist
          );
        });

        await Promise.all(updatePromises);

        res.status(200).json({ message: 'User categories updated successfully' });
      } catch (error) {
        console.error('Error updating user categories:', error);
        res.status(500).json({ message: 'Error updating user categories', error });
      }
    });



    //########################################################
    // ############## CRUD KPI ####################
    //########################################################

    //ADD Kpi
    app.post('/new-kpi', async (req, res) => {
      const { nom, postId, frequence, objectif, date } = req.body;

      try {
        // Vérification des champs requis
        if (!nom || !postId || !frequence || !objectif || !date) {
          return res.status(400).json({ error: 'All fields are required' });
        }

        // Convertir postId en ObjectId
        const postObjectId = new ObjectId(postId);

        // Convertir la date en objet Date
        const categoryDate = new Date(date);

        // Vérifier si la date est valide
        if (isNaN(categoryDate.getTime())) {
          return res.status(400).json({ error: 'Invalid date format' });
        }

        // Créer un nouvel objet KPI
        const newKpi = {
          nom,
          postId: postObjectId,
          frequence,
          objectif,
          date: categoryDate
        };

        // Insérer le nouveau KPI dans la collection
        const result = await kpisCollection.insertOne(newKpi);

        // Envoyer la réponse avec les détails du KPI créé
        res.status(201).json(result);
      } catch (error) {
        console.error('Error adding new Kpi:', error);
        res.status(500).json({ error: 'Failed to add new Kpi' });
      }
    });

    // Route GET pour récupérer les KPI 
    app.get('/kpis', async (req, res) => {
      try {
        const kpis = await kpisCollection.aggregate([
          {
            $lookup: {
              from: 'post', // collection to join
              localField: 'postId', // field from categorie collection
              foreignField: '_id', // field from posts collection
              as: 'postDetails' // alias for the result
            }
          },
          {
            $unwind: {
              path: '$postDetails', // unwind the resulting array to de-normalize the data
              preserveNullAndEmptyArrays: true // keep documents without matching postDetails
            }
          },
          {
            $lookup: {
              from: 'departements', // collection to join
              localField: 'postDetails.departementId', // field from postDetails collection
              foreignField: '_id', // field from departements collection
              as: 'departementDetails' // alias for the result
            }
          },
          {
            $unwind: {
              path: '$departementDetails', // unwind the resulting array to de-normalize the data
              preserveNullAndEmptyArrays: true // keep documents without matching departementDetails
            }
          },
          {
            $project: {
              _id: 1,
              nom: 1,
              frequence: 1,
              objectif: 1,
              postId: 1,
              date: 1, // Assurez-vous que le champ date est inclus dans la projection
              'postDetails.nom': 1, // include post name in the result
              'departementDetails.nom': 1 // include department name in the result
            }
          }

        ]).toArray();

        if (kpis.length === 0) {
          console.log('No results found. Please check the IDs and fields.');
          return res.status(404).json({ message: 'No kpis found' });
        }

        res.json(kpis);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    //rout get by id kpis
    app.get('/kpis/:id', async (req, res) => {
      const { id } = req.params; // Récupérer l'ID des paramètres de la requête

      try {
        const kpi = await kpisCollection.aggregate([
          {
            $match: { _id: new ObjectId(id) } // Filtrer par ID
          },
          {
            $lookup: {
              from: 'post',
              localField: 'postId',
              foreignField: '_id',
              as: 'postDetails'
            }
          },
          {
            $unwind: {
              path: '$postDetails',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'departements',
              localField: 'postDetails.departementId',
              foreignField: '_id',
              as: 'departementDetails'
            }
          },
          {
            $unwind: {
              path: '$departementDetails',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $project: {
              _id: 1,
              nom: 1,
              frequence: 1,
              objectif: 1,
              postId: 1,
              date: 1,
              'postDetails.nom': 1,
              'departementDetails.nom': 1
            }
          }
        ]).toArray();

        if (!kpi.length) {
          return res.status(404).json({ message: 'KPI non trouvé' });
        }

        res.json(kpi[0]); // Retourner le premier élément car l'ID est unique
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

// Route GET pour récupérer les KPI par postId
app.get('/kpis/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

        // Vérifier si l'ID du poste est valide
        if (!ObjectId.isValid(postId)) {
          return res.status(400).json({ error: 'Invalid post ID format' });
        }
 
    const kpis = await kpisCollection.aggregate([
      
      {
        $match: {
          postId: new ObjectId(postId) // Filtrer par l'ID du poste
        }
      },
      {
        $lookup: {
          from: 'post', // Collection à joindre
          localField: 'postId', // Champ de la collection kpis
          foreignField: '_id', // Champ de la collection post
          as: 'postDetails' // Alias pour le résultat
        }
      },
      {
        $unwind: {
          path: '$postDetails', // Décomposer le tableau résultant pour dé-normaliser les données
          preserveNullAndEmptyArrays: true // Conserver les documents sans postDetails correspondant
        }
      },
      {
        $lookup: {
          from: 'departements', // Collection à joindre
          localField: 'postDetails.departementId', // Champ de postDetails
          foreignField: '_id', // Champ de la collection departements
          as: 'departementDetails' // Alias pour le résultat
        }
      },
      {
        $unwind: {
          path: '$departementDetails', // Décomposer le tableau résultant pour dé-normaliser les données
          preserveNullAndEmptyArrays: true // Conserver les documents sans departementDetails correspondant
        }
      },
      {
        $project: {
          _id: 1,
          nom: 1,
          frequence: 1,
          objectif: 1,
          postId: 1,
          date: 1, // Assurez-vous que le champ date est inclus dans la projection
          'postDetails.nom': 1, // Inclure le nom du post dans le résultat
          'departementDetails.nom': 1 // Inclure le nom du département dans le résultat
        }
      }
    ]).toArray();

    if (kpis.length === 0) {
      console.log('No results found for the given post ID.');
      return res.status(404).json({ message: 'No kpis found for the given post ID' });
    }

    res.json(kpis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


    //UpdateKPI
    app.put('/update-kpi/:id', async (req, res) => {
      const { id } = req.params; // Récupérer l'ID du KPI depuis les paramètres de l'URL
      const { nom, postId, frequence, objectif, date } = req.body;

      try {
        // Vérification des champs requis
        if (!nom || !postId || !frequence || !objectif || !date) {
          return res.status(400).json({ error: 'All fields are required' });
        }

        // Convertir postId en ObjectId
        const postObjectId = new ObjectId(postId);

        // Convertir la date en objet Date
        const categoryDate = new Date(date);

        // Vérifier si la date est valide
        if (isNaN(categoryDate.getTime())) {
          return res.status(400).json({ error: 'Invalid date format' });
        }

        // Créer un objet KPI avec les nouvelles valeurs
        const updatedKpi = {
          nom,
          postId: postObjectId,
          frequence,
          objectif,
          date: categoryDate
        };

        // Mettre à jour le KPI dans la collection
        const result = await kpisCollection.updateOne(
          { _id: new ObjectId(id) }, // Filtrer par ID
          { $set: updatedKpi } // Mettre à jour les champs
        );

        // Vérifier si le KPI a été trouvé et mis à jour
        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'KPI not found' });
        }

        // Envoyer la réponse avec les détails du KPI mis à jour
        res.status(200).json({ message: 'KPI updated successfully', updatedKpi });
      } catch (error) {
        console.error('Error updating Kpi:', error);
        res.status(500).json({ error: 'Failed to update Kpi' });
      }
    });

    //delete KPI
    app.delete('/delete-kpis/:id', async (req, res) => {
      const { id } = req.params; // ID du KPI à supprimer

      try {
        const result = await kpisCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'KPI non trouvé' });
        }

        res.status(200).json({ message: 'KPI supprimé avec succès' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });


    

    //########################################################
    // ############## CRUD User KPI ####################
    //########################################################
    

    //Add kpi user
    app.post('/new-userkpi1', async (req, res) => {
      try {
        const userKpis = req.body.userKpis; // Attendez un tableau d'objets
    
        // Vérifier que le tableau et ses éléments sont valides
        if (!Array.isArray(userKpis) || userKpis.length === 0) {
          return res.status(400).json({ message: 'Invalid input: No KPIs provided' });
        }
    
        for (const { id_user, id_kpi, niveau_kpiuser } of userKpis) {
          if (!id_user || !id_kpi || niveau_kpiuser === undefined) {
            return res.status(400).json({ message: 'Invalid input: All fields are required' });
          }
        }
    
        // Convertir les identifiants en ObjectId
        const formattedUserKpis = userKpis.map(kpi => ({
          id_user: new ObjectId(kpi.id_user),
          id_kpi: new ObjectId(kpi.id_kpi),
          niveau_kpiuser: kpi.niveau_kpiuser
        }));
    
        // Insérer les documents dans la collection
        const result = await userKpiCollection.insertMany(formattedUserKpis);
    
        res.status(201).json({ message: 'userKpis added successfully', result });
      } catch (error) {
        console.error('Error adding userKpis:', error);
        res.status(500).json({ message: 'Error adding userKpis', error });
      }
    });
  

    //get KPI User
    app.get('/user-kpi-info', async (req, res) => {
      try {
        const userKpiInfo = await userKpiCollection.aggregate([
          {
            $lookup: {
              from: 'users', // Nom de la collection "users"
              localField: 'id_user', // Champ dans la collection "userKpi"
              foreignField: '_id', // Champ dans la collection "users"
              as: 'user_info' // Nom du tableau pour les informations d'utilisateur jointes
            }
          },
          {
            $lookup: {
              from: 'kpis', // Nom de la collection "kpis"
              localField: 'id_kpi', // Champ dans la collection "userKpi"
              foreignField: '_id', // Champ dans la collection "kpis"
              as: 'kpi_info' // Nom du tableau pour les informations KPI jointes
            }
          },
          {
            $unwind: '$user_info' // Décompose le tableau "user_info" pour accéder aux champs directement
          },
          {
            $unwind: '$kpi_info' // Décompose le tableau "kpi_info" pour accéder aux champs directement
          },
          {
            $lookup: {
              from: 'post', // Nom de la collection "posts"
              localField: 'user_info.postId', // Champ dans la collection "users" qui référence le poste
              foreignField: '_id', // Champ dans la collection "posts"
              as: 'post_info' // Nom du tableau pour les informations de poste jointes
            }
          },
          {
            $unwind: '$post_info' // Décompose le tableau "post_info" pour accéder aux champs directement
          },
          {
            $project: {
              _id: 1, // Inclus le champ _id du résultat
              'user_name': '$user_info.name', // Nom de l'utilisateur
              'user_post': '$post_info.nom', // Nom du poste
              'kpi_name': '$kpi_info.nom', // Nom du KPI
              'kpi_objectif': '$kpi_info.objectif', // Objectif du KPI
              'kpi_date': '$kpi_info.date', // Objectif du KPI
              'niveau_kpiuser': 1 // Inclus le champ niveau_kpiuser tel quel
            }
          }
        ]).toArray();
    
        res.status(200).json(userKpiInfo);
      } catch (error) {
        console.error('Error fetching user KPI info:', error);
        res.status(500).json({ message: 'Error fetching user KPI info', error });
      }
    });
 
    // Get KPI User by user ID
app.get('/user-kpi-info/user/:id', async (req, res) => {
  try {
    const userId = req.params.id; // Récupère l'ID de l'utilisateur à partir des paramètres de la requête

    const userKpiInfo = await userKpiCollection.aggregate([
      {
        $match: { id_user: new ObjectId(userId) } // Filtre les documents en fonction de l'ID de l'utilisateur
      },
      {
        $lookup: {
          from: 'users', // Nom de la collection "users"
          localField: 'id_user', // Champ dans la collection "userKpi"
          foreignField: '_id', // Champ dans la collection "users"
          as: 'user_info' // Nom du tableau pour les informations d'utilisateur jointes
        }
      },
      {
        $lookup: {
          from: 'kpis', // Nom de la collection "kpis"
          localField: 'id_kpi', // Champ dans la collection "userKpi"
          foreignField: '_id', // Champ dans la collection "kpis"
          as: 'kpi_info' // Nom du tableau pour les informations KPI jointes
        }
      },
      {
        $unwind: '$user_info' // Décompose le tableau "user_info" pour accéder aux champs directement
      },
      {
        $unwind: '$kpi_info' // Décompose le tableau "kpi_info" pour accéder aux champs directement
      },
      {
        $lookup: {
          from: 'post', // Nom de la collection "posts"
          localField: 'user_info.postId', // Champ dans la collection "users" qui référence le poste
          foreignField: '_id', // Champ dans la collection "posts"
          as: 'post_info' // Nom du tableau pour les informations de poste jointes
        }
      },
      {
        $unwind: '$post_info' // Décompose le tableau "post_info" pour accéder aux champs directement
      },
      {
        $project: {
          _id: 1, // Inclus le champ _id du résultat
          'user_name': '$user_info.name', // Nom de l'utilisateur
          'user_post': '$post_info.nom', // Nom du poste
          'kpi_name': '$kpi_info.nom', // Nom du KPI
          'kpi_objectif': '$kpi_info.objectif', // Objectif du KPI
          'niveau_kpiuser': 1 // Inclus le champ niveau_kpiuser tel quel
        }
      }
    ]).toArray();

    res.status(200).json(userKpiInfo);
  } catch (error) {
    console.error('Error fetching user KPI info:', error);
    res.status(500).json({ message: 'Error fetching user KPI info', error });
  }
});

// Get KPI User by userKpi ID
app.get('/user-kpi-info/:id', async (req, res) => {
  try {
    const userKpiId = req.params.id; // Récupère l'ID de userKpi à partir des paramètres de la requête

    const userKpiInfo = await userKpiCollection.aggregate([
      {
        $match: { _id: new ObjectId(userKpiId) } // Filtre les documents en fonction de l'ID de userKpi
      },
      {
        $lookup: {
          from: 'users', // Nom de la collection "users"
          localField: 'id_user', // Champ dans la collection "userKpi"
          foreignField: '_id', // Champ dans la collection "users"
          as: 'user_info' // Nom du tableau pour les informations d'utilisateur jointes
        }
      },
      {
        $lookup: {
          from: 'kpis', // Nom de la collection "kpis"
          localField: 'id_kpi', // Champ dans la collection "userKpi"
          foreignField: '_id', // Champ dans la collection "kpis"
          as: 'kpi_info' // Nom du tableau pour les informations KPI jointes
        }
      },
      {
        $unwind: '$user_info' // Décompose le tableau "user_info" pour accéder aux champs directement
      },
      {
        $unwind: '$kpi_info' // Décompose le tableau "kpi_info" pour accéder aux champs directement
      },
      {
        $lookup: {
          from: 'post', // Nom de la collection "posts"
          localField: 'user_info.postId', // Champ dans la collection "users" qui référence le poste
          foreignField: '_id', // Champ dans la collection "posts"
          as: 'post_info' // Nom du tableau pour les informations de poste jointes
        }
      },
      {
        $unwind: '$post_info' // Décompose le tableau "post_info" pour accéder aux champs directement
      },
      {
        $project: {
          _id: 1, // Inclus le champ _id du résultat
          'user_name': '$user_info.name', // Nom de l'utilisateur
          'user_post': '$post_info.nom', // Nom du poste
          'kpi_name': '$kpi_info.nom', // Nom du KPI
          'kpi_objectif': '$kpi_info.objectif', // Objectif du KPI
          'niveau_kpiuser': 1 // Inclus le champ niveau_kpiuser tel quel
        }
      }
    ]).toArray();

    res.status(200).json(userKpiInfo);
  } catch (error) {
    console.error('Error fetching user KPI info:', error);
    res.status(500).json({ message: 'Error fetching user KPI info', error });
  }
});

// Update a userKpi
app.put('/user-kpi/update/:id', async (req, res) => {
  try {
    const userKpiId = req.params.id;
    const { id_user, id_kpi, niveau_kpiuser } = req.body;

    // Vérifier que les données requises sont présentes
    if (!id_user || !id_kpi || niveau_kpiuser === undefined) {
      return res.status(400).json({ message: 'Invalid input: All fields are required' });
    }

    // Convertir les identifiants en ObjectId
    const updatedUserKpi = {
      id_user: new ObjectId(id_user),
      id_kpi: new ObjectId(id_kpi),
      niveau_kpiuser,
    };

    // Mettre à jour le document dans la collection
    const result = await userKpiCollection.updateOne(
      { _id: new ObjectId(userKpiId) },
      { $set: updatedUserKpi }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'userKpi not found' });
    }

    res.status(200).json({ message: 'userKpi updated successfully', result });
  } catch (error) {
    console.error('Error updating userKpi:', error);
    res.status(500).json({ message: 'Error updating userKpi', error });
  }
});


// Delete a userKpi
app.delete('/user-kpi/del/:id', async (req, res) => {
  try {
    const userKpiId = req.params.id;

    // Supprimer le document de la collection
    const result = await userKpiCollection.deleteOne({ _id: new ObjectId(userKpiId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'userKpi not found' });
    }

    res.status(200).json({ message: 'userKpi deleted successfully', result });
  } catch (error) {
    console.error('Error deleting userKpi:', error);
    res.status(500).json({ message: 'Error deleting userKpi', error });
  }
});

    
  
    
 

 //########################################################
    // ########### CRUD Indicateur Globaux  #################
    //########################################################
//add Indicateur
app.post('/new-indicateur-glob', async (req, res) => {
  try {
    const { pourcentage, annee } = req.body;

    // Validation du pourcentage
    if (typeof pourcentage !== 'number' || pourcentage < 0 || pourcentage > 101) {
      return res.status(400).send({ error: 'Pourcentage invalide. Il doit être un nombre entre 0 et 100.' });
    }

    // Validation de l'année au format 'YYYY-MM-DD'
    const anneeRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (typeof annee !== 'string' || !anneeRegex.test(annee)) {
      return res.status(400).send({ error: 'Format d\'année invalide. Elle doit être au format YYYY-MM-DD.' });
    }

    // Optionnel : Si vous voulez valider que l'année est postérieure à 2020
    const anneeValue = new Date(annee).getFullYear();
    if (anneeValue < 2020) {
      return res.status(400).send({ error: 'Année invalide. Elle doit être supérieure ou égale à 2020.' });
    }

    // Création du nouvel indicateur
    const newIndicateur = { pourcentage, annee };
    const result = await indicateurGlobCollection.insertOne(newIndicateur);

    // Réponse en cas de succès
    res.status(201).send(result);
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'indicateur:", error);
    res.status(500).send({ error: 'Une erreur est survenue lors de l\'ajout de l\'indicateur.' });
  }
});


    //Get All indicateur-Glob
    app.get('/indicateurs-glob', async (req, res) => {
      try {
        const indicateurs = await indicateurGlobCollection.find().toArray();
        res.status(200).send(indicateurs);
      } catch (error) {
        console.error("Erreur lors de la récupération des indicateurs:", error);
        res.status(500).send({ error: 'Une erreur est survenue lors de la récupération des indicateurs.' });
      }
    });
    
    //Get indicateur-glob by id
    app.get('/indicateur-glob/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const indicateur = await indicateurGlobCollection.findOne({ _id: new ObjectId(id) });
    
        if (!indicateur) {
          return res.status(404).send({ error: 'Indicateur non trouvé.' });
        }
    
        res.status(200).send(indicateur);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'indicateur par ID:", error);
        res.status(500).send({ error: 'Une erreur est survenue lors de la récupération de l\'indicateur.' });
      }
    });

    //Get indicateur-glob By Date
    app.get('/indicateurs-glob/annee/:annee', async (req, res) => {
      try {
        const annee = parseInt(req.params.annee);
    
        if (isNaN(annee) || annee < 2020 ) {
          return res.status(400).send({ error: 'Année invalide. Elle doit être un nombre entre 2020 ' });
        }
    
        const indicateurs = await indicateurGlobCollection.find({ annee }).toArray();
        res.status(200).send(indicateurs);
      } catch (error) {
        console.error("Erreur lors de la récupération des indicateurs par année:", error);
        res.status(500).send({ error: 'Une erreur est survenue lors de la récupération des indicateurs.' });
      }
    });

    //Delete indicateur-glob By ID
    app.delete('/indicateur-glob/del/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const result = await indicateurGlobCollection.deleteOne({ _id: new ObjectId(id) });
    
        if (result.deletedCount === 0) {
          return res.status(404).send({ error: 'Indicateur non trouvé.' });
        }
    
        res.status(200).send({ message: 'Indicateur supprimé avec succès.' });
      } catch (error) {
        console.error("Erreur lors de la suppression de l'indicateur:", error);
        res.status(500).send({ error: 'Une erreur est survenue lors de la suppression de l\'indicateur.' });
      }
    });
    //Update indicateur-glob 
    app.put('/update-indicateur-glob/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const { pourcentage, annee } = req.body;
    
        // Validation des données
        if (typeof pourcentage !== 'number' || pourcentage < 0 || pourcentage > 100) {
          return res.status(400).send({ error: 'Pourcentage invalide. Il doit être un nombre entre 0 et 100.' });
        }
    
        if (typeof annee !== 'number' || annee < 2020 ) {
          return res.status(400).send({ error: 'Année invalide. Elle doit être < 2020 ' });
        }
    
        const result = await indicateurGlobCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { pourcentage, annee } }
        );
    
        if (result.matchedCount === 0) {
          return res.status(404).send({ error: 'Indicateur non trouvé.' });
        }
    
        res.status(200).send({ message: 'Indicateur mis à jour avec succès.' });
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'indicateur:", error);
        res.status(500).send({ error: 'Une erreur est survenue lors de la mise à jour de l\'indicateur.' });
      }
    });

    //########################################################
    // ########### CRUD Indicateur Structure  #################
    //########################################################
//add Indicateur stru
app.post('/new-indicateur-stru', async (req, res) => {
  try {
    const { taux, moystruc,annee } = req.body;

    const newIndicateur = { taux, moystruc, annee };
    const result = await indicateurStruCollection.insertOne(newIndicateur);
    res.status(201).send(result);
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'indicateur stru:", error);
    res.status(500).send({ error: 'Une erreur est survenue lors de l\'ajout de l\'indicateur stru.' });
  }
});

//Get All indicateur-stru
app.get('/indicateurs-stru', async (req, res) => {
  try {
    const indicateurs = await indicateurStruCollection.find().toArray();
    res.status(200).send(indicateurs);
  } catch (error) {
    console.error("Erreur lors de la récupération des indicateurs stru:", error);
    res.status(500).send({ error: 'Une erreur est survenue lors de la récupération des indicateurs stru.' });
  }
});

//Get indicateur-stru by id
app.get('/indicateur-stru/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const indicateur = await indicateurStruCollection.findOne({ _id: new ObjectId(id) });

    if (!indicateur) {
      return res.status(404).send({ error: 'Indicateur stru non trouvé.' });
    }

    res.status(200).send(indicateur);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'indicateur stru par ID:", error);
    res.status(500).send({ error: 'Une erreur est survenue lors de la récupération de l\'indicateur stru.' });
  }
});

//Get indicateur-stru By Date
app.get('/indicateurs-stru/annee/:annee', async (req, res) => {
  try {
    const annee = parseInt(req.params.annee);

    if (isNaN(annee) || annee < 2020 ) {
      return res.status(400).send({ error: 'Année invalide. Elle doit être un nombre > 2020 ' });
    }

    const indicateurs = await indicateurStruCollection.find({ annee }).toArray();
    res.status(200).send(indicateurs);
  } catch (error) {
    console.error("Erreur lors de la récupération des indicateurs stru par année:", error);
    res.status(500).send({ error: 'Une erreur est survenue lors de la récupération des indicateurs stru.' });
  }
});

//Delete indicateur-stru By ID
app.delete('/indicateur-stru/del/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await indicateurStruCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: 'Indicateur stru non trouvé.' });
    }

    res.status(200).send({ message: 'Indicateur stru supprimé avec succès.' });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'indicateur stru:", error);
    res.status(500).send({ error: 'Une erreur est survenue lors de la suppression de l\'indicateur stru.' });
  }
});
//Update indicateur-stru 
app.put('/update-indicateur-stru/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { taux, moystruc, annee } = req.body;

    const result = await indicateurGlobCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { taux, moystruc, annee } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: 'Indicateur stru non trouvé.' });
    }

    res.status(200).send({ message: 'Indicateur stru mis à jour avec succès.' });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'indicateur:", error);
    res.status(500).send({ error: 'Une erreur est survenue lors de la mise à jour de l\'indicateur stru.' });
  }
});

    
    





    //########################################################
    // ########### CRUD  Formule #################
    //########################################################

    //ADD formule
    app.post('/new-formule', async (req, res) => {
      const newFormule = req.body;
      const result = await formuleCollection.insertOne(newFormule);
      res.send(result);
    });

    // Route GET pour récupérer tous les Formules
    app.get('/formules', async (req, res) => {
      try {
        const formules = await formuleCollection.find({}).toArray();
        res.status(200).json(formules);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Route GET pour récupérer les formules By ID
    app.get('/formules/:id', async (req, res) => {
      const { id } = req.params;

      try {
        const formules = await formuleCollection.findOne({ _id: new ObjectId(id) });
        if (formules.length === 0) {
          return res.status(404).json({ message: 'Aucune formule trouvée pour cette date' });
        }

        res.status(200).json(formules);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Route GET pour récupérer les formules par dateeffet
app.get('/formules/date/:dateeffet', async (req, res) => {
  const { dateeffet } = req.params;

  try {
    const formules = await formuleCollection.find({ dateeffet }).toArray();

    if (formules.length === 0) {
      return res.status(404).json({ message: 'Aucune formule trouvée pour cette date' });
    }

    res.status(200).json(formules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


    // Route PUT pour mettre à jour une formule par ID
    app.put('/update-formule/:id', async (req, res) => {
      const { id } = req.params;
      const updatedFormule = req.body;

      try {
        // Convertir l'ID en ObjectId si nécessaire
        const objectId = new ObjectId(id);

        const result = await formuleCollection.updateOne(
          { _id: objectId },
          { $set: updatedFormule }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'Formule non trouvée' });
        }

        res.status(200).json({ message: 'Formule mise à jour avec succès' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Route DELETE pour supprimer une formule par ID
    app.delete('/del-formule/:id', async (req, res) => {
      const { id } = req.params;

      try {
        // Convertir l'ID en ObjectId si nécessaire
        const objectId = new ObjectId(id);

        const result = await formuleCollection.deleteOne({ _id: objectId });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'Formule non trouvée' });
        }

        res.status(200).json({ message: 'Formule supprimée avec succès' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });




  //########################################################
    // ########### CRUD  note-finale #################
    //########################################################

 //Add Notef
app.post('/new-notef', async (req, res) => {
  const { note, userId } = req.body;

  // Vérifier si userId est fourni
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const currentYear = new Date().getFullYear(); // Obtenir l'année courante

    // Rechercher une note existante pour cet utilisateur dans l'année courante
    const existingNote = await notefCollection.findOne({
      userId: new ObjectId(userId),
      date: {
        $gte: new Date(`${currentYear}-01-01T00:00:00Z`), // Début de l'année
        $lt: new Date(`${currentYear + 1}-01-01T00:00:00Z`) // Début de l'année suivante
      }
    });

    if (existingNote) {
      // Si une note existe déjà pour cette année, envoyer une réponse avec un message d'erreur
      return res.status(400).json({ error: 'Vous avez déjà une note pour cette année.' });
    }

    // Si aucune note n'existe pour cette année, créer une nouvelle note
    const newNotef = {
      note,
      userId: new ObjectId(userId),
      date: new Date(), // Ajouter la date actuelle
    };

    // Insérer le nouveau document
    const result = await notefCollection.insertOne(newNotef);

    // Récupérer le document inséré
    const insertedNote = await notefCollection.findOne({ _id: result.insertedId });
    res.status(201).json(insertedNote); // Envoyer une réponse de succès avec le document inséré
  } catch (error) {
    console.error('Error adding new note:', error); // Afficher l'erreur complète dans les logs
    res.status(500).json({ error: 'Failed to add new note', details: error.message }); // Inclure le message d'erreur détaillé dans la réponse
  }
});


// Get all notes with user and department information
app.get('/notes', async (req, res) => {
  try {
    const notes = await notefCollection.aggregate([
      // Jointure avec la collection des utilisateurs
      {
        $lookup: {
          from: 'users', // Collection des utilisateurs
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true // Inclure les notes même si aucun utilisateur n'est trouvé
        }
      },
      // Jointure avec la collection des postes
      {
        $lookup: {
          from: 'post', // Collection des postes
          localField: 'user.postId', // Relie le champ postId de l'utilisateur
          foreignField: '_id',
          as: 'post'
        }
      },
      {
        $unwind: {
          path: '$post',
          preserveNullAndEmptyArrays: true // Inclure les utilisateurs même si aucun poste n'est trouvé
        }
      },
      // Jointure avec la collection des départements
      {
        $lookup: {
          from: 'departements', // Collection des départements
          localField: 'post.departementId', // Relie le champ departementId du poste
          foreignField: '_id',
          as: 'departement'
        }
      },
      {
        $unwind: {
          path: '$departement',
          preserveNullAndEmptyArrays: true // Inclure les postes même si aucun département n'est trouvé
        }
      },
      // Projection des champs à inclure dans les résultats
      {
        $project: {
          _id: 1, // ID de la note
          note: 1, // Valeur de la note
          date:1,
          'user.name': 1, // Nom de l'utilisateur
          'departement.nom': 1 // Nom du département
        }
      }
    ]).toArray();

    res.json(notes);
  } catch (error) {
    console.error('Error retrieving notes with user and department:', error);
    res.status(500).json({ error: 'Failed to retrieve notes with user and department' });
  }
});

// Supprimer une note par ID
app.delete('/del-note/:id', async (req, res) => {
  const noteId = req.params.id;

  // Vérifier si l'ID est fourni
  if (!noteId) {
    return res.status(400).json({ error: 'ID de la note est requis' });
  }

  try {
    // Supprimer le document de la collection notefCollection par ID
    const result = await notefCollection.deleteOne({ _id: new ObjectId(noteId) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Note supprimée avec succès' });
    } else {
      res.status(404).json({ error: 'Note non trouvée' });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de la note:', error);
    res.status(500).json({ error: 'Échec de la suppression de la note', details: error.message });
  }
});


//########################################################
    // ########### CRUD  Formule-General #################
    //########################################################

    //ADD formule
    app.post('/new-formule-gen', async (req, res) => {
      const newFormule = req.body;
      const result = await formuleGenCollection.insertOne(newFormule);
      res.send(result);
    });

    // Route GET pour récupérer tous les Formules
    app.get('/formules-gen', async (req, res) => {
      try {
        const formules = await formuleGenCollection.find({}).toArray();
        res.status(200).json(formules);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Route GET pour récupérer les formules By ID
    app.get('/formules-gen/:id', async (req, res) => {
      const { id } = req.params;

      try {
        const formules = await formuleGenCollection.findOne({ _id: new ObjectId(id) });
        if (formules.length === 0) {
          return res.status(404).json({ message: 'Aucune formule generale trouvée pour cette id' });
        }

        res.status(200).json(formules);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Route GET pour récupérer les formules par dateeffet
    app.get('/formules-gen/date/:year', async (req, res) => {
      const { year } = req.params;
    
      try {
        const formules = await formuleGenCollection.find({ dateeffet: { $regex: `^${year}` } }).toArray();
    
        if (formules.length === 0) {
          return res.status(404).json({ message: 'Aucune formule générale trouvée pour cette date' });
        }
    
        res.status(200).json(formules);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    


    // Route PUT pour mettre à jour une formule par ID
    app.put('/update-formule-gen/:id', async (req, res) => {
      const { id } = req.params;
      const updatedFormule = req.body;

      try {
        // Convertir l'ID en ObjectId si nécessaire
        const objectId = new ObjectId(id);

        const result = await formuleGenCollection.updateOne(
          { _id: objectId },
          { $set: updatedFormule }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'Formule generale non trouvée' });
        }

        res.status(200).json({ message: 'Formule generale mise à jour avec succès' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Route DELETE pour supprimer une formule par ID
    app.delete('/del-formule-gen/:id', async (req, res) => {
      const { id } = req.params;

      try {
        // Convertir l'ID en ObjectId si nécessaire
        const objectId = new ObjectId(id);

        const result = await formuleGenCollection.deleteOne({ _id: objectId });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'Formule generale non trouvée' });
        }

        res.status(200).json({ message: 'Formule generale supprimée avec succès' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });





    /////////////test///







    //Admin stat 
    app.get('/admin-stats', async (req, res) => {
      // Get approved classes and pending classes and instructors 
      const totaladmin = (await userCollection.find({ role: 'admin' }).toArray()).length;
      const totaluser = (await userCollection.find({ role: 'user' }).toArray()).length;
      const totalsupervisor = (await userCollection.find({ role: 'supervisor' }).toArray()).length;
      const totalEmploye = (await userCollection.find().toArray()).length;
      const totaldepartement = (await departementCollection.find().toArray()).length;
      const result = {
        totaladmin,
        totaluser,
        totalsupervisor,
        totalEmploye,
        totaldepartement,
      }
      res.send(result);

    })

















    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

run().catch(console.dir);

//#######################//
app.get('/', (req, res) => {
  res.send('Hello CDC Server is Running!');
});
