import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminUsers.css";

function AdminUsers() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);


  // Get currently logged-in user

  const loggedInUser = JSON.parse(
    localStorage.getItem("user")
  );


  // Fetch all users

  const fetchUsers = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:8080/users",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUsers(response.data);

    } catch (error) {

      console.error("Error fetching users:", error);

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchUsers();

  }, []);


  // Delete user

  const handleDeleteUser = async (userId, userName) => {

    // Prevent deleting the currently logged-in admin

    if (
      loggedInUser &&
      Number(loggedInUser.id) === Number(userId)
    ) {

      alert(
        "You cannot delete the account you are currently logged in with."
      );

      return;

    }


    // Confirmation

    const confirmed = window.confirm(
      `Are you sure you want to delete ${userName}?`
    );

    if (!confirmed) {
      return;
    }


    try {

      setDeletingId(userId);

      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:8080/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      // Remove deleted user from table

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user.id !== userId
        )
      );


      alert("User deleted successfully.");

    } catch (error) {

      console.error(
        "Error deleting user:",
        error
      );


      if (error.response?.data) {

        alert(
          typeof error.response.data === "string"
            ? error.response.data
            : "Unable to delete user."
        );

      } else {

        alert(
          "Unable to delete user. Please try again."
        );

      }

    } finally {

      setDeletingId(null);

    }

  };


  // Loading

  if (loading) {

    return (
      <div className="admin-users">
        <h2>Loading users...</h2>
      </div>
    );

  }


  return (

    <div className="admin-users">

      {/* =========================
          PAGE HEADER
      ========================== */}

      <div className="admin-users-header">

        <div>

          <h1>👥 Manage Users</h1>

          <p>
            View and manage registered MovieStream users.
          </p>

        </div>

      </div>


      {/* =========================
          USERS TABLE
      ========================== */}

      <div className="users-table-container">

        <table>

          <thead>

            <tr>

              <th>ID</th>

              <th>Name</th>

              <th>Email</th>

              <th>Role</th>

              <th>Membership</th>

              <th>Action</th>

            </tr>

          </thead>


          <tbody>

            {users.length === 0 ? (

              <tr>

                <td colSpan="6">
                  No users found.
                </td>

              </tr>

            ) : (

              users.map((user) => {

                const isCurrentUser =
                  loggedInUser &&
                  Number(loggedInUser.id) ===
                    Number(user.id);


                return (

                  <tr key={user.id}>

                    <td>
                      {user.id}
                    </td>

                    <td>
                      {user.name}
                    </td>

                    <td>
                      {user.email}
                    </td>

                    <td>
                      {user.role}
                    </td>

                    <td>
                      {user.membership}
                    </td>

                    <td>

                      {isCurrentUser ? (

                        <span className="admin-user-label">
                          Current Admin
                        </span>

                      ) : (

                        <button
                          className="delete-user-button"
                          onClick={() =>
                            handleDeleteUser(
                              user.id,
                              user.name
                            )
                          }
                          disabled={
                            deletingId === user.id
                          }
                        >

                          {deletingId === user.id
                            ? "Deleting..."
                            : "🗑 Delete"}

                        </button>

                      )}

                    </td>

                  </tr>

                );

              })

            )}

          </tbody>

        </table>

      </div>

    </div>

  );
}

export default AdminUsers;