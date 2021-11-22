export const SearchPanel = ({ users, setUsers, param, setParam }) => {
  return (
    <form>
      {/* setParam(Object.assign({},param, {name: e.target.value })) */}
      <input
        value={param.name}
        onChange={(e) => setParam({ ...param, name: e.target.value })}
      />
      <select
        value={param.personId}
        onChange={(e) => setParam({ ...param, personId: e.target.value })}
      >
        <option value={''}>负责人</option>
        {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
      </select>
    </form>
  );
};
