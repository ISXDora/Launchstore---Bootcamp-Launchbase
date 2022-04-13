const db = require("../../config/db")

module.exports = {
    create({filename, path, product_id}) { // desestruturação do req.body ---não esquecer chaves se não, vai entrar os dados em 1 único campo na tabela
        const query = `
            INSERT INTO files (
                name,
                path,
                product_id
            ) VALUES ($1, $2, $3)
            RETURNING id
            `
        const values = [
            filename,
            path,
            product_id
        ]

        return db.query(query, values)
    }
}