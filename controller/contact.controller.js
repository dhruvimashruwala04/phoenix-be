const { pool } = require("../config/database");

const getContacts = async (req, res, next) => {
  try {
    const contacts = await pool.query("SELECT * FROM contacts");
    res.status(200).json({
      success: true,
      data: contacts.rows,
    });
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, city } = req.body;
    const result = await pool.query(
      `INSERT INTO contacts (name, email, phone, city) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, phone, city],
    );
    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create contact error:", error);
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, email, phone, city } = req.body;
    const result = await pool.query(
      `UPDATE contacts SET (name, email, phone, city) = ($1, $2, $3, $4) WHERE id = $5 RETURNING *`,
      [name, email, phone, city, id],
    );
    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await pool.query(
      `DELETE FROM contacts WHERE id = $1 RETURNING *`,
      [id],
    );
    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
};
