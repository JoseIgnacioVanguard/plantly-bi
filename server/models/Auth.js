const sql = require("mssql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dbConfig = require("../dbConfig");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // 🔒 keep in .env

async function registerUser(user_id, password) {
  try {
    const pool = await sql.connect(dbConfig);

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool
      .request()
      .input("user_id", sql.NVarChar, user_id)
      .input("password", sql.NVarChar, passwordHash).query(`
        INSERT INTO dbo._users_plantly_bi (user_id,principal_name, password, create_date, modify_date)
        VALUES (@user_id,@user_id, @password, GETDATE(), GETDATE())
      `);

    return result.rowsAffected[0];
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

async function loginUser(user_id, password) {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .input("user_id", sql.NVarChar, user_id)
      .query(`SELECT * FROM dbo._users_plantly_bi WHERE user_id = @user_id`);

    const user = result.recordset[0];
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) throw new Error("Invalid credentials");

    // inside loginUser()
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role }, // 👈 add role
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { token, user: { user_id: user.user_id, role: user.role } };
  } catch (error) {
    console.error("Error logging in user:", error.message);
    throw error;
  }
}

module.exports = {
  registerUser,
  loginUser,
};
