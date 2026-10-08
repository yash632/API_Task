const UserRow = ({ user, index }) => {
  return (
    <tr>
      <td>{index}</td>
      <td className="font-medium">{user.name}</td>
      <td>{user.email}</td>
      <td>{user.age}</td>
      <td>{user.city}</td>
      <td>
        <span className="badge">{user.role}</span>
      </td>
      <td>₹{user.salary?.toLocaleString("en-IN")}</td>
    </tr>
  );
};

export default UserRow;
