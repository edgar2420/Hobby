const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'finanzas'
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('Conectado a MySQL');
});

// Crear categoría
app.post('/api/categories', (req, res) => {
    const { name, type, color, icon } = req.body;
    
    // Validación
    if (!name || !type || !color || !icon) {
        return res.status(400).json({ 
            error: 'Todos los campos son requeridos' 
        });
    }

    const query = 'INSERT INTO categories (name, type, color, icon) VALUES (?, ?, ?, ?)';
    
    db.query(query, [name, type, color, icon], (err, result) => {
        if (err) {
            console.error('Error al crear categoría:', err);
            return res.status(500).json({ 
                error: 'Error al crear categoría',
                details: err.message 
            });
        }
        
        // Devuelve la categoría creada
        const newCategory = {
            id: result.insertId,
            name,
            type,
            color,
            icon
        };
        
        res.status(201).json(newCategory);
    });
});

// Obtener categorías
app.get('/api/categories', (req, res) => {
    const query = 'SELECT * FROM categories ORDER BY type DESC, name ASC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener categorías:', err);
            return res.status(500).json({ 
                error: 'Error al obtener categorías',
                details: err.message 
            });
        }
        res.json(results);
    });
});

// Actualizar categoría
app.put('/api/categories/:id', (req, res) => {
    const { name, type, color, icon } = req.body;
    const { id } = req.params;
    
    const query = 'UPDATE categories SET name = ?, type = ?, color = ?, icon = ? WHERE id = ?';
    
    db.query(query, [name, type, color, icon, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar categoría:', err);
            return res.status(500).json({ 
                error: 'Error al actualizar categoría',
                details: err.message 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Categoría no encontrada' 
            });
        }
        
        res.json({ id, name, type, color, icon });
    });
});

// Eliminar categoría
app.delete('/api/categories/:id', (req, res) => {
    const { id } = req.params;
    
    const query = 'DELETE FROM categories WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar categoría:', err);
            return res.status(500).json({ 
                error: 'Error al eliminar categoría',
                details: err.message 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Categoría no encontrada' 
            });
        }
        
        res.json({ message: 'Categoría eliminada correctamente' });
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});