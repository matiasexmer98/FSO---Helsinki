const Filter = ({ setFilteredName }) => {
  const handleFilterChange = (event) => {
    setFilteredName(event.target.value);
  };

  return (
    <div>
      filter shown with
      <input onChange={handleFilterChange} />
    </div>
  );
};

export default Filter;
