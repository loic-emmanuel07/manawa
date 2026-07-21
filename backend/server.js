require('dotenv').config();
const express = require('express');
const supabase = require('./supabaseClient');

const app = express();
app.use(express.json());
app.get('/', async (req, res) => {
  const { data, error } = await supabase.from('utilisateur').select('*');
  
  if (error) {
    return res.status(500).json({ message: 'Erreur de connexion', error: error.message });
  }
  
  res.json({ message: 'Connexion réussie!', data })
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));