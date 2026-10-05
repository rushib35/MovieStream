import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminMemberships.css";

function AdminMemberships() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedMembership, setSelectedMembership] = useState("FREE");

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

  const handleManage = (user) => {
    setEditingUserId(user.id);
    setSelectedMembership(user.membership);
  };

  const handleUpdateMembership = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8080/users/${userId}/membership`,
        {
          membership: selectedMembership
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      /*
       * Update the user list immediately
       */
      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                membership: selectedMembership
              }
            : user
        )
      );

      /*
       * Check whether the updated user is the
       * currently logged-in user.
       */
      const loggedInUser = JSON.parse(
        localStorage.getItem("user")
      );

      if (
        loggedInUser &&
        Number(loggedInUser.id) === Number(userId)
      ) {
        /*
         * Update localStorage with the new membership
         */
        const updatedUser = {
          ...loggedInUser,
          membership: selectedMembership
        };

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        /*
         * Tell Navbar that the user information changed
         */
        window.dispatchEvent(
          new Event("userUpdated")
        );
      }

      alert("Membership updated successfully!");

      setEditingUserId(null);

    } catch (error) {
      console.error(
        "Error updating membership:",
        error
      );

      alert("Failed to update membership.");
    }
  };

  const handleCancel = () => {
    setEditingUserId(null);
  };

  if (loading) {
    return (
      <div className="admin-memberships">
        <h2>Loading memberships...</h2>
      </div>
    );
  }

  return (
    <div className="admin-memberships">

      <div className="admin-memberships-header">

        <div>
          <h1>⭐ Manage Memberships</h1>

          <p>
            View and manage MovieStream user membership status.
          </p>
        </div>

      </div>

      <div className="membership-table-container">

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

              users.map((user) => (

                <tr key={user.id}>

                  <td>{user.id}</td>

                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>{user.role}</td>

                  <td>

                    {user.membership === "GOLD" ? (

                      <span className="gold-membership">
                        ⭐ GOLD
                      </span>

                    ) : (

                      <span>
                        🎬 FREE
                      </span>

                    )}

                  </td>

                  <td>

                    {editingUserId === user.id ? (

                      <div className="membership-edit">

                        <select
                          value={selectedMembership}
                          onChange={(event) =>
                            setSelectedMembership(
                              event.target.value
                            )
                          }
                        >

                          <option value="FREE">
                            FREE
                          </option>

                          <option value="GOLD">
                            GOLD
                          </option>

                        </select>

                        <button
                          className="save-membership-btn"
                          onClick={() =>
                            handleUpdateMembership(user.id)
                          }
                        >
                          Save
                        </button>

                        <button
                          className="cancel-membership-btn"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>

                      </div>

                    ) : (

                      <button
                        className="membership-btn"
                        onClick={() =>
                          handleManage(user)
                        }
                      >
                        Manage
                      </button>

                    )}

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminMemberships;