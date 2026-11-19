const { pool } = require("../config/database");
const AppError = require("../middleware/AppError");
const crypto = require("crypto");

const generateInviteToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const addWorkspace = async (req, res, next) => {
  try {
    const { name, slug } = req.body;

    const result = await pool.query(
      `INSERT INTO workspaces (name, slug, owner_id, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      RETURNING *
      `,
      [name, slug, req.user.userId],
    );
    res.status(201).json({
      sucess: true,
      message: "Workspace created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const addInvites = async (req, res, next) => {
  try {
    const { workspace_id, invites } = req.body;

    for (const i of invites) {
      const token = generateInviteToken();
      const hashedToken = hashToken(token);

      await pool.query(
        `INSERT INTO workspace_invites (workspace_id, email, role, status, invited_by, department, token, expires_at)
      VALUES ($1, $2, $3, 'Pending', $4, $5, $6, NOW() + INTERVAL '7 days')`,
        [
          workspace_id,
          i.email,
          i.role,
          req.user.userId,
          i.department,
          hashedToken,
        ],
      );
    }
    res.status(201).json({
      sucess: true,
      message: "Invites added successfully",
    });
  } catch (error) {
    next(error);
  }
};

const addWorkspaceMember = async (req, res, next) => {
  try {
    const { workspace_id, access_role } = req.body;
    const result = await pool.query(
      `INSERT INTO workspace_members (workspace_id, access_role, user_id)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [workspace_id, access_role, req.user.userId],
    );
    res.status(201).json({
      sucess: true,
      message: "Workspace member added successfully",
      data: result.rows[0],
    });
  } catch (error) {}
};

const addProject = async (req, res, next) => {
  try {
    const { workspace_id, projectName } = req.body;

    const result = await pool.query(
      `INSERT INTO projects (workspace_id, name, created_by)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [workspace_id, projectName, req.user.userId],
    );
    res.status(201).json({
      sucess: true,
      message: "Project added successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const getWorkspaceInvites = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT
          wi.*,
          w.name AS workspace_name,
          u.name AS invited_by_name
       FROM workspace_invites wi
       JOIN workspaces w ON w.id = wi.workspace_id
       LEFT JOIN users u ON u.id = wi.invited_by
       ORDER BY wi.created_at DESC`,
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

const updateWorkspaceInvite = async (req, res, next) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { status } = req.body;

    await client.query("BEGIN");

    const data = await client.query(
      `SELECT * FROM workspace_invites
       WHERE id = $1`,
      [id],
    );

    const invite = data.rows[0];

    if (status === "accepted") {
      const userResult = await client.query(
        `SELECT id FROM users
         WHERE LOWER(email) = LOWER($1)`,
        [invite.email],
      );

      if (userResult.rows.length === 0) {
        const error = new Error("This user is not registered on Phoenix yet");
        error.statusCode = 404;
        throw error;
      }

      const userId = userResult.rows[0].id;

      await client.query(
        `INSERT INTO workspace_members
         (workspace_id, user_id, access_role)
         VALUES ($1, $2, $3)
         ON CONFLICT (workspace_id, user_id) DO NOTHING`,
        [invite.workspace_id, userId, invite.access_role],
      );
    }

    await client.query(
      `UPDATE workspace_invites
       SET status = $1
       WHERE id = $2`,
      [status, id],
    );

    await client.query("COMMIT");

    res.status(200).json({
      success: true,
      message: `Invitation ${status} successfully`,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
};

module.exports = {
  addWorkspace,
  addInvites,
  addProject,
  addWorkspaceMember,
  getWorkspaceInvites,
  updateWorkspaceInvite,
};
