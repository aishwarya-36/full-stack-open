const Filter = ({ searchQuery, handleSearch }) => {
  return (
    <div>
      filter shown with
      <input value={searchQuery} onChange={handleSearch} />
    </div>
  );
};

export default Filter;
