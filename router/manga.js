const express = require('express');
const router = express.Router();
const sql = require('mssql');
const conn = require('../config');

async function crud_cars(req, res, hash){
    const { id } = req.params;
    const { name_manga, id_author, cap_manga, genre_manga, debut_manga, cover_manga, status_manga } = req.body;
    const protocol = req.originalUrl.split('/')[2];
    console.log(protocol);
    const crud = {
        read_all: `SELECT * FROM tb_mangas`,
        read: `SELECT * FROM tb_mangas WHERE id = ${id}`,
        create: `INSERT INTO tb_mangas (name_manga, id_author, cap_manga, genre_manga, debut_manga, cover_manga, status_manga) VALUES ('${name_manga}', ${id_author}, ${cap_manga}, '${genre_manga}', '${debut_manga}', '${cover_manga}', '${status_manga}')`,
        update: `UPDATE tb_mangas SET name_manga = '${name_manga}', id_author = ${id_author}, cap_manga = ${cap_manga}, genre_manga = '${genre_manga}', debut_manga = '${debut_manga}', cover_manga = '${cover_manga}', status_manga = '${status_manga}' WHERE id_manga = ${id}`,
        delete: `DELETE FROM tb_mangas WHERE id = ${id}`,
    };
    const pool = new sql.ConnectionPool(conn.databases[0]);
    pool.on("error", err => {console.log(err)});

    try {
        await pool.connect();
        const result = await pool.request().query(crud[protocol]);

        return r = {
            "success": result.recordset
        };
    }
    catch (error){
        return error;
    }
    finally {
        pool.close();
    }
}

router.get('/read_all', async function(req, res){
    const result = await crud_cars(req);
    console.log(result);
    res.send(result);
});

router.get('/read/:id', async function(req, res){
    const result = await crud_cars(req);
    console.log(result);
    res.send(result);
});

router.post('/create', async function(req, res){
    const result = await crud_cars(req);
    console.log(result);
    res.send(result);
});

router.put('/update/:id', async function(req, res){
    const result = await crud_cars(req);
    console.log(result);
    res.send(result);
});

router.delete('/delete/:id', async function(req, res){
    const result = await crud_cars(req);
    console.log(result);
    res.send(result);
});

module.exports = router;