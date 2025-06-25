const router = require("express").Router();
const connection = require("../dbconfig/config");

// insert a new User
router.post("/insert", (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const insertQuery = `INSERT INTO user (name,email,password,role) values(? ,?, ?,?)`;

    const values = [];

    if (name) {
      values.push(name);
    }
    if (email) {
      values.push(email);
    }
    if (password) {
      values.push(password);
    }
    connection.query(insertQuery, values, (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log("User inserted Succssfully");
      }
    });
    res.status(201).json("User inserted Succssfully");
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ message: e.message });
  }
});

// retrive users

router.get("/getAllUser", (req, res) => {
  // const getQuery = `SELECT * FROM user`;
  const usersData = connection.query("SELECT * FROM user", (err, result) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log(console.log(usersData));
    }
  });
});

// createProject  by admin and manager

router.post("/projects", (req, res) => {
  const { role, name, description, created_by } = req.body;
  //   console.log(req.body);

  try {
    if (!role || !name || !description || !created_by) {
      throw new Error("Please Fill All Fields");
    }
    if (role === "user") {
      throw new Error("User Not accessed This api");
    }
    const createProjectQuery = `INSERT INTO projects (name,description,created_by) values(?, ?,?)`;
    connection.query(
      createProjectQuery,
      [role, name, description, created_by],
      (err, result) => {
        if (err) {
          console.log("error find is ", err.message);
        } else {
          console.log("Project Created Successfully");
        }
      }
    );
    res.status(201).json("Project Created Successfully");
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ message: e.message });
  }
});

// add task

router.post("/tasks", (req, res) => {
  const { role, name, description, created_by } = req.body;
  console.log(req.body);

  try {
    if (!role || !name || !description || !created_by) {
      throw new Error("Please Fill All Fields");
    }
    if (role === "user") {
      throw new Error("User Not accessed This api");
    }
    const createProjectQuery = `INSERT INTO projects (name,description,created_by) values(?, ?,?)`;
    connection.query(
      createProjectQuery,
      [role, name, description, created_by],
      (err, result) => {
        if (err) {
          console.log("error find is ", err.message);
        } else {
          console.log("Project Created Successfully");
        }
      }
    );
    res.status(201).json("Project Created Successfully");
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ message: e.message });
  }
});

router.patch("/tasks/:id/status", (req, res) => {
  const taskId = req.params.id;
  const { status, userId } = req.body;

  const getTaskQuery = `
      SELECT t.assigned_to, u.role 
      FROM tasks t
      JOIN users u ON u.id = ?
      WHERE t.id = ?
    `;

  connection.query(getTaskQuery, [userId, taskId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0)
      return res.status(404).json({ error: "Task or user not found" });

    const task = results[0];

    if (
      task.assigned_to !== userId &&
      task.role !== "Manager" &&
      task.role !== "Admin"
    ) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You cannot update this task" });
    }

    const updateQuery = `
        UPDATE tasks
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

    connection.query(updateQuery, [status, taskId], (err2) => {
      if (err2)
        return res.status(500).json({ error: "Failed to update task status" });

      const logQuery = `
          INSERT INTO activity_logs (user_id, action, task_id, timestamp)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        `;
      const action = `Updated task status to '${status}'`;

      connection.query(logQuery, [userId, action, taskId], (err3) => {
        if (err3)
          return res.status(500).json({ error: "Failed to log activity" });

        return res
          .status(200)
          .json({ message: "Task status updated and activity logged." });
      });
    });
  });
});

router.get("/tasks", (req, res) => {
  const { userId, status, project_id, due_date } = req.query;

  const getUserQuery = `SELECT role FROM users WHERE id = ?`;

  connection.query(getUserQuery, [userId], (err, userResults) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (userResults.length === 0)
      return res.status(404).json({ error: "User not found" });

    const role = userResults[0].role;
    let query = "";
    let params = [];

    if (role === "Admin") {
      query = `SELECT * FROM tasks WHERE 1=1`;
    } else if (role === "Manager") {
      query = `
          SELECT t.* FROM tasks t
          JOIN projects p ON t.project_id = p.id
          WHERE p.created_by = ?
        `;
      params.push(userId);
    } else {
      query = `SELECT * FROM tasks WHERE assigned_to = ?`;
      params.push(userId);
    }

    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }
    if (project_id) {
      query += ` AND project_id = ?`;
      params.push(project_id);
    }
    if (due_date) {
      query += ` AND due_date = ?`;
      params.push(due_date);
    }

    connection.query(query, params, (err2, tasks) => {
      if (err2) return res.status(500).json({ error: "Error fetching tasks" });
      res.json(tasks);
    });
  });
});
module.exports = router;
